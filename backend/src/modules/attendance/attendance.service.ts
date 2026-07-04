import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { getPaginationParams } from '../../shared/utils/response';
import { logger } from '../../shared/utils/logger';

const getStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const calculateHours = (checkIn: Date, checkOut: Date): number => {
  return Math.round(((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)) * 100) / 100;
};

const determineStatus = (checkIn: Date, totalHours: number): string => {
  const checkInHour = checkIn.getHours();
  const checkInMinute = checkIn.getMinutes();
  
  // Late if after 9:30 AM
  if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
    return totalHours >= 4 ? 'Late' : 'Half Day';
  }
  
  return totalHours >= 8 ? 'Present' : 'Half Day';
};

export const checkIn = async (employeeId: number) => {
  const today = new Date();
  const startOfDay = getStartOfDay(today);
  const endOfDay = getEndOfDay(today);

  // Check if already checked in today
  const existing = await prisma.attendanceRecord.findFirst({
    where: {
      employeeId,
      attendanceDate: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (existing?.checkIn) {
    throw new AppError('You have already checked in today', 400);
  }

  const checkInTime = new Date();

  if (existing) {
    return prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        checkIn: checkInTime,
        status: 'Present',
      },
    });
  }

  const record = await prisma.attendanceRecord.create({
    data: {
      employeeId,
      attendanceDate: startOfDay,
      checkIn: checkInTime,
      status: 'Present',
    },
  });

  logger.info(`Employee ${employeeId} checked in at ${checkInTime}`);
  return record;
};

export const checkOut = async (employeeId: number) => {
  const today = new Date();
  const startOfDay = getStartOfDay(today);
  const endOfDay = getEndOfDay(today);

  const record = await prisma.attendanceRecord.findFirst({
    where: {
      employeeId,
      attendanceDate: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (!record || !record.checkIn) {
    throw new AppError('You must check in before checking out', 400);
  }

  if (record.checkOut) {
    throw new AppError('You have already checked out today', 400);
  }

  const checkOutTime = new Date();
  const totalHours = calculateHours(record.checkIn, checkOutTime);
  const status = determineStatus(record.checkIn, totalHours);

  const updated = await prisma.attendanceRecord.update({
    where: { id: record.id },
    data: {
      checkOut: checkOutTime,
      totalHours,
      status,
    },
  });

  logger.info(`Employee ${employeeId} checked out. Hours: ${totalHours}`);
  return updated;
};

export const getTodayAttendance = async (employeeId: number) => {
  const today = new Date();
  const startOfDay = getStartOfDay(today);
  const endOfDay = getEndOfDay(today);

  return prisma.attendanceRecord.findFirst({
    where: {
      employeeId,
      attendanceDate: { gte: startOfDay, lte: endOfDay },
    },
  });
};

export const getMyAttendance = async (
  employeeId: number,
  params: { page?: string; limit?: string; month?: string; year?: string; status?: string }
) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = { employeeId };

  if (params.month && params.year) {
    const month = parseInt(params.month, 10);
    const year = parseInt(params.year, 10);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    where.attendanceDate = { gte: startDate, lte: endDate };
  }

  if (params.status) {
    where.status = params.status;
  }

  const [records, total] = await prisma.$transaction([
    prisma.attendanceRecord.findMany({
      where,
      orderBy: { attendanceDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  return {
    records,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getAttendanceSummary = async (employeeId: number, month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const records = await prisma.attendanceRecord.findMany({
    where: { employeeId, attendanceDate: { gte: startDate, lte: endDate } },
  });

  const summary = {
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
    late: 0,
    totalDays: records.length,
    totalHours: 0,
  };

  for (const record of records) {
    summary.totalHours += record.totalHours || 0;
    switch (record.status) {
      case 'Present': summary.present++; break;
      case 'Absent': summary.absent++; break;
      case 'Half Day': summary.halfDay++; break;
      case 'Leave': summary.leave++; break;
      case 'Late': summary.late++; break;
    }
  }

  return summary;
};

export const getAllAttendance = async (params: {
  page?: string;
  limit?: string;
  employeeId?: string;
  date?: string;
  month?: string;
  year?: string;
  status?: string;
  search?: string;
}) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = {};

  if (params.employeeId) where.employeeId = parseInt(params.employeeId, 10);
  if (params.status) where.status = params.status;

  if (params.date) {
    const d = new Date(params.date);
    where.attendanceDate = { gte: getStartOfDay(d), lte: getEndOfDay(d) };
  } else if (params.month && params.year) {
    const month = parseInt(params.month, 10);
    const year = parseInt(params.year, 10);
    where.attendanceDate = { gte: new Date(year, month - 1, 1), lte: new Date(year, month, 0, 23, 59, 59) };
  }

  const [records, total] = await prisma.$transaction([
    prisma.attendanceRecord.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: { select: { name: true } } },
        },
      },
      orderBy: { attendanceDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  return { records, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const adminUpdateAttendance = async (
  id: number,
  data: { checkIn?: string; checkOut?: string; status?: string; notes?: string }
): Promise<void> => {
  const record = await prisma.attendanceRecord.findUnique({ where: { id } });
  if (!record) throw new AppError('Attendance record not found', 404);

  const checkIn = data.checkIn ? new Date(data.checkIn) : record.checkIn;
  const checkOut = data.checkOut ? new Date(data.checkOut) : record.checkOut;
  const totalHours = checkIn && checkOut ? calculateHours(checkIn, checkOut) : record.totalHours;

  await prisma.attendanceRecord.update({
    where: { id },
    data: {
      ...(checkIn && { checkIn }),
      ...(checkOut && { checkOut }),
      ...(totalHours !== null && { totalHours }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
};
