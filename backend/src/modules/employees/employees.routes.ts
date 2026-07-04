import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import * as employeeController from './employees.controller';
import { config } from '../../config';

const router = Router();

const storage = multer.diskStorage({
  destination: config.upload.dir,
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);
    cb(null, isValid);
  },
});

// Employee profile routes
router.get('/profile', authenticate, employeeController.getMyProfile);
router.put('/profile', authenticate, employeeController.updateMyProfile);
router.post('/profile/image', authenticate, upload.single('image'), employeeController.uploadProfilePicture);

// Admin routes
router.get('/admin/employees', authenticate, requireAdmin, employeeController.getAllEmployees);
router.get('/admin/employees/:id', authenticate, requireAdmin, employeeController.getEmployeeById);
router.put('/admin/employees/:id', authenticate, requireAdmin, employeeController.updateEmployee);
router.delete('/admin/employees/:id', authenticate, requireAdmin, employeeController.deleteEmployee);

export default router;
