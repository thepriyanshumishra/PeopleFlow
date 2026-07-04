import { prisma } from '../../config/database';
import { logger } from '../../shared/utils/logger';
import { getPaginationParams } from '../../shared/utils/response';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActivityModule =
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'employee'
  | 'department'
  | 'auth'
  | 'system'
  | 'ai';

export type ActivitySeverity = 'info' | 'success' | 'warning' | 'error' | 'ai';

export interface LogActivityInput {
  module: ActivityModule;
  action: string;
  description: string;
  actorId?: number;
  actorName?: string;
  actorRole?: string;
  targetId?: number;
  targetName?: string;
  employeeId?: number;
  departmentId?: number;
  metadata?: Record<string, unknown>;
  severity?: ActivitySeverity;
  isAdminOnly?: boolean;
}

// ─── Core Logger ─────────────────────────────────────────────────────────────

/**
 * Universal activity logger — call this from any service/route to record an event.
 * Never throws — activity logging must never break the primary operation.
 */
export const logActivity = async (input: LogActivityInput): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        module: input.module,
        action: input.action,
        description: input.description,
        actorId: input.actorId ?? null,
        actorName: input.actorName ?? null,
        actorRole: input.actorRole ?? null,
        targetId: input.targetId ?? null,
        targetName: input.targetName ?? null,
        employeeId: input.employeeId ?? null,
        departmentId: input.departmentId ?? null,
        metadata: input.metadata ? (input.metadata as object) : undefined,
        severity: input.severity ?? 'info',
        isAdminOnly: input.isAdminOnly ?? false,
      },
    });
  } catch (err) {
    // Log the error but NEVER propagate — activity logging is non-critical
    logger.warn('Activity logging failed (non-fatal):', err);
  }
};

// ─── Feed Query ──────────────────────────────────────────────────────────────

export interface ActivityFeedParams {
  page?: string;
  limit?: string;
  module?: string;
  search?: string;
  employeeId?: string;
  departmentId?: string;
  severity?: string;
  from?: string;
  to?: string;
  isAdmin: boolean;
  requestingEmployeeId?: number;
}

export const getActivityFeed = async (params: ActivityFeedParams) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  // Build where clause
  const where: Record<string, unknown> = {};

  // Role-based scoping — employees only see their own activities
  if (!params.isAdmin) {
    where.isAdminOnly = false;
    if (params.requestingEmployeeId) {
      where.employeeId = params.requestingEmployeeId;
    }
  }

  // Module filter
  if (params.module && params.module !== 'all') {
    where.module = params.module;
  }

  // Employee filter (admin only)
  if (params.isAdmin && params.employeeId) {
    where.employeeId = parseInt(params.employeeId, 10);
  }

  // Department filter (admin only)
  if (params.isAdmin && params.departmentId) {
    where.departmentId = parseInt(params.departmentId, 10);
  }

  // Severity filter
  if (params.severity) {
    where.severity = params.severity;
  }

  // Date range
  if (params.from || params.to) {
    const dateFilter: Record<string, Date> = {};
    if (params.from) dateFilter.gte = new Date(params.from);
    if (params.to) {
      const to = new Date(params.to);
      to.setHours(23, 59, 59, 999);
      dateFilter.lte = to;
    }
    where.createdAt = dateFilter;
  }

  // Full-text search across description, actorName, targetName
  if (params.search) {
    const q = params.search.trim();
    (where as Record<string, unknown>).OR = [
      { description: { contains: q, mode: 'insensitive' } },
      { actorName: { contains: q, mode: 'insensitive' } },
      { targetName: { contains: q, mode: 'insensitive' } },
      { module: { contains: q, mode: 'insensitive' } },
      { action: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [activities, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Stats for filter badges ──────────────────────────────────────────────────

export const getActivityStats = async (isAdmin: boolean, employeeId?: number) => {
  const baseWhere: Record<string, unknown> = {};
  if (!isAdmin) {
    baseWhere.isAdminOnly = false;
    if (employeeId) baseWhere.employeeId = employeeId;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, byModule] = await prisma.$transaction([
    prisma.activityLog.count({ where: baseWhere }),
    prisma.activityLog.count({
      where: { ...baseWhere, createdAt: { gte: today } },
    }),
    prisma.activityLog.groupBy({
      by: ['module'],
      where: baseWhere as Parameters<typeof prisma.activityLog.groupBy>[0]['where'],
      _count: true,
      orderBy: { _count: { module: 'desc' } },
    }),
  ]);

  const moduleCounts: Record<string, number> = {};
  byModule.forEach((m) => {
    const count = typeof m._count === 'object' && m._count !== null
      ? (m._count as { module?: number }).module ?? 0
      : (typeof m._count === 'number' ? m._count : 0);
    moduleCounts[m.module] = count;
  });

  return { total, todayCount, moduleCounts };
};

// ─── AI Summary ──────────────────────────────────────────────────────────────

export const getAiSummary = async (isAdmin: boolean, employeeId?: number): Promise<string> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const baseWhere: Record<string, unknown> = { createdAt: { gte: today } };
  if (!isAdmin && employeeId) {
    baseWhere.isAdminOnly = false;
    baseWhere.employeeId = employeeId;
  }

  // Gather today's stats
  const [todayActivities, checkIns, leaveRequests, leaveApprovals, payrollEvents] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.activityLog.count({ where: { ...baseWhere, action: 'check_in' } }),
    prisma.activityLog.count({ where: { ...baseWhere, action: 'leave_requested' } }),
    prisma.activityLog.count({ where: { ...baseWhere, action: 'leave_approved' } }),
    prisma.activityLog.count({ where: { ...baseWhere, module: 'payroll' } }),
  ]);

  // Build context for AI
  const context = [
    `Total events today: ${todayActivities.length}`,
    `Employee check-ins today: ${checkIns}`,
    `Leave requests submitted today: ${leaveRequests}`,
    `Leave requests approved today: ${leaveApprovals}`,
    `Payroll events today: ${payrollEvents}`,
  ];

  // Recent activity sample (last 10)
  const sample = todayActivities.slice(0, 10).map((a) => `- ${a.description}`).join('\n');
  if (sample) context.push(`\nRecent activities:\n${sample}`);

  // Try AI generation
  try {
    const { config } = await import('../../config');
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
      return buildFallbackSummary(checkIns, leaveRequests, leaveApprovals, payrollEvents, todayActivities.length);
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

    const prompt = `You are an HR intelligence assistant for PeopleFlow HRMS.
    
Based on the following organizational activity data for today, generate a concise executive summary in 3-5 bullet points. Each bullet should be a single clear sentence. Be professional but friendly. Focus on insights, not just numbers.

Context:
${context.join('\n')}

Format your response as plain bullet points starting with "•". No markdown headers. No extra text.`;

    const modelNames = ['gemini-2.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-2.5-flash'];
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200 },
        });
        const text = result.response.text().trim();
        if (text) {
          logger.info(`AI summary generated using ${modelName}`);
          return text;
        }
      } catch {
        continue;
      }
    }
  } catch (err) {
    logger.warn('AI summary generation failed, using fallback:', err);
  }

  return buildFallbackSummary(checkIns, leaveRequests, leaveApprovals, payrollEvents, todayActivities.length);
};

const buildFallbackSummary = (
  checkIns: number,
  leaveRequests: number,
  leaveApprovals: number,
  payrollEvents: number,
  total: number
): string => {
  const bullets: string[] = [];
  if (total === 0) return '• No activity recorded today yet.';
  bullets.push(`• ${total} organizational event${total !== 1 ? 's' : ''} recorded so far today.`);
  if (checkIns > 0) bullets.push(`• ${checkIns} employee${checkIns !== 1 ? 's' : ''} checked in today.`);
  if (leaveRequests > 0) bullets.push(`• ${leaveRequests} leave request${leaveRequests !== 1 ? 's' : ''} submitted — ${leaveApprovals} approved.`);
  if (payrollEvents > 0) bullets.push(`• ${payrollEvents} payroll event${payrollEvents !== 1 ? 's' : ''} processed today.`);
  return bullets.join('\n');
};
