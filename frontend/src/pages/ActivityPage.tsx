import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import type { LucideIcon } from 'lucide-react';
import {
  Activity, Clock, User, Shield, Briefcase, Calendar, DollarSign,
  Building2, LogIn, Cpu, Zap, Search, RefreshCw, Filter, Download,
  ChevronDown, ChevronUp, Sparkles, CheckCircle2, XCircle, AlertTriangle,
  Info, ArrowUpRight, X, SlidersHorizontal, Bell
} from 'lucide-react';
import { activityApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityLogItem {
  id: number;
  module: string;
  action: string;
  description: string;
  actorId?: number;
  actorName?: string;
  actorRole?: string;
  targetId?: number;
  targetName?: string;
  employeeId?: number;
  departmentId?: number;
  metadata?: Record<string, unknown>;
  severity: 'info' | 'success' | 'warning' | 'error' | 'ai';
  isAdminOnly: boolean;
  createdAt: string;
}

interface ActivityStats {
  total: number;
  todayCount: number;
  moduleCounts: Record<string, number>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE_CONFIG: Record<string, {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  ring: string;
}> = {
  attendance: { label: 'Attendance', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200' },
  leave: { label: 'Leave', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  payroll: { label: 'Payroll', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200' },
  employee: { label: 'Employees', icon: User, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  department: { label: 'Departments', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50', ring: 'ring-teal-200' },
  auth: { label: 'Authentication', icon: LogIn, color: 'text-slate-600', bg: 'bg-slate-50', ring: 'ring-slate-200' },
  system: { label: 'System', icon: Cpu, color: 'text-gray-600', bg: 'bg-gray-50', ring: 'ring-gray-200' },
  ai: { label: 'AI', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-200' },
};

const SEVERITY_CONFIG: Record<string, {
  icon: LucideIcon;
  dot: string;
  border: string;
  bg: string;
}> = {
  success: { icon: CheckCircle2, dot: 'bg-emerald-400', border: 'border-l-emerald-400', bg: 'bg-emerald-50/30' },
  error: { icon: XCircle, dot: 'bg-red-400', border: 'border-l-red-400', bg: 'bg-red-50/30' },
  warning: { icon: AlertTriangle, dot: 'bg-amber-400', border: 'border-l-amber-400', bg: 'bg-amber-50/30' },
  ai: { icon: Sparkles, dot: 'bg-violet-400', border: 'border-l-violet-400', bg: 'bg-violet-50/30' },
  info: { icon: Info, dot: 'bg-blue-400', border: 'border-l-blue-400', bg: '' },
};

const FILTERS = [
  { key: 'all', label: 'All Activity' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'employee', label: 'Employees' },
  { key: 'department', label: 'Departments' },
  { key: 'auth', label: 'Auth' },
  { key: 'ai', label: 'AI' },
  { key: 'system', label: 'System' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const groupActivities = (activities: ActivityLogItem[]) => {
  const groups: Record<string, ActivityLogItem[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  activities.forEach((a) => {
    const date = parseISO(a.createdAt);
    if (isToday(date)) groups['Today'].push(a);
    else if (isYesterday(date)) groups['Yesterday'].push(a);
    else if (isThisWeek(date)) groups['This Week'].push(a);
    else groups['Earlier'].push(a);
  });

  return Object.entries(groups).filter(([, items]) => items.length > 0);
};

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getAvatarColor = (name?: string): string => {
  const colors = [
    'bg-plum-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-violet-500', 'bg-teal-500', 'bg-orange-500',
  ];
  if (!name) return 'bg-gray-400';
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const downloadCSV = (activities: ActivityLogItem[]) => {
  const headers = ['ID', 'Module', 'Action', 'Description', 'Actor', 'Actor Role', 'Target', 'Severity', 'Timestamp'];
  const rows = activities.map(a => [
    a.id, a.module, a.action, `"${a.description.replace(/"/g, '""')}"`,
    a.actorName || '', a.actorRole || '', a.targetName || '',
    a.severity, format(parseISO(a.createdAt), 'yyyy-MM-dd HH:mm:ss'),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `peopleflow-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AISummaryPanel({ isAdmin, employeeId }: { isAdmin: boolean; employeeId?: number }) {
  const [collapsed, setCollapsed] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['activity-summary', isAdmin, employeeId],
    queryFn: () => activityApi.getSummary().then(r => r.data.data as { summary: string }),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const bullets = data?.summary
    ? data.summary.split('\n').filter(b => b.trim().startsWith('•'))
    : [];

  return (
    <div className="card mb-6 border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-purple-50/40 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-100 ring-2 ring-violet-200">
            <Sparkles size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Today's AI Summary</p>
            <p className="text-xs text-gray-500">Powered by Gemini · Updates every 2 minutes</p>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-violet-100 text-gray-500 transition-colors">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="border-t border-violet-100 px-5 py-4">
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-300 flex-shrink-0" />
                  <div className="skeleton h-4 rounded flex-1" style={{ width: `${60 + i * 12}%` }} />
                </div>
              ))}
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle size={14} />
              <span>AI summary temporarily unavailable</span>
              <button onClick={() => refetch()} className="ml-1 underline text-violet-600 hover:no-underline">Retry</button>
            </div>
          )}
          {!isLoading && !isError && bullets.length === 0 && (
            <p className="text-sm text-gray-500 italic">No activity to summarize yet today.</p>
          )}
          {!isLoading && !isError && bullets.length > 0 && (
            <ul className="space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-[6px]" />
                  <span>{b.replace(/^•\s*/, '')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityLogItem }) {
  const modCfg = MODULE_CONFIG[activity.module] || MODULE_CONFIG.system;
  const sevCfg = SEVERITY_CONFIG[activity.severity] || SEVERITY_CONFIG.info;
  const ModIcon = modCfg.icon;
  const SevIcon = sevCfg.icon;

  const date = parseISO(activity.createdAt);
  const relTime = formatDistanceToNow(date, { addSuffix: true });
  const absTime = format(date, 'h:mm a');
  const absDate = format(date, 'MMM d, yyyy');

  const isAI = activity.module === 'ai';
  const isSystem = activity.module === 'system' || activity.module === 'auth';

  return (
    <div
      className={`
        relative flex gap-4 px-5 py-4 rounded-xl border border-gray-100
        border-l-4 ${sevCfg.border} ${sevCfg.bg}
        hover:shadow-sm hover:border-gray-200 transition-all duration-200
        group animate-fade-in
        ${isAI ? 'ring-1 ring-violet-100' : ''}
      `}
    >
      {/* Avatar / Module Icon */}
      <div className="flex-shrink-0 flex flex-col items-center">
        {!isSystem && activity.actorName ? (
          <div
            className={`
              w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold
              ${getAvatarColor(activity.actorName)} ring-2 ring-white shadow-sm
            `}
          >
            {getInitials(activity.actorName)}
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm ${modCfg.bg} ${modCfg.ring} ring-2`}
          >
            <ModIcon size={16} className={modCfg.color} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: actor + badges */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {activity.actorName && (
            <span className="font-semibold text-gray-800 text-sm">{activity.actorName}</span>
          )}

          {/* Module badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${modCfg.bg} ${modCfg.color}`}>
            <ModIcon size={10} />
            {modCfg.label}
          </span>

          {/* AI badge */}
          {isAI && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-100 text-violet-700">
              <Zap size={10} />
              AI Insight
            </span>
          )}

          {/* Severity badge for important events */}
          {(activity.severity === 'error' || activity.severity === 'warning') && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
              activity.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <SevIcon size={10} />
              {activity.severity === 'error' ? 'Critical' : 'Alert'}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>

        {/* Metadata pills (optional) */}
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (() => {
          const meta = activity.metadata as Record<string, unknown>;
          return (
            <div className="flex flex-wrap gap-2 mt-2">
              {Boolean(meta.leaveType) && (
                <span className="text-[11px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">
                  {String(meta.leaveType)}
                </span>
              )}
              {meta.totalDays != null && (
                <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {String(meta.totalDays)} day(s)
                </span>
              )}
              {meta.netSalary != null && (
                <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
                  ₹{Number(meta.netSalary).toLocaleString('en-IN')}
                </span>
              )}
              {meta.totalHours != null && (
                <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {Number(meta.totalHours).toFixed(1)}h
                </span>
              )}
            </div>
          );
        })()}

        {/* Bottom: time */}

        <div className="flex items-center gap-2 mt-2">
          <Clock size={11} className="text-gray-400 flex-shrink-0" />
          <span className="text-[11px] text-gray-400">{relTime}</span>
          <span className="text-[11px] text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{absTime}</span>
          {!isToday(date) && (
            <>
              <span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">{absDate}</span>
            </>
          )}
        </div>
      </div>

      {/* Severity indicator dot */}
      <div className="flex-shrink-0 flex items-start pt-1">
        <div className={`w-2 h-2 rounded-full ${sevCfg.dot} opacity-70`} />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex gap-4 px-5 py-4 rounded-xl border border-gray-100">
      <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-plum-50 to-purple-100 flex items-center justify-center shadow-inner">
          <Activity size={36} className="text-plum-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
          <Sparkles size={14} className="text-violet-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No activity yet</h3>
      <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
        Everything is quiet right now. Once your team starts checking in, requesting leave, or calculating payroll, their updates will instantly stream here!
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ActivityPage() {
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'Admin';

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 400);
  }, []);

  const queryParams = {
    module: activeFilter !== 'all' ? activeFilter : undefined,
    search: search || undefined,
    page,
    limit: 30,
  };

  const {
    data: feedData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['activity-feed', queryParams],
    queryFn: () => activityApi.getFeed(queryParams).then(r => ({
      activities: r.data.data as ActivityLogItem[],
      pagination: r.data.pagination,
    })),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // auto-refresh every 60s
  });

  const { data: statsData } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: () => activityApi.getStats().then(r => r.data.data as ActivityStats),
    staleTime: 30 * 1000,
  });

  const activities = feedData?.activities ?? [];
  const pagination = feedData?.pagination;
  const grouped = groupActivities(activities);

  const handleRefresh = () => {
    refetch();
    toast.success('Activity feed refreshed', { duration: 1500 });
  };

  const handleExport = () => {
    if (activities.length === 0) {
      toast.error('No activities to export');
      return;
    }
    downloadCSV(activities);
    toast.success(`Exported ${activities.length} activities`);
  };

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    setPage(1);
  };

  return (
    <div className="page-wrapper max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>PeopleFlow</span>
          <span>/</span>
          <span className="text-gray-600 font-medium">Activity Center</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-plum-500 to-purple-600 flex items-center justify-center shadow-lg shadow-plum-200">
              <Activity size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Center</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isAdmin
                  ? 'Live organizational activity feed · Auto-refreshes every minute'
                  : 'Your personal activity timeline'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="btn-ghost text-sm flex items-center gap-2 min-h-[38px] px-3.5 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(s => !s)}
              className={`btn-ghost text-sm flex items-center gap-2 min-h-[38px] px-3.5 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none ${showFilters ? 'bg-plum-50 text-plum-600' : ''}`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleExport}
                className="btn-secondary text-sm flex items-center gap-2 min-h-[38px] px-3.5 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none"
              >
                <Download size={14} />
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      {statsData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Events', value: statsData.total, icon: Activity, color: 'text-plum-600', bg: 'bg-plum-50' },
            { label: 'Today', value: statsData.todayCount, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Check-ins', value: statsData.moduleCounts.attendance || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Leave Events', value: statsData.moduleCounts.leave || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label} className="card flex items-center gap-3 py-3 px-4">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{s.value.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── AI Summary Panel ────────────────────────────────────────────── */}
      <AISummaryPanel isAdmin={isAdmin} employeeId={user?.employee?.id} />

      {/* ── Search + Filter Bar ─────────────────────────────────────────── */}
      <div className="card mb-4 p-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by name, action, module…"
            className="form-input pl-9 pr-4 w-full text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-primary rounded p-0.5"
              aria-label="Clear Search Input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Module filter chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {FILTERS.map((f) => {
            const count = f.key !== 'all' ? (statsData?.moduleCounts[f.key] || 0) : (statsData?.total || 0);
            const modCfg = MODULE_CONFIG[f.key];
            const Icon = modCfg?.icon;
            return (
              <button
                type="button"
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                  ${activeFilter === f.key
                    ? 'bg-plum-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {Icon && <Icon size={11} />}
                {f.label}
                {count > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    activeFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-3">Advanced Filters</p>
            <div className="flex flex-wrap gap-3">
              <select className="form-input text-sm py-1.5 pr-8 w-auto">
                <option value="">All Severities</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error / Critical</option>
                <option value="ai">AI Events</option>
              </select>
              <input type="date" className="form-input text-sm py-1.5 w-auto" placeholder="From date" />
              <input type="date" className="form-input text-sm py-1.5 w-auto" placeholder="To date" />
            </div>
          </div>
        )}
      </div>

      {/* ── Timeline Feed ───────────────────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <div className="card text-center py-12">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle size={24} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Failed to load activity</h3>
          <p className="text-sm text-gray-500 mb-4">Check your connection and try again.</p>
          <button onClick={() => refetch()} className="btn-primary text-sm">
            <RefreshCw size={14} className="mr-2" />
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && activities.length === 0 && <EmptyState />}

      {!isLoading && !isError && grouped.length > 0 && (
        <div className="space-y-8">
          {grouped.map(([groupLabel, items]) => (
            <div key={groupLabel}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-plum-400" />
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {groupLabel}
                  </h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {items.length} event{items.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {items.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {((page - 1) * 30) + 1}–{Math.min(page * 30, pagination.total)} of {pagination.total} events
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
