import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AttendancePage } from '@/pages/AttendancePage';
import { LeavePage } from '@/pages/LeavePage';
import { PayrollPage } from '@/pages/PayrollPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EmployeesPage } from '@/pages/admin/EmployeesPage';
import { AdminLeavePage } from '@/pages/admin/AdminLeavePage';
import { AdminAttendancePage } from '@/pages/admin/AdminAttendancePage';
import { AdminPayrollPage } from '@/pages/admin/AdminPayrollPage';
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin-only routes */}
        <Route path="/admin/employees" element={<AdminRoute><EmployeesPage /></AdminRoute>} />
        <Route path="/admin/leave" element={<AdminRoute><AdminLeavePage /></AdminRoute>} />
        <Route path="/admin/attendance" element={<AdminRoute><AdminAttendancePage /></AdminRoute>} />
        <Route path="/admin/payroll" element={<AdminRoute><AdminPayrollPage /></AdminRoute>} />
        <Route path="/admin/departments" element={<AdminRoute><DepartmentsPage /></AdminRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
