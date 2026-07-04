import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../shared/utils/logger';
import { sendError } from '../shared/utils/response';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma unique constraint violation
  if ((err as { code?: string }).code === 'P2002') {
    const target = (err as { meta?: { target?: string[] } }).meta?.target;
    sendError(res, `${target ? target[0] : 'Field'} already exists`, 409);
    return;
  }

  // Prisma record not found
  if ((err as { code?: string }).code === 'P2025') {
    sendError(res, 'Record not found', 404);
    return;
  }

  // Unknown errors (don't leak details)
  sendError(res, 'An unexpected error occurred. Please try again.', 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
};
