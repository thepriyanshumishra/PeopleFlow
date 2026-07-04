import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import * as leaveController from './leave.controller';

const router = Router();

router.get('/leave/types', authenticate, leaveController.getLeaveTypes);
router.post('/leave', authenticate, leaveController.applyLeave);
router.get('/leave', authenticate, leaveController.getMyLeaveRequests);
router.get('/leave/balance', authenticate, leaveController.getMyLeaveBalance);

router.get('/admin/leave', authenticate, requireAdmin, leaveController.getAllLeaveRequests);
router.patch('/admin/leave/:id/status', authenticate, requireAdmin, leaveController.updateLeaveStatus);

export default router;
