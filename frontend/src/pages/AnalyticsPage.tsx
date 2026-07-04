import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Clock, CalendarDays, DollarSign, TrendingUp, TrendingDown, Minus, Building2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { dashboardApi, employeesApi, leaveApi, attendanceApi, payrollApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

function StatCard({ icon: Icon, label, value, trend, trendLabel, color }: any) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        {trendLabel && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-error' : 'text-text-secondary'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trendLabel}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs text-text-secondary mb-1">
        <span className="font-medium">{label}</span>
        <span>{value} <span className="text-text-secondary/60">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.adminStats().then(r => r.data.data || {}),
  });

  const { data: employeesData } = useQuery({
    queryKey: ['employees-analytics'],
    queryFn: () => employeesApi.getAll().then(r => r.data.data || []),
  });

  const { data: leavesData } = useQuery({
    queryKey: ['leaves-analytics'],
    queryFn: () => leaveApi.adminGetAll().then(r => r.data.data || []),
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['attendance-analytics'],
    queryFn: () => attendanceApi.adminGetAll().then(r => r.data.data || []),
  });

  const { data: payrollData } = useQuery({
    queryKey: ['payroll-analytics'],
    queryFn: () => payrollApi.adminGetAll().then(r => r.data.data || []),
  });

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-3xl border border-border shadow-sm max-w-sm">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-text-primary">Admin Access Required</h2>
          <p className="text-sm text-text-secondary mt-1">This area is restricted to administrators. Let\'s get you back to safety!</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-primary mt-4 w-full min-h-[40px] font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const employees: any[] = employeesData || [];
  const leaves: any[] = leavesData || [];
  const attendances: any[] = attendanceData || [];
  const payrolls: any[] = payrollData || [];
  const stats = statsData || {};

  // Leave stats
  const approved = leaves.filter(l => l.status === 'Approved').length;
  const pending = leaves.filter(l => l.status === 'Pending').length;
  const rejected = leaves.filter(l => l.status === 'Rejected').length;
  const totalLeaves = leaves.length;

  // Leave type breakdown
  const sickLeaves = leaves.filter(l => l.leaveType?.name?.toLowerCase().includes('sick')).length;
  const paidLeaves = leaves.filter(l => l.leaveType?.name?.toLowerCase().includes('paid')).length;
  const unpaidLeaves = leaves.filter(l => l.leaveType?.name?.toLowerCase().includes('unpaid')).length;

  // Department headcount
  const deptMap: Record<string, number> = {};
  employees.forEach(e => {
    const deptName = e.department?.name || 'Unassigned';
    deptMap[deptName] = (deptMap[deptName] || 0) + 1;
  });
  const deptEntries = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  // Payroll total
  const totalPayroll = payrolls.reduce((sum, p) => sum + Number(p.netSalary || 0), 0);
  const avgPayroll = payrolls.length > 0 ? Math.round(totalPayroll / payrolls.length) : 0;

  // Attendance rate
  const totalWithCheckout = attendances.filter(a => a.checkOut).length;
  const attendanceRate = attendances.length > 0 ? Math.round((totalWithCheckout / attendances.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Analytics Center"
        subtitle="Real-time HR insights and workforce data"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Analytics' }]}
        icon={<BarChart3 className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees ?? employees.length} color="bg-[#714b67]" trendLabel="In workforce" trend="neutral" />
          <StatCard icon={Clock} label="Attendance Rate" value={`${attendanceRate}%`} color="bg-blue-500"
            trend={attendanceRate >= 80 ? 'up' : 'down'} trendLabel={attendanceRate >= 80 ? 'Good' : 'Needs attention'} />
          <StatCard icon={CalendarDays} label="Leave Requests" value={totalLeaves} color="bg-amber-500" trendLabel={`${pending} pending`} trend={pending > 5 ? 'down' : 'up'} />
          <StatCard icon={DollarSign} label="Avg Net Pay" value={`₹${avgPayroll.toLocaleString()}`} color="bg-green-500" trendLabel="Per employee" trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Status Breakdown */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-plum-accent" />
              <h3 className="font-semibold text-sm text-text-primary">Leave Status Breakdown</h3>
            </div>
            {totalLeaves === 0 ? (
              <EmptyState variant="analytics" title="No leave activity yet" description="All stats will appear here as soon as employees request leave." compact />
            ) : (
              <>
                <ProgressBar label="Approved" value={approved} max={totalLeaves} color="bg-green-500" />
                <ProgressBar label="Pending" value={pending} max={totalLeaves} color="bg-yellow-400" />
                <ProgressBar label="Rejected" value={rejected} max={totalLeaves} color="bg-red-400" />
              </>
            )}
          </div>

          {/* Leave Type Breakdown */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-plum-accent" />
              <h3 className="font-semibold text-sm text-text-primary">Leave Types</h3>
            </div>
            {totalLeaves === 0 ? (
              <EmptyState variant="analytics" title="No leave activity yet" description="All stats will appear here as soon as employees request leave." compact />
            ) : (
              <>
                <ProgressBar label="Sick Leave" value={sickLeaves} max={totalLeaves} color="bg-red-400" />
                <ProgressBar label="Paid Leave" value={paidLeaves} max={totalLeaves} color="bg-blue-400" />
                <ProgressBar label="Unpaid Leave" value={unpaidLeaves} max={totalLeaves} color="bg-gray-400" />
                <ProgressBar label="Other" value={totalLeaves - sickLeaves - paidLeaves - unpaidLeaves} max={totalLeaves} color="bg-purple-400" />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Headcount */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Building2 className="w-4 h-4 text-plum-accent" />
              <h3 className="font-semibold text-sm text-text-primary">Department Headcount</h3>
            </div>
            {deptEntries.length === 0 ? (
              <EmptyState variant="analytics" title="No department breakdown yet" description="Department breakdown data will render here." compact />
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Headcount</th>
                      <th>% of Workforce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptEntries.map(([name, count]) => (
                      <tr key={name} className="border-b border-border last:border-0">
                        <td className="font-medium">{name}</td>
                        <td>{count}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-background rounded-full">
                              <div
                                className="h-full bg-[#714b67] rounded-full"
                                style={{ width: `${employees.length ? (count / employees.length) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-secondary w-8 text-right">
                              {employees.length ? Math.round((count / employees.length) * 100) : 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Leave Activity */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-plum-accent" />
              <h3 className="font-semibold text-sm text-text-primary">Recent Leave Activity</h3>
            </div>
            {leaves.length === 0 ? (
              <EmptyState variant="analytics" title="No recent activity yet" description="Recent leave requests will be shown here." compact />
            ) : (
              <div className="divide-y divide-border">
                {leaves.slice(0, 6).map((l: any) => (
                  <div key={l.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#714b67]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {l.employee?.firstName} {l.employee?.lastName}
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        {l.leaveType?.name} · {format(new Date(l.startDate), 'MMM d')}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
