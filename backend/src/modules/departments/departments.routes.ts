import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { prisma } from '../../config/database';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Response, NextFunction } from 'express';

const router = Router();

router.get('/departments', authenticate, async (_req, res: Response, next: NextFunction) => {
  try {
    const departments = await prisma.department.findMany({
      include: { _count: { select: { employees: { where: { deletedAt: null } } } } },
      orderBy: { name: 'asc' },
    });
    sendSuccess(res, departments, 'Departments retrieved');
  } catch (error) { next(error); }
});

router.post('/admin/departments', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    if (!name) { sendError(res, 'Department name is required', 400); return; }
    const existing = await prisma.department.findFirst({ where: { name } });
    if (existing) { sendError(res, 'Department already exists', 409); return; }
    const dept = await prisma.department.create({ data: { name, description } });
    sendCreated(res, dept, 'Department created successfully');
  } catch (error) { next(error); }
});

router.put('/admin/departments/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dept = await prisma.department.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { name: req.body.name, description: req.body.description },
    });
    sendSuccess(res, dept, 'Department updated');
  } catch (error) { next(error); }
});

router.delete('/admin/departments/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const empCount = await prisma.employee.count({
      where: { departmentId: parseInt(req.params.id, 10), deletedAt: null },
    });
    if (empCount > 0) {
      sendError(res, `Cannot delete department with ${empCount} active employee(s)`, 400);
      return;
    }
    await prisma.department.delete({ where: { id: parseInt(req.params.id, 10) } });
    sendSuccess(res, null, 'Department deleted');
  } catch (error) { next(error); }
});

export default router;
