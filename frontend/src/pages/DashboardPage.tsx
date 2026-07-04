import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Clock, LogIn, LogOut, TrendingUp, CalendarDays,
  CheckCircle2, XCircle, AlertCircle, Timer, Users
} from 'lucide-react';
import { attendanceApi, dashboardApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { StatCard } from '@/components/ui/Card';
import { getAttendanceStatusBadge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardApi.adminStats().then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 h-28 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentLeaves = data?.recentLeaves || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees ?? 0}
          icon={<Users className="w-6 h-6 text-primary" />}
          iconBg="bg-primary-50"
          subtitle={`${stats.activeEmployees ?? 0} active`}
        />
        <StatCard
          title="Today Present"
          value={stats.todayPresent ?? 0}
          icon={<CheckCircle2 className="w-6 h-6 text-success" />}
          iconBg="bg-green-50"
          subtitle="Checked in today"
        />
        <StatCard
          title="Today Absent"
          value={stats.todayAbsent ?? 0}
          icon={<XCircle className="w-6 h-6 text-error" />}
          iconBg="bg-red-50"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves ?? 0}
          icon={<AlertCircle className="w-6 h-6 text-warning" />}
          iconBg="bg-yellow-50"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments ?? 0}
          icon={<CalendarDays className="w-6 h-6 text-info" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Attendance Rate"
          value={stats.totalEmployees > 0
            ? `${Math.round((stats.todayPresent / stats.activeEmployees) * 100)}%`
            : '—'}
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          iconBg="bg-primary-50"
          subtitle="Today"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            Pending Leave Requests
          </h2>
          {recentLeaves.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {recentLeaves.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between p-3 bg-background rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {l.employee.firstName} {l.employee.lastName}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {l.leaveType.name} · {l.totalDays} day(s)
                    </p>
                  </div>
                  {l.aiPriority && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      l.aiPriority === 'High' ? 'bg-red-100 text-red-700' :
                      l.aiPriority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {l.aiPriority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Activity */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Today's Check-ins
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">No activity today</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {a.employee.firstName[0]}{a.employee.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {a.employee.firstName} {a.employee.lastName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {a.checkIn ? format(new Date(a.checkIn), 'hh:mm a') : '—'}
                      </p>
                    </div>
                  </div>
                  {getAttendanceStatusBadge(a.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  const { data: todayData } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => attendanceApi.getToday().then(r => r.data.data),
    refetchInterval: 60000,
  });

  const { data: summaryData } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: () => attendanceApi.getSummary({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    }).then(r => r.data.data),
  });

  const checkInMutation = useMutation({
    mutationFn: () => attendanceApi.checkIn(),
    onSuccess: () => {
      toast.success('Checked in successfully! Have a productive day 🚀');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Check-in failed'),
  });

  const checkOutMutation = useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      toast.success('Checked out successfully! See you tomorrow 👋');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Check-out failed'),
  });

  const today = todayData;
  const summary = summaryData || {};
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.employee?.firstName || 'there';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
        <p className="text-primary-200 text-sm font-medium">{format(now, 'EEEE, MMMM d, yyyy')}</p>
        <h2 className="text-2xl font-bold mt-1">{greeting}, {displayName}! 👋</h2>
        <p className="text-primary-200 text-sm mt-1">
          {user?.employee?.employeeCode && `ID: ${user.employee.employeeCode}`}
        </p>
      </div>

      {/* Check-in/out card */}
      <div className="card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          Today's Attendance
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-background rounded-xl p-4 text-center">
            <p className="text-xs text-text-secondary mb-1">Check In</p>
            <p className="text-lg font-bold text-text-primary">
              {today?.checkIn ? format(new Date(today.checkIn), 'hh:mm a') : '—'}
            </p>
          </div>
          <div className="bg-background rounded-xl p-4 text-center">
            <p className="text-xs text-text-secondary mb-1">Check Out</p>
            <p className="text-lg font-bold text-text-primary">
              {today?.checkOut ? format(new Date(today.checkOut), 'hh:mm a') : '—'}
            </p>
          </div>
          <div className="bg-background rounded-xl p-4 text-center">
            <p className="text-xs text-text-secondary mb-1">Hours</p>
            <p className="text-lg font-bold text-text-primary">
              {today?.totalHours ? `${today.totalHours}h` : '—'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            id="btn-checkin"
            onClick={() => checkInMutation.mutate()}
            disabled={!!today?.checkIn || checkInMutation.isPending}
            className="btn-primary flex-1 py-3 disabled:opacity-40"
          >
            {checkInMutation.isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking in…</> : <><LogIn className="w-4 h-4" />Check In</>}
          </button>
          <button
            id="btn-checkout"
            onClick={() => checkOutMutation.mutate()}
            disabled={!today?.checkIn || !!today?.checkOut || checkOutMutation.isPending}
            className="btn-secondary flex-1 py-3 disabled:opacity-40"
          >
            {checkOutMutation.isPending ? <><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />Checking out…</> : <><LogOut className="w-4 h-4" />Check Out</>}
          </button>
        </div>
        {today?.status && (
          <div className="mt-3 text-center">
            <span className="text-sm text-text-secondary">Status: </span>
            {getAttendanceStatusBadge(today.status)}
          </div>
        )}
      </div>

      {/* Monthly summary */}
      <div className="card p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          {format(now, 'MMMM yyyy')} Summary
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: 'Present', value: summary.present ?? 0, color: 'text-success' },
            { label: 'Late', value: summary.late ?? 0, color: 'text-orange-500' },
            { label: 'Half Day', value: summary.halfDay ?? 0, color: 'text-yellow-500' },
            { label: 'Leave', value: summary.leave ?? 0, color: 'text-info' },
            { label: 'Absent', value: summary.absent ?? 0, color: 'text-error' },
            { label: 'Hrs Total', value: `${summary.totalHours ?? 0}h`, color: 'text-primary' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-background rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const user = useAuthStore(s => s.user);
  return user?.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />;
}
