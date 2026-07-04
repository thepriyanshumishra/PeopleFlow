import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/utils/response';
import {
  getActivityFeed,
  getActivityStats,
  getAiSummary,
} from './activity.service';

const router = Router();

// ─── GET /activity ─────────────────────────────────────────────────────────
// Paginated activity feed — admins see all, employees see their own
router.get(
  '/activity',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isAdmin = req.user?.roleName === 'Admin';
      const requestingEmployeeId = req.user?.employeeId;

      const result = await getActivityFeed({
        page: req.query.page as string,
        limit: req.query.limit as string,
        module: req.query.module as string,
        search: req.query.search as string,
        employeeId: req.query.employeeId as string,
        departmentId: req.query.departmentId as string,
        severity: req.query.severity as string,
        from: req.query.from as string,
        to: req.query.to as string,
        isAdmin,
        requestingEmployeeId,
      });

      sendSuccess(res, result.activities, 'Activity feed retrieved', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /activity/stats ───────────────────────────────────────────────────
// Module counts for filter badge chips
router.get(
  '/activity/stats',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isAdmin = req.user?.roleName === 'Admin';
      const stats = await getActivityStats(isAdmin, req.user?.employeeId);
      sendSuccess(res, stats, 'Activity stats retrieved');
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /activity/summary ─────────────────────────────────────────────────
// AI-generated summary of today's organizational activity
router.get(
  '/activity/summary',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isAdmin = req.user?.roleName === 'Admin';
      const summary = await getAiSummary(isAdmin, req.user?.employeeId);
      sendSuccess(res, { summary }, 'AI summary generated');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
