import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as attendanceService from './attendance.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

export const checkIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const record = await attendanceService.checkIn(req.user.employeeId);
    sendSuccess(res, record, 'Checked in successfully');
  } catch (error) { next(error); }
};

export const checkOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const record = await attendanceService.checkOut(req.user.employeeId);
    sendSuccess(res, record, 'Checked out successfully');
  } catch (error) { next(error); }
};

export const getToday = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const record = await attendanceService.getTodayAttendance(req.user.employeeId);
    sendSuccess(res, record, 'Today attendance retrieved');
  } catch (error) { next(error); }
};

export const getMyAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const result = await attendanceService.getMyAttendance(req.user.employeeId, req.query as Record<string, string>);
    sendSuccess(res, result.records, 'Attendance retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const getAttendanceSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const month = parseInt(req.query.month as string || String(new Date().getMonth() + 1), 10);
    const year = parseInt(req.query.year as string || String(new Date().getFullYear()), 10);
    const summary = await attendanceService.getAttendanceSummary(req.user.employeeId, month, year);
    sendSuccess(res, summary, 'Attendance summary retrieved');
  } catch (error) { next(error); }
};

export const getAllAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await attendanceService.getAllAttendance(req.query as Record<string, string>);
    sendSuccess(res, result.records, 'All attendance retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const adminUpdateAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await attendanceService.adminUpdateAttendance(parseInt(req.params.id, 10), req.body);
    sendSuccess(res, null, 'Attendance record updated');
  } catch (error) { next(error); }
};
