import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as leaveService from './leave.service';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';

export const applyLeave = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const leave = await leaveService.applyLeave(req.user.employeeId, req.body);
    sendCreated(res, leave, 'Leave request submitted successfully');
  } catch (error) { next(error); }
};

export const getMyLeaveRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const result = await leaveService.getMyLeaveRequests(req.user.employeeId, req.query as Record<string, string>);
    sendSuccess(res, result.requests, 'Leave requests retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const getMyLeaveBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const balances = await leaveService.getMyLeaveBalance(req.user.employeeId);
    sendSuccess(res, balances, 'Leave balance retrieved');
  } catch (error) { next(error); }
};

export const getLeaveTypes = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const types = await leaveService.getLeaveTypes();
    sendSuccess(res, types, 'Leave types retrieved');
  } catch (error) { next(error); }
};

export const getAllLeaveRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await leaveService.getAllLeaveRequests(req.query as Record<string, string>);
    sendSuccess(res, result.requests, 'All leave requests retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const updateLeaveStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Admin employee profile not found', 404); return; }
    const { status, comment } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      sendError(res, 'Status must be Approved or Rejected', 400);
      return;
    }
    await leaveService.updateLeaveStatus(parseInt(req.params.id, 10), req.user.employeeId, status, comment);
    sendSuccess(res, null, `Leave request ${status.toLowerCase()} successfully`);
  } catch (error) { next(error); }
};
