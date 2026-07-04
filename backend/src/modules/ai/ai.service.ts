import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config';
import { logger } from '../../shared/utils/logger';

interface LeaveAnalysisResult {
  summary: string;
  suggestedType: string;
  priority: string;
  recommendation: string;
}

const LEAVE_TYPES = ['Sick Leave', 'Paid Leave', 'Unpaid Leave'];

// Model priority list — confirmed working with this API key (tested 2024-07-04)
// Ordered lightest → heaviest for best rate limits
const MODEL_PRIORITY = [
  'gemini-2.5-flash-lite',      // Lightest — best rate limits
  'gemini-flash-lite-latest',    // Alias for latest lite
  'gemini-3.1-flash-lite',       // 3.1 generation lite
  'gemini-2.5-flash',            // Standard fallback
  'gemini-flash-latest',         // Latest flash alias
];

const RETRY_DELAYS_MS = [0, 1500, 3000]; // Retry delays for 503 transient errors

const getFallbackAnalysis = (reason: string): LeaveAnalysisResult => {
  const lowerReason = reason.toLowerCase();
  
  let suggestedType = 'Paid Leave';
  let priority = 'Medium';
  let recommendation = 'Standard leave approval process applies.';

  if (lowerReason.includes('sick') || lowerReason.includes('fever') || 
      lowerReason.includes('ill') || lowerReason.includes('hospital') || 
      lowerReason.includes('medical') || lowerReason.includes('doctor')) {
    suggestedType = 'Sick Leave';
    priority = 'High';
    recommendation = 'Medical documentation may be required for extended sick leave.';
  } else if (lowerReason.includes('personal') || lowerReason.includes('family') || 
             lowerReason.includes('emergency')) {
    suggestedType = 'Paid Leave';
    priority = 'High';
    recommendation = 'Personal/family emergency. Consider expedited approval.';
  } else if (lowerReason.includes('vacation') || lowerReason.includes('trip') || 
             lowerReason.includes('travel')) {
    suggestedType = 'Paid Leave';
    priority = 'Low';
    recommendation = 'Planned leave. Ensure work handover before departure.';
  }

  const words = reason.split(' ').slice(0, 15).join(' ');
  const summary = `Employee requests leave for: ${words}${reason.split(' ').length > 15 ? '...' : ''}.`;

  return { summary, suggestedType, priority, recommendation };
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const tryModelWithRetry = async (
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<string | null> => {
  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300 },
      });
      return result.response.text().trim();
    } catch (err: any) {
      const msg = String(err?.message || '');
      const status = err?.status ?? '';

      if (String(status).includes('503') || msg.includes('high demand') || msg.includes('503')) {
        // Transient overload — retry this model
        logger.warn(`Model ${modelName} overloaded (503), attempt ${attempt + 1}/${RETRY_DELAYS_MS.length}…`);
        continue;
      } else if (String(status).includes('429') || msg.includes('quota')) {
        // Hard quota — skip to next model immediately
        logger.warn(`Model ${modelName} rate-limited (429), skipping to next model…`);
        return null;
      } else if (String(status).includes('404') || msg.includes('not found')) {
        // Model doesn't exist — skip
        logger.warn(`Model ${modelName} not found (404), skipping…`);
        return null;
      } else {
        logger.warn(`Model ${modelName} error: ${msg.slice(0, 100)}, attempt ${attempt + 1}…`);
        continue;
      }
    }
  }
  // All retries exhausted for this model
  logger.warn(`Model ${modelName} exhausted all retries, moving to next model…`);
  return null;
};

export const analyzeLeaveRequest = async (reason: string): Promise<LeaveAnalysisResult> => {
  if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
    logger.warn('Gemini API key not configured. Using fallback AI analysis.');
    return getFallbackAnalysis(reason);
  }

  const prompt = `You are an HR assistant analyzing a leave request for an employee.

Employee leave reason: "${reason}"

Available leave types: ${LEAVE_TYPES.join(', ')}

Analyze this leave request and respond ONLY with a valid JSON object in exactly this format (no markdown, no explanation):
{
  "summary": "A brief 1-2 sentence professional summary of the leave reason",
  "suggestedType": "One of: Sick Leave, Paid Leave, or Unpaid Leave",
  "priority": "One of: Low, Medium, High",
  "recommendation": "A brief 1 sentence recommendation for the HR admin"
}

Base your analysis on:
- Medical issues (sick, fever, doctor, hospital) → Sick Leave, High priority
- Planned personal activities (vacation, travel) → Paid Leave, Low priority
- Family/personal emergency → Paid Leave, High priority
- Other → Paid Leave, Medium priority`;

  try {
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

    // Try each model in priority order (lightest first)
    for (const modelName of MODEL_PRIORITY) {
      const text = await tryModelWithRetry(genAI, modelName, prompt);
      
      if (!text) continue;

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.warn(`Model ${modelName} returned non-JSON, trying next model.`);
        continue;
      }

      try {
        const parsed = JSON.parse(jsonMatch[0]) as LeaveAnalysisResult;
        logger.info(`✅ AI leave analysis done using model: ${modelName}`);
        return {
          summary: String(parsed.summary || '').slice(0, 500),
          suggestedType: LEAVE_TYPES.includes(parsed.suggestedType) ? parsed.suggestedType : 'Paid Leave',
          priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Medium',
          recommendation: String(parsed.recommendation || '').slice(0, 500),
        };
      } catch {
        logger.warn(`Model ${modelName} JSON parse failed, trying next.`);
        continue;
      }
    }

    // All models exhausted — use keyword fallback
    logger.warn('All Gemini models failed. Using keyword-based fallback analysis.');
    return getFallbackAnalysis(reason);

  } catch (error) {
    logger.error('Gemini AI error, using fallback:', error);
    return getFallbackAnalysis(reason);
  }
};
