import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './shared/utils/logger';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employees/employees.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import leaveRoutes from './modules/leave/leave.routes';
import payrollRoutes from './modules/payroll/payroll.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import departmentRoutes from './modules/departments/departments.routes';
import dashboardRoutes from './modules/departments/dashboard.routes';
import activityRoutes from './modules/activity/activity.routes';

const app = express();

// ========================
// Security Middleware
// ========================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: config.cors.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ========================
// Parsing Middleware
// ========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================
// Logging
// ========================
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// ========================
// Static Files (uploads)
// ========================
app.use('/uploads', express.static(path.resolve(config.upload.dir)));

// ========================
// Health Check
// ========================
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ========================
// API Routes
// ========================
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(API_PREFIX, employeeRoutes);
app.use(API_PREFIX, attendanceRoutes);
app.use(API_PREFIX, leaveRoutes);
app.use(API_PREFIX, payrollRoutes);
app.use(API_PREFIX, notificationRoutes);
app.use(API_PREFIX, departmentRoutes);
app.use(API_PREFIX, dashboardRoutes);
app.use(API_PREFIX, activityRoutes);

// ========================
// Error Handling
// ========================
app.use(notFoundHandler);
app.use(errorHandler);

// ========================
// Start Server
// ========================
const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`🚀 PeopleFlow API running on http://localhost:${config.port}`);
    logger.info(`📊 Environment: ${config.env}`);
    logger.info(`🔐 CORS allowed origin: ${config.cors.frontendUrl}`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
