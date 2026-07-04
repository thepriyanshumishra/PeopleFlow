import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../config/database';
import { sendUnauthorized, sendForbidden } from '../shared/utils/response';
import { logger } from '../shared/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    roleId: number;
    roleName: string;
    employeeId?: number;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Authentication token is required');
      return;
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: number;
      email: string;
      roleId: number;
      roleName: string;
      employeeId?: number;
    };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      sendUnauthorized(res, 'User account is inactive or not found');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    };

    // Get employee ID from the user's employee relation
    const employee = await prisma.employee.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    
    if (employee) {
      req.user.employeeId = employee.id;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendUnauthorized(res, 'Authentication token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      sendUnauthorized(res, 'Invalid authentication token');
    } else {
      logger.error('Auth middleware error:', error);
      sendUnauthorized(res, 'Authentication failed');
    }
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.roleName !== 'Admin') {
    sendForbidden(res, 'Administrator access required');
    return;
  }
  next();
};

export const requireEmployee = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required');
    return;
  }
  next();
};
