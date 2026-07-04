import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { config } from '../../config';
import { AppError } from '../../middleware/error.middleware';
import { logger } from '../../shared/utils/logger';
import type { RegisterInput, LoginInput, ChangePasswordInput } from './auth.schema';

const BCRYPT_ROUNDS = 12;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  tokens: TokenPair;
  user: {
    id: number;
    email: string;
    role: string;
    employee: {
      id: number;
      firstName: string;
      lastName: string;
      employeeCode: string;
      profilePicture: string | null;
    } | null;
  };
}

const generateTokenPair = (payload: {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  employeeId?: number;
}): TokenPair => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({ userId: payload.userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const { firstName, lastName, email, password, employeeCode, departmentId, designation } = input;

  // Check email uniqueness
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Get default employee role
  const employeeRole = await prisma.role.findFirst({ where: { name: 'Employee' } });
  if (!employeeRole) {
    throw new AppError('System configuration error: Employee role not found', 500);
  }

  // Get default department if not specified
  let finalDepartmentId = departmentId;
  if (!finalDepartmentId) {
    const defaultDept = await prisma.department.findFirst();
    if (!defaultDept) throw new AppError('No departments available. Please contact admin.', 400);
    finalDepartmentId = defaultDept.id;
  }

  // Generate employee code if not provided
  const empCount = await prisma.employee.count();
  const finalEmployeeCode = employeeCode || `EMP${String(empCount + 1).padStart(3, '0')}`;

  // Check employee code uniqueness
  const existingEmp = await prisma.employee.findUnique({
    where: { employeeCode: finalEmployeeCode },
  });
  if (existingEmp) {
    throw new AppError('Employee code already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Create user + employee in transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        roleId: employeeRole.id,
      },
    });

    const employee = await tx.employee.create({
      data: {
        employeeCode: finalEmployeeCode,
        firstName,
        lastName,
        email,
        departmentId: finalDepartmentId!,
        designation: designation || 'Employee',
        joiningDate: new Date(),
        userId: user.id,
      },
    });

    // Initialize leave balances for the current year
    const leaveTypes = await tx.leaveType.findMany();
    const currentYear = new Date().getFullYear();
    
    await tx.leaveBalance.createMany({
      data: leaveTypes.map((lt) => ({
        employeeId: employee.id,
        leaveTypeId: lt.id,
        year: currentYear,
        totalDays: lt.maxDaysPerYear,
        usedDays: 0,
        remainingDays: lt.maxDaysPerYear,
      })),
    });

    return { user, employee };
  });

  logger.info(`New user registered: ${email} (${finalEmployeeCode})`);

  const tokens = generateTokenPair({
    userId: result.user.id,
    email: result.user.email,
    roleId: result.user.roleId,
    roleName: 'Employee',
    employeeId: result.employee.id,
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return {
    tokens,
    user: {
      id: result.user.id,
      email: result.user.email,
      role: 'Employee',
      employee: {
        id: result.employee.id,
        firstName: result.employee.firstName,
        lastName: result.employee.lastName,
        employeeCode: result.employee.employeeCode,
        profilePicture: result.employee.profilePicture,
      },
    },
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      employee: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact HR.', 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
    employeeId: user.employee?.id,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  logger.info(`User logged in: ${email}`);

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      employee: user.employee
        ? {
            id: user.employee.id,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            employeeCode: user.employee.employeeCode,
            profilePicture: user.employee.profilePicture,
          }
        : null,
    },
  };
};

export const logoutUser = async (userId: number): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
  logger.info(`User logged out: userId=${userId}`);
};

export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  let decoded: { userId: number };
  
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: number };
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { role: true },
  });

  if (!user || user.refreshToken !== refreshToken || !user.isActive) {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
};

export const changePassword = async (
  userId: number,
  input: ChangePasswordInput
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const newHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash, refreshToken: null },
  });

  logger.info(`Password changed for userId=${userId}`);
};

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      employee: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    employee: user.employee,
  };
};
