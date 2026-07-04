import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { getPaginationParams } from '../../shared/utils/response';
import { analyzeLeaveRequest } from '../ai/ai.service';
import { logger } from '../../shared/utils/logger';

interface ApplyLeaveInput {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

const calculateWorkDays = (start: Date, end: Date): number => {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

export const applyLeave = async (employeeId: number, input: ApplyLeaveInput) => {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (startDate > endDate) {
    throw new AppError('Start date cannot be after end date', 400);
  }

  if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new AppError('Cannot apply leave for past dates', 400);
  }

  const leaveType = await prisma.leaveType.findUnique({ where: { id: input.leaveTypeId } });
  if (!leaveType) throw new AppError('Invalid leave type', 400);

  const totalDays = calculateWorkDays(startDate, endDate);
  if (totalDays === 0) throw new AppError('Selected dates fall on weekends only', 400);

  // Check leave balance
  const currentYear = new Date().getFullYear();
  const balance = await prisma.leaveBalance.findFirst({
    where: { employeeId, leaveTypeId: input.leaveTypeId, year: currentYear },
  });

  if (balance && balance.remainingDays < totalDays) {
    throw new AppError(
      `Insufficient ${leaveType.name} balance. Available: ${balance.remainingDays} days, Requested: ${totalDays} days`,
      400
    );
  }

  // Check for overlapping leave requests
  const overlapping = await prisma.leaveRequest.findFirst({
    where: {
      employeeId,
      status: { not: 'Rejected' },
      OR: [
        { startDate: { lte: endDate }, endDate: { gte: startDate } },
      ],
    },
  });

  if (overlapping) {
    throw new AppError('You already have a leave request for overlapping dates', 409);
  }

  // Run AI analysis (non-blocking)
  const aiAnalysis = await analyzeLeaveRequest(input.reason).catch(() => null);

  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveTypeId: input.leaveTypeId,
      startDate,
      endDate,
      totalDays,
      reason: input.reason,
      aiSummary: aiAnalysis?.summary || null,
      aiSuggestedType: aiAnalysis?.suggestedType || null,
      aiPriority: aiAnalysis?.priority || null,
      aiRecommendation: aiAnalysis?.recommendation || null,
      status: 'Pending',
    },
    include: { leaveType: true },
  });

  // Send notification to employee
  await prisma.notification.create({
    data: {
      employeeId,
      title: 'Leave Request Submitted',
      message: `Your ${leaveType.name} request for ${totalDays} day(s) has been submitted and is pending approval.`,
      type: 'info',
    },
  });

  logger.info(`Leave applied: employee=${employeeId}, type=${leaveType.name}, days=${totalDays}`);
  return leaveRequest;
};

export const getMyLeaveRequests = async (
  employeeId: number,
  params: { page?: string; limit?: string; status?: string; leaveTypeId?: string }
) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = { employeeId };
  if (params.status) where.status = params.status;
  if (params.leaveTypeId) where.leaveTypeId = parseInt(params.leaveTypeId, 10);

  const [requests, total] = await prisma.$transaction([
    prisma.leaveRequest.findMany({
      where,
      include: { leaveType: true, approvedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return { requests, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getMyLeaveBalance = async (employeeId: number) => {
  const currentYear = new Date().getFullYear();
  const balances = await prisma.leaveBalance.findMany({
    where: { employeeId, year: currentYear },
    include: { leaveType: true },
  });
  return balances;
};

export const getAllLeaveRequests = async (params: {
  page?: string;
  limit?: string;
  status?: string;
  leaveTypeId?: string;
  employeeId?: string;
}) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.leaveTypeId) where.leaveTypeId = parseInt(params.leaveTypeId, 10);
  if (params.employeeId) where.employeeId = parseInt(params.employeeId, 10);

  const [requests, total] = await prisma.$transaction([
    prisma.leaveRequest.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true, department: { select: { name: true } } } },
        leaveType: true,
        approvedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return { requests, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updateLeaveStatus = async (
  leaveId: number,
  adminEmployeeId: number,
  status: 'Approved' | 'Rejected',
  comment?: string
): Promise<void> => {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { leaveType: true },
  });

  if (!leaveRequest) throw new AppError('Leave request not found', 404);
  if (leaveRequest.status !== 'Pending') {
    throw new AppError(`Leave request is already ${leaveRequest.status.toLowerCase()}`, 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status,
        adminComment: comment || null,
        approvedById: adminEmployeeId,
      },
    });

    if (status === 'Approved') {
      // Update leave balance
      const currentYear = new Date().getFullYear();
      const balance = await tx.leaveBalance.findFirst({
        where: {
          employeeId: leaveRequest.employeeId,
          leaveTypeId: leaveRequest.leaveTypeId,
          year: currentYear,
        },
      });

      if (balance) {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: {
            usedDays: balance.usedDays + leaveRequest.totalDays,
            remainingDays: balance.remainingDays - leaveRequest.totalDays,
          },
        });
      }

      // Mark attendance as Leave for the approved dates
      const start = new Date(leaveRequest.startDate);
      const end = new Date(leaveRequest.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) {
          const startOfDay = new Date(cur);
          startOfDay.setHours(0, 0, 0, 0);
          await tx.attendanceRecord.upsert({
            where: {
              employeeId_attendanceDate: {
                employeeId: leaveRequest.employeeId,
                attendanceDate: startOfDay,
              },
            },
            create: {
              employeeId: leaveRequest.employeeId,
              attendanceDate: startOfDay,
              status: 'Leave',
            },
            update: { status: 'Leave' },
          });
        }
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Send notification to employee
    await tx.notification.create({
      data: {
        employeeId: leaveRequest.employeeId,
        title: `Leave Request ${status}`,
        message: `Your ${leaveRequest.leaveType.name} request for ${leaveRequest.totalDays} day(s) has been ${status.toLowerCase()}.${comment ? ` Reason: ${comment}` : ''}`,
        type: status === 'Approved' ? 'success' : 'error',
      },
    });
  });

  logger.info(`Leave ${leaveId} ${status} by admin employee ${adminEmployeeId}`);
};

export const getLeaveTypes = async () => {
  return prisma.leaveType.findMany({ orderBy: { name: 'asc' } });
};
