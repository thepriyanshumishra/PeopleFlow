import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../shared/utils/response';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();

router.get('/admin/dashboard/stats', authenticate, requireAdmin, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalEmployees,
      activeEmployees,
      pendingLeaves,
      todayPresent,
      todayAbsent,
      totalDepartments,
    ] = await prisma.$transaction([
      prisma.employee.count({ where: { deletedAt: null } }),
      prisma.employee.count({ where: { deletedAt: null, status: 'Active' } }),
      prisma.leaveRequest.count({ where: { status: 'Pending' } }),
      prisma.attendanceRecord.count({
        where: { attendanceDate: { gte: today, lte: todayEnd }, status: { in: ['Present', 'Late', 'Half Day'] } },
      }),
      prisma.attendanceRecord.count({
        where: { attendanceDate: { gte: today, lte: todayEnd }, status: 'Absent' },
      }),
      prisma.department.count(),
    ]);

    const recentLeaves = await prisma.leaveRequest.findMany({
      where: { status: 'Pending' },
      include: {
        employee: { select: { firstName: true, lastName: true, employeeCode: true } },
        leaveType: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentActivity = await prisma.attendanceRecord.findMany({
      where: { attendanceDate: { gte: today, lte: todayEnd } },
      include: { employee: { select: { firstName: true, lastName: true, profilePicture: true } } },
      orderBy: { checkIn: 'desc' },
      take: 10,
    });

    sendSuccess(res, {
      stats: { totalEmployees, activeEmployees, pendingLeaves, todayPresent, todayAbsent, totalDepartments },
      recentLeaves,
      recentActivity,
    }, 'Dashboard stats retrieved');
  } catch (error) { next(error); }
});

export default router;
