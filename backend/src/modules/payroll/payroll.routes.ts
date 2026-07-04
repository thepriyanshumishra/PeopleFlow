import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import * as payrollController from './payroll.controller';

const router = Router();

router.get('/payroll', authenticate, payrollController.getMyPayroll);
router.get('/payroll/latest', authenticate, payrollController.getLatestPayslip);

router.get('/admin/payroll', authenticate, requireAdmin, payrollController.getAllPayroll);
router.post('/admin/payroll', authenticate, requireAdmin, payrollController.createPayroll);
router.put('/admin/payroll/:id', authenticate, requireAdmin, payrollController.updatePayroll);

export default router;
