import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { prisma } from '../../config/database';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/response';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { Response, NextFunction } from 'express';

const router = Router();

// Notification service inline (simple enough for single file)
router.get('/notifications', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { employeeId: req.user.employeeId },
          { recipientType: 'all' },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    sendSuccess(res, notifications, 'Notifications retrieved');
  } catch (error) { next(error); }
});

router.put('/notifications/read-all', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    await prisma.notification.updateMany({
      where: { employeeId: req.user.employeeId, isRead: false },
      data: { isRead: true },
    });
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (error) { next(error); }
});

router.put('/notifications/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.employeeId) { sendError(res, 'Employee not found', 404); return; }
    await prisma.notification.update({
      where: { id: parseInt(String(req.params.id), 10) },
      data: { isRead: true },
    });
    sendSuccess(res, null, 'Notification marked as read');
  } catch (error) { next(error); }
});

router.delete('/notifications/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.delete({ where: { id: parseInt(String(req.params.id), 10) } });
    sendSuccess(res, null, 'Notification deleted');
  } catch (error) { next(error); }
});

export default router;
