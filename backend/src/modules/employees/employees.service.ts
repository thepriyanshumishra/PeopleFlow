import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { getPaginationParams } from '../../shared/utils/response';
import { logger } from '../../shared/utils/logger';

interface UpdateProfileInput {
  phone?: string;
  address?: string;
  profilePicture?: string;
}

interface AdminUpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  departmentId?: number;
  designation?: string;
  status?: string;
  managerId?: number | null;
  joiningDate?: string;
}

export const getEmployeeProfile = async (employeeId: number) => {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, deletedAt: null },
    include: {
      department: true,
      user: { select: { role: { select: { name: true } }, email: true, isActive: true } },
      manager: { select: { id: true, firstName: true, lastName: true, designation: true } },
    },
  });

  if (!employee) throw new AppError('Employee not found', 404);
  return employee;
};

export const updateOwnProfile = async (
  employeeId: number,
  input: UpdateProfileInput
): Promise<void> => {
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.profilePicture !== undefined && { profilePicture: input.profilePicture }),
    },
  });
};

export const getAllEmployees = async (params: {
  page?: string;
  limit?: string;
  search?: string;
  departmentId?: string;
  status?: string;
}) => {
  const { page, limit, skip } = getPaginationParams(params.page, params.limit);

  const where = {
    deletedAt: null,
    ...(params.status && { status: params.status }),
    ...(params.departmentId && { departmentId: parseInt(params.departmentId, 10) }),
    ...(params.search && {
      OR: [
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
        { email: { contains: params.search } },
        { employeeCode: { contains: params.search } },
        { designation: { contains: params.search } },
      ],
    }),
  };

  const [employees, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where,
      include: {
        department: { select: { id: true, name: true } },
        user: { select: { role: { select: { name: true } }, isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    employees,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEmployeeById = async (id: number) => {
  const employee = await prisma.employee.findFirst({
    where: { id, deletedAt: null },
    include: {
      department: true,
      user: { select: { role: true, email: true, isActive: true } },
      manager: { select: { id: true, firstName: true, lastName: true } },
      documents: true,
    },
  });

  if (!employee) throw new AppError('Employee not found', 404);
  return employee;
};

export const adminUpdateEmployee = async (
  id: number,
  input: AdminUpdateEmployeeInput
): Promise<void> => {
  const employee = await prisma.employee.findFirst({ where: { id, deletedAt: null } });
  if (!employee) throw new AppError('Employee not found', 404);

  await prisma.employee.update({
    where: { id },
    data: {
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.departmentId && { departmentId: input.departmentId }),
      ...(input.designation && { designation: input.designation }),
      ...(input.status && { status: input.status }),
      ...(input.managerId !== undefined && { managerId: input.managerId }),
      ...(input.joiningDate && { joiningDate: new Date(input.joiningDate) }),
    },
  });

  logger.info(`Admin updated employee id=${id}`);
};

export const softDeleteEmployee = async (id: number): Promise<void> => {
  const employee = await prisma.employee.findFirst({ where: { id, deletedAt: null } });
  if (!employee) throw new AppError('Employee not found', 404);

  await prisma.$transaction([
    prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'Inactive' },
    }),
    prisma.user.update({
      where: { id: employee.userId },
      data: { isActive: false },
    }),
  ]);

  logger.info(`Employee soft deleted: id=${id}`);
};

export const updateProfilePicture = async (
  employeeId: number,
  filePath: string
): Promise<void> => {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { profilePicture: filePath },
  });
};
