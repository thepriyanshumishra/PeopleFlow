import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';

// Public pages
import { LoginPage } from '@/pages/LoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { SplashPage } from '@/pages/SplashPage';
import { LoadingPage } from '@/pages/LoadingPage';

// Error pages
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { ForbiddenPage } from '@/pages/errors/ForbiddenPage';
import { ServerErrorPage } from '@/pages/errors/ServerErrorPage';
import { UnauthorizedPage } from '@/pages/errors/UnauthorizedPage';
import { MaintenancePage } from '@/pages/errors/MaintenancePage';
import { OfflinePage } from '@/pages/errors/OfflinePage';

// Employee pages
import { DashboardPage } from '@/pages/DashboardPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { LeavePage } from '@/pages/LeavePage';
import { PayrollPage } from '@/pages/PayrollPage';
import { ProfilePage } from '@/pages/ProfilePage';

// Shared pages (both roles)
import { NotificationsPage } from '@/pages/NotificationsPage';
import { DirectoryPage } from '@/pages/DirectoryPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpPage } from '@/pages/HelpPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { AIInsightsPage } from '@/pages/AIInsightsPage';
import { ActivityPage } from '@/pages/ActivityPage';

// Admin pages
import { EmployeesPage } from '@/pages/admin/EmployeesPage';
import { EmployeeDetailPage } from '@/pages/admin/EmployeeDetailPage';
import { AdminLeavePage } from '@/pages/admin/AdminLeavePage';
import { AdminAttendancePage } from '@/pages/admin/AdminAttendancePage';
import { AdminPayrollPage } from '@/pages/admin/AdminPayrollPage';
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage';
import { OrganizationPage } from '@/pages/admin/OrganizationPage';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/403" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Splash Startup experience */}
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/loading" element={<LoadingPage />} />

      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      {/* Error pages */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/401" element={<UnauthorizedPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/offline" element={<OfflinePage />} />

      {/* Authenticated routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        {/* Core employee routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Shared routes (employee + admin) */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ai" element={<AIInsightsPage />} />
        <Route path="/activity" element={<ActivityPage />} />

        {/* Admin-only routes */}
        <Route path="/admin/employees" element={<AdminRoute><EmployeesPage /></AdminRoute>} />
        <Route path="/admin/employees/:id" element={<AdminRoute><EmployeeDetailPage /></AdminRoute>} />
        <Route path="/admin/leave" element={<AdminRoute><AdminLeavePage /></AdminRoute>} />
        <Route path="/admin/attendance" element={<AdminRoute><AdminAttendancePage /></AdminRoute>} />
        <Route path="/admin/payroll" element={<AdminRoute><AdminPayrollPage /></AdminRoute>} />
        <Route path="/admin/departments" element={<AdminRoute><DepartmentsPage /></AdminRoute>} />
        <Route path="/admin/organization" element={<AdminRoute><OrganizationPage /></AdminRoute>} />
        <Route path="/admin/audit" element={<AdminRoute><AuditLogsPage /></AdminRoute>} />
      </Route>

      {/* Catch-all → 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
