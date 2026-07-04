import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as payrollService from './payroll.service';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';

export const getMyPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const result = await payrollService.getMyPayroll(req.user.employeeId, req.query as Record<string, string>);
    sendSuccess(res, result.payrolls, 'Payroll retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const getLatestPayslip = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const payslip = await payrollService.getLatestPayslip(req.user.employeeId);
    sendSuccess(res, payslip, 'Latest payslip retrieved');
  } catch (error) { next(error); }
};

export const getAllPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await payrollService.getAllPayroll(req.query as Record<string, string>);
    sendSuccess(res, result.payrolls, 'All payroll retrieved', 200, result.pagination);
  } catch (error) { next(error); }
};

export const updatePayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Admin employee not found', 404); return; }
    await payrollService.updatePayroll(parseInt(req.params.id, 10), req.user.employeeId, req.body);
    sendSuccess(res, null, 'Payroll updated successfully');
  } catch (error) { next(error); }
};

export const createPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Admin employee not found', 404); return; }
    const payroll = await payrollService.createPayroll(req.user.employeeId, req.body);
    sendCreated(res, payroll, 'Payroll created successfully');
  } catch (error) { next(error); }
};
