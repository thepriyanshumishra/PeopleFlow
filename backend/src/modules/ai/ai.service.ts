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

export const analyzeLeaveRequest = async (reason: string): Promise<LeaveAnalysisResult> => {
  if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
    logger.warn('Gemini API key not configured. Using fallback AI analysis.');
    return getFallbackAnalysis(reason);
  }

  try {
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
- If the reason involves medical issues → Sick Leave, High priority
- If the reason involves planned personal activities → Paid Leave, Low/Medium priority  
- If no sufficient balance → Unpaid Leave
- Priority: High for medical/emergency, Medium for family matters, Low for planned activities`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const parsed = JSON.parse(jsonMatch[0]) as LeaveAnalysisResult;
    
    // Validate and sanitize
    return {
      summary: String(parsed.summary || '').slice(0, 500),
      suggestedType: LEAVE_TYPES.includes(parsed.suggestedType) ? parsed.suggestedType : 'Paid Leave',
      priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Medium',
      recommendation: String(parsed.recommendation || '').slice(0, 500),
    };
  } catch (error) {
    logger.error('Gemini AI analysis failed, using fallback:', error);
    return getFallbackAnalysis(reason);
  }
};
