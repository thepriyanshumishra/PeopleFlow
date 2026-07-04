import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as employeeService from './employees.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee profile not found', 404); return; }
    const employee = await employeeService.getEmployeeProfile(req.user.employeeId);
    sendSuccess(res, employee, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    await employeeService.updateOwnProfile(req.user.employeeId, req.body);
    sendSuccess(res, null, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePicture = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    if (!req.file) { sendError(res, 'No file uploaded', 400); return; }
    const filePath = `/uploads/${req.file.filename}`;
    await employeeService.updateProfilePicture(req.user.employeeId, filePath);
    sendSuccess(res, { profilePicture: filePath }, 'Profile picture updated');
  } catch (error) {
    next(error);
  }
};

// Admin controllers
export const getAllEmployees = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await employeeService.getAllEmployees(req.query as Record<string, string>);
    sendSuccess(res, result.employees, 'Employees retrieved', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await employeeService.getEmployeeById(parseInt(String(req.params.id), 10));
    sendSuccess(res, employee, 'Employee retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await employeeService.adminUpdateEmployee(parseInt(String(req.params.id), 10), req.body);
    sendSuccess(res, null, 'Employee updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await employeeService.softDeleteEmployee(parseInt(String(req.params.id), 10));
    sendSuccess(res, null, 'Employee deactivated successfully');
  } catch (error) {
    next(error);
  }
};
