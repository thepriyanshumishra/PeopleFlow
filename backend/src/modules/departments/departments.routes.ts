import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { prisma } from '../../config/database';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Response, NextFunction } from 'express';
import { logActivity } from '../activity/activity.service';

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

    await logActivity({
      module: 'department',
      action: 'department_created',
      description: `Department "${name}" was created`,
      actorId: req.user?.employeeId,
      actorRole: 'Admin',
      targetId: dept.id,
      targetName: name,
      metadata: { description },
      severity: 'success',
      isAdminOnly: true,
    });

    sendCreated(res, dept, 'Department created successfully');
  } catch (error) { next(error); }
});

router.put('/admin/departments/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deptId = parseInt(String(req.params.id), 10);
    const dept = await prisma.department.update({
      where: { id: deptId },
      data: { name: req.body.name, description: req.body.description },
    });

    await logActivity({
      module: 'department',
      action: 'department_updated',
      description: `Department "${dept.name}" was updated`,
      actorId: req.user?.employeeId,
      actorRole: 'Admin',
      targetId: deptId,
      targetName: dept.name,
      metadata: { name: req.body.name, description: req.body.description },
      severity: 'info',
      isAdminOnly: true,
    });

    sendSuccess(res, dept, 'Department updated');
  } catch (error) { next(error); }
});

router.delete('/admin/departments/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deptId = parseInt(String(req.params.id), 10);

    const empCount = await prisma.employee.count({
      where: { departmentId: deptId, deletedAt: null },
    });
    if (empCount > 0) {
      sendError(res, `Cannot delete department with ${empCount} active employee(s)`, 400);
      return;
    }
    const dept = await prisma.department.findUnique({ where: { id: deptId } });
    await prisma.department.delete({ where: { id: deptId } });

    await logActivity({
      module: 'department',
      action: 'department_deleted',
      description: `Department "${dept?.name ?? deptId}" was deleted`,
      actorId: req.user?.employeeId,
      actorRole: 'Admin',
      targetId: deptId,
      targetName: dept?.name ?? String(deptId),
      severity: 'warning',
      isAdminOnly: true,
    });

    sendSuccess(res, null, 'Department deleted');
  } catch (error) { next(error); }
});

export default router;
