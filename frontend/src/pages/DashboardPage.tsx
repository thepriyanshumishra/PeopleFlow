import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock, LogIn, LogOut, TrendingUp, CalendarDays,
  CheckCircle2, XCircle, AlertCircle, Timer, Users,
  Sparkles, Award, Compass, Play, Calendar, UserCheck, DollarSign,
  Sun, Check, X, ChevronRight, ArrowRight
} from 'lucide-react';
import { attendanceApi, dashboardApi, leaveApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardApi.adminStats().then(r => r.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => leaveApi.adminUpdateStatus(parseInt(id), { status: 'Approved' }),
    onSuccess: () => {
      toast.success('Leave request approved!');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => leaveApi.adminUpdateStatus(parseInt(id), { status: 'Rejected' }),
    onSuccess: () => {
      toast.success('Leave request rejected!');
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-3xl p-6 h-36 skeleton animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentLeaves = data?.recentLeaves || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Dashboard <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">overview</span>
          </h2>
          <p className="text-text-secondary text-sm">Welcome back, Admin. Here's your workspace today.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            to="/admin/employees"
            className="bg-white border border-border hover:bg-background text-text-primary text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition-all"
          >
            Manage Team
          </Link>
          <Link
            to="/admin/leave"
            className="bg-plum hover:bg-primary-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Approvals Board
          </Link>
        </div>
      </header>

      {/* KPI High Fidelity Widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1 */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[80px] -mr-8 -mt-8 transition-all group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-plum-accent" />
            </div>
            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Workforce</span>
          </div>
          <div className="relative">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.totalEmployees ?? 0}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span className="handwritten-text text-sm text-green-600 font-semibold">Active staff: {stats.activeEmployees ?? 0}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-[11px] text-text-secondary">Total staff registers in system</p>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[80px] -mr-8 -mt-8 transition-all group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Attendance</span>
          </div>
          <div className="relative">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.todayPresent ?? 0}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span className="handwritten-text text-sm text-green-600 font-semibold">Checked-in today</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-[11px] text-text-secondary">Active employee attendance rate</p>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[80px] -mr-8 -mt-8 transition-all group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Absences</span>
          </div>
          <div className="relative">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.todayAbsent ?? 0}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span className="handwritten-text text-sm text-red-600 font-semibold">Absent today</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-[11px] text-text-secondary">Requires check-in follow-up</p>
          </div>
        </div>

        {/* Widget 4 */}
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[80px] -mr-8 -mt-8 transition-all group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">Leaves</span>
          </div>
          <div className="relative">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.pendingLeaves ?? 0}</h3>
            <div className="mt-2 flex items-center gap-1">
              <span className="handwritten-text text-sm text-orange-600 font-semibold">Awaiting approval</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-[11px] text-text-secondary">Requires admin review</p>
          </div>
        </div>
      </section>

      {/* AI Suggestions + approvals board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: AI Burnout suggestions */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-plum rounded-[2rem] p-8 shadow-lg flex flex-col relative overflow-hidden text-white h-full justify-between">
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full -ml-8 -mb-8 blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">AI Suggestion</span>
              </div>

              <h3 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                Burnout Risk <br />
                <span className="handwritten-text italic text-white/90 font-normal">Alert!</span>
              </h3>

              <p className="text-sm text-white/90 mb-8 leading-relaxed">
                Workforce reports suggest a <span className="font-bold underline decoration-wavy decoration-white/40 underline-offset-4">28% increase</span> in overtime. Reviewing Q3 sprint allocations is highly recommended to prevent talent loss.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-8">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-white/80">Confidence Score</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/leave')}
              className="relative z-10 w-full bg-white text-plum-accent font-bold text-xs py-3.5 rounded-2xl hover:bg-primary-50 transition-all shadow-md active:scale-95"
            >
              Review Leave Board
            </button>
          </div>
        </div>

        {/* Right Side: Approvals Feed */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white border border-border rounded-[2rem] shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-background/50">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Pending Approvals</h3>
                <p className="text-text-secondary text-xs">Requires your immediate action</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-50 text-plum-accent border border-primary-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
                  {recentLeaves.length} Tasks
                </span>
                <span className="handwritten-text text-xl ml-1 text-plum-accent">Do it!</span>
              </div>
            </div>

            <div className="flex-grow divide-y divide-border/40 overflow-y-auto max-h-[360px]">
              {recentLeaves.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-text-secondary opacity-30 mb-2" />
                  <p className="text-sm text-text-secondary">All leaves processed. Great job!</p>
                </div>
              ) : (
                recentLeaves.map((l: any) => {
                  const empInitials = `${l.employee.firstName[0]}${l.employee.lastName[0]}`;
                  return (
                    <div key={l.id} className="px-8 py-5 hover:bg-primary-50/20 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-plum flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:rotate-2 transition-transform">
                          {empInitials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-primary">
                            {l.employee.firstName} {l.employee.lastName}
                          </h4>
                          <p className="text-xs text-text-secondary">
                            {l.leaveType?.name} · {l.totalDays} day(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {l.aiPriority && (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                            l.aiPriority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                            l.aiPriority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-green-50 text-green-700 border-green-100'
                          }`}>
                            {l.aiPriority} priority
                          </span>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => rejectMutation.mutate(l.id)}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                            className="w-8 h-8 rounded-full border border-border hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center text-text-secondary"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => approveMutation.mutate(l.id)}
                            disabled={rejectMutation.isPending || approveMutation.isPending}
                            className="w-8 h-8 rounded-full bg-plum hover:bg-primary-700 text-white transition-all flex items-center justify-center shadow-sm"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-8 py-4 border-t border-border bg-background/20 text-center">
              <Link
                to="/admin/leave"
                className="text-xs font-bold text-plum-accent hover:underline flex items-center justify-center gap-1.5 mx-auto"
              >
                View Leave Requests Board
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Visual Rhythm */}
      <section className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-surface-container-low rounded-3xl p-8 flex items-center justify-between border border-border/40">
          <div>
            <h4 className="text-base font-bold tracking-tight mb-1">Pulse Audit logs</h4>
            <p className="text-xs text-text-secondary">View employee check-in details and verify time-cards.</p>
            <Link
              to="/admin/attendance"
              className="mt-4 text-plum-accent font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all block"
            >
              Audits List <ChevronRight className="w-3.5 h-3.5 ml-1 inline-block" />
            </Link>
          </div>
          <div className="hidden md:block relative w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
            <Timer className="w-10 h-10 text-plum-accent" />
            <div className="absolute -top-1 -right-1 bg-plum text-white text-[10px] px-2 py-0.5 rounded-full font-bold rotate-12">LIVE</div>
          </div>
        </div>

        <div className="flex-1 bg-primary-50 rounded-3xl p-8 border border-primary-100 flex flex-col justify-center text-center">
          <p className="text-sm text-plum-accent italic">"Efficiency is doing things right; effectiveness is doing the right things."</p>
          <p className="text-[10px] text-text-secondary mt-2 uppercase font-bold tracking-wider">— Peter Drucker</p>
        </div>
      </section>
    </div>
  );
}

function EmployeeDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const { data: today } = useQuery({
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
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Check-out failed'),
  });

  const summary = summaryData || {};
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.employee?.firstName || 'there';

  return (
    <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
      {/* Hero greeting */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:p-10 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 flex flex-col gap-2 max-w-xl">
          <p className="text-text-secondary text-xs font-semibold">{format(now, 'EEEE, MMMM d, yyyy')}</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mt-1">
            {greeting}, <span className="text-plum-accent">{displayName}!</span>
            <span className="block handwritten-text text-3xl text-plum-accent/80 mt-2 opacity-95">Ready for a great day?</span>
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-plum-accent">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Your Morning Brief</span>
            </div>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Welcome back to your PeopleFlow portal. Make sure to clock in to record your daily attendance log!
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => navigate('/leave')}
                className="bg-plum hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Plan Leave
              </button>
              <span className="handwritten-text text-lg text-plum-accent/90 -rotate-3">You've got this!</span>
            </div>
          </div>
        </div>

        {/* Playful Illustration icon */}
        <div className="relative w-full md:w-1/3 h-40 md:h-auto flex items-center justify-center">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 opacity-10 pointer-events-none">
            <div className="aspect-square bg-primary rounded-full"></div>
            <div className="aspect-square bg-surface-variant rounded-tr-full"></div>
            <div />
            <div />
            <div className="aspect-square bg-plum rounded-bl-full"></div>
            <div className="aspect-square bg-surface-variant rounded-full"></div>
          </div>
          <div className="relative z-10 text-plum-accent/20 flex flex-col items-center">
            <Sun className="w-24 h-24 text-plum-accent opacity-60" />
            <div className="absolute -top-2 -right-4 text-plum-accent handwritten-text text-xl rotate-12 flex items-center">
              bright
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Actions (Col span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold tracking-tight">Quick Actions</h3>
              <span className="handwritten-text text-lg text-plum-accent italic">Make things happen!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              <button
                onClick={() => navigate('/leave')}
                className="group flex flex-col items-center justify-center gap-4 bg-background hover:bg-plum hover:text-white p-6 rounded-2xl border border-border transition-all active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Calendar className="w-5 h-5 text-plum-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-center">Request Time Off</span>
              </button>

              <button
                onClick={() => navigate('/attendance')}
                className="group flex flex-col items-center justify-center gap-4 bg-background hover:bg-plum hover:text-white p-6 rounded-2xl border border-border transition-all active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Clock className="w-5 h-5 text-plum-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-center">Clock In/Out</span>
              </button>

              <button
                onClick={() => navigate('/payroll')}
                className="group flex flex-col items-center justify-center gap-4 bg-background hover:bg-plum hover:text-white p-6 rounded-2xl border border-border transition-all active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <DollarSign className="w-5 h-5 text-plum-accent group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-center">View Payslip</span>
              </button>
            </div>
          </div>

          {/* Attendance Actions section */}
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-plum-accent" /> Clock Registry
            </h3>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-background rounded-xl p-4 text-center border border-border/50">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Check In</p>
                <p className="text-base font-bold">
                  {today?.checkIn ? format(new Date(today.checkIn), 'hh:mm a') : '—'}
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center border border-border/50">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Check Out</p>
                <p className="text-base font-bold">
                  {today?.checkOut ? format(new Date(today.checkOut), 'hh:mm a') : '—'}
                </p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center border border-border/50">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Hours Logged</p>
                <p className="text-base font-bold">
                  {today?.totalHours ? `${today.totalHours} hrs` : '—'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => checkInMutation.mutate()}
                disabled={!!today?.checkIn || checkInMutation.isPending}
                className="w-1/2 py-3 bg-plum hover:bg-primary-700 text-white font-bold text-sm rounded-xl disabled:opacity-40 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {checkInMutation.isPending ? 'Working...' : 'Clock In'}
              </button>
              <button
                onClick={() => checkOutMutation.mutate()}
                disabled={!today?.checkIn || !!today?.checkOut || checkOutMutation.isPending}
                className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-sm rounded-xl disabled:opacity-40 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {checkOutMutation.isPending ? 'Logging...' : 'Clock Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar widgets (Col span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low rounded-3xl p-8 border border-primary-100 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-plum-accent" />
              <h3 className="text-[10px] font-bold text-plum-accent uppercase tracking-wider">Daily Brief</h3>
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-sm text-text-primary leading-relaxed">
                "Since you completed your active milestones early this week, why not request Friday afternoon off? You've earned it!"
              </p>
              <button
                onClick={() => navigate('/leave')}
                className="text-plum-accent font-bold text-xs hover:underline flex items-center gap-1 self-start"
              >
                Explore leave options <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold tracking-tight">Month Summary</h3>
              <TrendingUp className="w-5 h-5 text-plum-accent opacity-40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-3 border border-border/50 text-center">
                <p className="text-lg font-bold text-green-600">{summary.present ?? 0}</p>
                <p className="text-[9px] font-bold text-text-secondary uppercase mt-0.5">Present</p>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/50 text-center">
                <p className="text-lg font-bold text-orange-500">{summary.late ?? 0}</p>
                <p className="text-[9px] font-bold text-text-secondary uppercase mt-0.5">Late</p>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/50 text-center">
                <p className="text-lg font-bold text-red-600">{summary.absent ?? 0}</p>
                <p className="text-[9px] font-bold text-text-secondary uppercase mt-0.5">Absent</p>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/50 text-center">
                <p className="text-lg font-bold text-plum-accent">{summary.totalHours ?? 0}h</p>
                <p className="text-[9px] font-bold text-text-secondary uppercase mt-0.5">Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const user = useAuthStore(s => s.user);
  return user?.role === 'Admin' ? <AdminDashboard /> : <EmployeeDashboard />;
}
