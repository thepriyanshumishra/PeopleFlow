import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as authService from './auth.service';
import { registerSchema, loginSchema, changePasswordSchema, refreshTokenSchema } from './auth.schema';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = registerSchema.parse({ body: req.body });
    const result = await authService.registerUser(body);
    sendCreated(res, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    }, 'Registration successful. Welcome to PeopleFlow!');
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = loginSchema.parse({ body: req.body });
    const result = await authService.loginUser(body);
    sendSuccess(res, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    await authService.logoutUser(req.user.id);
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = refreshTokenSchema.parse({ body: req.body });
    const tokens = await authService.refreshAccessToken(body.refreshToken);
    sendSuccess(res, tokens, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const { body } = changePasswordSchema.parse({ body: req.body });
    await authService.changePassword(req.user.id, body);
    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};
