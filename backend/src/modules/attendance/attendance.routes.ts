import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import * as attendanceController from './attendance.controller';

const router = Router();

router.post('/attendance/check-in', authenticate, attendanceController.checkIn);
router.post('/attendance/check-out', authenticate, attendanceController.checkOut);
router.get('/attendance/today', authenticate, attendanceController.getToday);
router.get('/attendance/summary', authenticate, attendanceController.getAttendanceSummary);
router.get('/attendance', authenticate, attendanceController.getMyAttendance);

router.get('/admin/attendance', authenticate, requireAdmin, attendanceController.getAllAttendance);
router.put('/admin/attendance/:id', authenticate, requireAdmin, attendanceController.adminUpdateAttendance);

export default router;
