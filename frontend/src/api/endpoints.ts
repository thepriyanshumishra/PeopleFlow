import api from './client';

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: object) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  changePassword: (data: object) => api.post('/auth/change-password', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

// Profile
export const profileApi = {
  getMyProfile: () => api.get('/profile'),
  updateProfile: (data: object) => api.put('/profile', data),
  uploadImage: (formData: FormData) => api.post('/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Attendance
export const attendanceApi = {
  checkIn: () => api.post('/attendance/check-in'),
  checkOut: () => api.post('/attendance/check-out'),
  getToday: () => api.get('/attendance/today'),
  getMyAttendance: (params?: object) => api.get('/attendance', { params }),
  getSummary: (params?: object) => api.get('/attendance/summary', { params }),
  adminGetAll: (params?: object) => api.get('/admin/attendance', { params }),
  adminUpdate: (id: number, data: object) => api.put(`/admin/attendance/${id}`, data),
};

// Leave
export const leaveApi = {
  getTypes: () => api.get('/leave/types'),
  apply: (data: object) => api.post('/leave', data),
  getMyLeaves: (params?: object) => api.get('/leave', { params }),
  getBalance: () => api.get('/leave/balance'),
  adminGetAll: (params?: object) => api.get('/admin/leave', { params }),
  adminUpdateStatus: (id: number, data: object) => api.patch(`/admin/leave/${id}/status`, data),
};

// Payroll
export const payrollApi = {
  getMyPayroll: (params?: object) => api.get('/payroll', { params }),
  getLatest: () => api.get('/payroll/latest'),
  adminGetAll: (params?: object) => api.get('/admin/payroll', { params }),
  adminUpdate: (id: number, data: object) => api.put(`/admin/payroll/${id}`, data),
  adminCreate: (data: object) => api.post('/admin/payroll', data),
};

// Employees (Admin)
export const employeesApi = {
  getAll: (params?: object) => api.get('/admin/employees', { params }),
  getById: (id: number) => api.get(`/admin/employees/${id}`),
  update: (id: number, data: object) => api.put(`/admin/employees/${id}`, data),
  delete: (id: number) => api.delete(`/admin/employees/${id}`),
};

// Departments
export const departmentsApi = {
  getAll: () => api.get('/departments'),
  create: (data: object) => api.post('/admin/departments', data),
  update: (id: number, data: object) => api.put(`/admin/departments/${id}`, data),
  delete: (id: number) => api.delete(`/admin/departments/${id}`),
};

// Notifications
export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id: number) => api.delete(`/notifications/${id}`),
};

// Dashboard
export const dashboardApi = {
  adminStats: () => api.get('/admin/dashboard/stats'),
};

// Activity Center
export const activityApi = {
  getFeed: (params?: object) => api.get('/activity', { params }),
  getStats: () => api.get('/activity/stats'),
  getSummary: () => api.get('/activity/summary'),
};

