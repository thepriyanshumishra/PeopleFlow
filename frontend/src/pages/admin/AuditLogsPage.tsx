import { useQuery } from '@tanstack/react-query';
import { Shield, AlertTriangle, CheckCircle, Info, XCircle, Clock, Filter, Zap } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { activityApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

const severityConfig: Record<string, { icon: React.FC<any>; badge: string; bg: string; iconColor: string }> = {
  success: { icon: CheckCircle, badge: 'badge-green', bg: 'bg-green-50 border-green-200', iconColor: 'text-green-600' },
  error:   { icon: XCircle,    badge: 'badge-red',    bg: 'bg-red-50 border-red-200',     iconColor: 'text-red-600'   },
  warning: { icon: AlertTriangle, badge: 'badge-yellow', bg: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600' },
  ai:      { icon: Zap,        badge: 'badge-purple', bg: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600' },
  info:    { icon: Info,       badge: 'badge-blue',   bg: 'bg-blue-50 border-blue-200',   iconColor: 'text-blue-600'  },
};

const moduleColors: Record<string, string> = {
  attendance: 'badge-blue',
  leave:      'badge-yellow',
  payroll:    'badge-green',
  employee:   'badge-purple',
  department: 'badge-purple',
  auth:       'badge-gray',
  system:     'badge-gray',
  ai:         'badge-purple',
};

export function AuditLogsPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['activity-audit'],
    queryFn: () => activityApi.getFeed({ limit: 200 }).then(r => r.data.data || []),
    refetchInterval: 60000,
  });

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-text-primary">Admin Access Required</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const activities: any[] = data || [];

  const filtered = activities.filter(a => {
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const q = search.toLowerCase();
    const matchSearch = !search
      || a.description?.toLowerCase().includes(q)
      || a.action?.toLowerCase().includes(q)
      || a.targetName?.toLowerCase().includes(q)
      || a.module?.toLowerCase().includes(q);
    return matchSeverity && matchSearch;
  });

  const severityStats = {
    success: activities.filter(a => a.severity === 'success').length,
    error:   activities.filter(a => a.severity === 'error').length,
    warning: activities.filter(a => a.severity === 'warning').length,
    info:    activities.filter(a => a.severity === 'info' || !a.severity).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Audit Logs"
        subtitle="Organisation-wide activity log and system event history"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Audit Logs' }]}
        icon={<Shield className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {(Object.entries(severityStats) as [string, number][]).map(([severity, count]) => {
            const cfg = severityConfig[severity] ?? severityConfig.info;
            const Icon = cfg.icon;
            return (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severityFilter === severity ? 'all' : severity)}
                className={`card p-4 flex items-center gap-3 text-left transition-all hover:shadow-md ${severityFilter === severity ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-text-primary">{count}</p>
                  <p className="text-[11px] text-text-secondary capitalize">{severity}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5 flex-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Shield className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by action, description, module…"
              className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none flex-1 focus-visible:ring-1 focus-visible:ring-primary/20 rounded px-1"
            />
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5">
            <Filter className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <select
              aria-label="Filter Audit Logs by Severity"
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-transparent text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
            >
              <option value="all">All Severities</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="ai">AI</option>
            </select>
          </div>
        </div>

        {/* Log Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="w-8 h-8 skeleton rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 skeleton rounded w-1/3" />
                    <div className="h-3 skeleton rounded w-2/3" />
                  </div>
                  <div className="h-3 skeleton rounded w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="search"
              title="No audit logs yet"
              description="No activity matches your selected filters."
            />
          ) : (
            <>
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-background">
                <div className="col-span-1 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Type</div>
                <div className="col-span-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Module</div>
                <div className="col-span-7 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Description</div>
                <div className="col-span-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Time</div>
              </div>

              <div className="divide-y divide-border">
                {filtered.map((a: any) => {
                  const cfg = severityConfig[a.severity] ?? severityConfig.info;
                  const Icon = cfg.icon;
                  return (
                    <div key={a.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-background/60 transition-colors items-start">
                      <div className="col-span-2 sm:col-span-1">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                        </div>
                      </div>
                      <div className="col-span-10 sm:col-span-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${moduleColors[a.module] ?? 'badge-gray'}`}>
                          {a.module}
                        </span>
                        {a.actorRole && (
                          <p className="text-[10px] text-text-secondary mt-1">{a.actorRole}</p>
                        )}
                      </div>
                      <div className="col-span-12 sm:col-span-7 mt-2 sm:mt-0">
                        <p className="text-xs font-semibold text-text-primary leading-snug">{a.description}</p>
                        {a.targetName && (
                          <p className="text-[11px] text-text-secondary mt-0.5 truncate">Target: {a.targetName}</p>
                        )}
                        <p className="text-[10px] text-text-secondary/60 mt-0.5 font-mono">{a.action}</p>
                      </div>
                      <div className="col-span-12 sm:col-span-2 mt-2 sm:mt-0 flex items-center gap-1 text-[11px] text-text-secondary">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span title={format(new Date(a.createdAt), 'PPpp')}>
                          {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-5 py-3 border-t border-border bg-background">
                <p className="text-xs text-text-secondary">
                  Showing {filtered.length} of {activities.length} activity events
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
