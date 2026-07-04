import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { getPaginationParams } from '../../shared/utils/response';
import { logger } from '../../shared/utils/logger';

export const getMyPayroll = async (
  employeeId: number,
  params: { page?: string; limit?: string; year?: string }
) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = { employeeId };
  if (params.year) {
    const year = parseInt(params.year, 10);
    where.payPeriod = {
      gte: new Date(year, 0, 1),
      lte: new Date(year, 11, 31),
    };
  }

  const [payrolls, total] = await prisma.$transaction([
    prisma.payroll.findMany({
      where,
      orderBy: { payPeriod: 'desc' },
      skip,
      take: limit,
    }),
    prisma.payroll.count({ where }),
  ]);

  return { payrolls, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getLatestPayslip = async (employeeId: number) => {
  return prisma.payroll.findFirst({
    where: { employeeId },
    orderBy: { payPeriod: 'desc' },
  });
};

export const getAllPayroll = async (params: {
  page?: string;
  limit?: string;
  month?: string;
  year?: string;
  employeeId?: string;
}) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where: Record<string, unknown> = {};
  if (params.employeeId) where.employeeId = parseInt(params.employeeId, 10);

  if (params.month && params.year) {
    const month = parseInt(params.month, 10);
    const year = parseInt(params.year, 10);
    where.payPeriod = {
      gte: new Date(year, month - 1, 1),
      lte: new Date(year, month - 1, 28),
    };
  } else if (params.year) {
    const year = parseInt(params.year, 10);
    where.payPeriod = {
      gte: new Date(year, 0, 1),
      lte: new Date(year, 11, 31),
    };
  }

  const [payrolls, total] = await prisma.$transaction([
    prisma.payroll.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            designation: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { payPeriod: 'desc' },
      skip,
      take: limit,
    }),
    prisma.payroll.count({ where }),
  ]);

  return { payrolls, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updatePayroll = async (
  id: number,
  adminEmployeeId: number,
  data: {
    basicSalary?: number;
    allowances?: number;
    deductions?: number;
    tax?: number;
    paymentStatus?: string;
  }
): Promise<void> => {
  const payroll = await prisma.payroll.findUnique({ where: { id } });
  if (!payroll) throw new AppError('Payroll record not found', 404);

  const basicSalary = data.basicSalary ?? payroll.basicSalary;
  const allowances = data.allowances ?? payroll.allowances;
  const deductions = data.deductions ?? payroll.deductions;
  const tax = data.tax ?? payroll.tax;
  const netSalary = basicSalary + allowances - deductions - tax;

  if (netSalary < 0) throw new AppError('Net salary cannot be negative', 400);

  await prisma.payroll.update({
    where: { id },
    data: {
      ...(data.basicSalary !== undefined && { basicSalary }),
      ...(data.allowances !== undefined && { allowances }),
      ...(data.deductions !== undefined && { deductions }),
      ...(data.tax !== undefined && { tax }),
      netSalary,
      ...(data.paymentStatus && { paymentStatus: data.paymentStatus }),
      updatedById: adminEmployeeId,
    },
  });

  // Notify employee
  await prisma.notification.create({
    data: {
      employeeId: payroll.employeeId,
      title: 'Payroll Updated',
      message: `Your payroll for ${new Date(payroll.payPeriod).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} has been updated.`,
      type: 'info',
    },
  });

  logger.info(`Payroll ${id} updated by admin ${adminEmployeeId}`);
};

export const createPayroll = async (
  adminEmployeeId: number,
  data: {
    employeeId: number;
    basicSalary: number;
    allowances?: number;
    deductions?: number;
    tax?: number;
    payPeriod: string;
  }
) => {
  const allowances = data.allowances ?? 0;
  const deductions = data.deductions ?? 0;
  const tax = data.tax ?? 0;
  const netSalary = data.basicSalary + allowances - deductions - tax;

  if (netSalary < 0) throw new AppError('Net salary cannot be negative', 400);

  const payPeriod = new Date(data.payPeriod);
  payPeriod.setDate(1);

  return prisma.payroll.create({
    data: {
      employeeId: data.employeeId,
      basicSalary: data.basicSalary,
      allowances,
      deductions,
      tax,
      netSalary,
      payPeriod,
      updatedById: adminEmployeeId,
    },
  });
};
