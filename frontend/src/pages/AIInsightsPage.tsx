import { useQuery } from '@tanstack/react-query';
import { Brain, Sparkles, AlertTriangle, CheckCircle, Clock, CalendarDays, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leaveApi, attendanceApi, employeesApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' };
  return <span className={map[priority] ?? 'badge-gray'}>{priority}</span>;
}

function AIInsightAlert({ type, title, description }: { type: 'warning' | 'info' | 'success'; title: string; description: string }) {
  const config = {
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50 border-yellow-200', icon_color: 'text-yellow-600', title_color: 'text-yellow-800', desc_color: 'text-yellow-700' },
    info: { icon: Info, bg: 'bg-blue-50 border-blue-200', icon_color: 'text-blue-600', title_color: 'text-blue-800', desc_color: 'text-blue-700' },
    success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200', icon_color: 'text-green-600', title_color: 'text-green-800', desc_color: 'text-green-700' },
  }[type];
  const Icon = config.icon;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.icon_color}`} />
      <div>
        <p className={`text-sm font-semibold ${config.title_color}`}>{title}</p>
        <p className={`text-xs mt-0.5 leading-relaxed ${config.desc_color}`}>{description}</p>
      </div>
    </div>
  );
}

export function AIInsightsPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const { data: leavesData } = useQuery({
    queryKey: ['leaves-ai'],
    queryFn: () => leaveApi.adminGetAll().then(r => r.data.data || []),
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['attendance-ai'],
    queryFn: () => attendanceApi.adminGetAll().then(r => r.data.data || []),
  });

  const { data: employeesData } = useQuery({
    queryKey: ['employees-ai'],
    queryFn: () => employeesApi.getAll().then(r => r.data.data || []),
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

  const leaves: any[] = leavesData || [];
  const attendances: any[] = attendanceData || [];
  const employees: any[] = employeesData || [];

  // Compute AI insights from real data
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const totalWithCheckout = attendances.filter(a => a.checkOut).length;
  const attendanceRate = attendances.length > 0 ? Math.round((totalWithCheckout / attendances.length) * 100) : 100;

  // Find dept with most pending leaves
  const deptPendingMap: Record<string, number> = {};
  pendingLeaves.forEach(l => {
    const dept = l.employee?.department?.name || 'Unknown';
    deptPendingMap[dept] = (deptPendingMap[dept] || 0) + 1;
  });
  const topDept = Object.entries(deptPendingMap).sort((a, b) => b[1] - a[1])[0];

  // Leaves with AI analysis (ones that have aiSummary or recommendation)
  const aiAnalyzedLeaves = leaves.filter(l => l.aiSummary || l.aiRecommendation || l.aiPriority || l.suggestedLeaveType);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="AI Insights"
        subtitle="Powered by Google Gemini · Automated HR Intelligence"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'AI Insights' }]}
        icon={<Brain className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper space-y-6">
        {/* AI Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#714b67] to-[#4a3060] text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-16" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-12" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Google Gemini AI Integration</h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                PeopleFlow uses <strong>Google Gemini 1.5 Flash</strong> to automatically analyze every leave request.
                When an employee submits a leave request, the AI evaluates the reason, suggests the optimal leave type (Sick, Paid, or Unpaid),
                assigns a priority level, and provides HR recommendations — all in real time.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Auto Leave Type Detection', 'Priority Classification', 'HR Recommendations', 'Real-time Analysis'].map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                    <Zap className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Insights */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-plum-accent" />
            <h3 className="font-semibold text-sm text-text-primary">Live Workforce Insights</h3>
            <span className="ml-auto text-[10px] text-text-secondary bg-background px-2 py-0.5 rounded-full border border-border">
              Auto-computed from real data
            </span>
          </div>
          <div className="space-y-3">
            {pendingLeaves.length > 5 ? (
              <AIInsightAlert
                type="warning"
                title={`High Leave Backlog — ${pendingLeaves.length} Pending Requests`}
                description="There is an unusually high number of pending leave requests. Review and process them to maintain employee satisfaction."
              />
            ) : pendingLeaves.length > 0 ? (
              <AIInsightAlert
                type="info"
                title={`${pendingLeaves.length} Leave Request${pendingLeaves.length > 1 ? 's' : ''} Awaiting Approval`}
                description="Pending leave requests should be reviewed promptly to avoid delays in employee scheduling."
              />
            ) : (
              <AIInsightAlert
                type="success"
                title="No Pending Leave Requests"
                description="All leave requests have been processed. The team is up to date."
              />
            )}

            {attendanceRate < 80 ? (
              <AIInsightAlert
                type="warning"
                title={`Low Attendance Rate — ${attendanceRate}%`}
                description="Attendance is below 80%. Consider reviewing attendance policies or investigating potential issues."
              />
            ) : (
              <AIInsightAlert
                type="success"
                title={`Good Attendance Rate — ${attendanceRate}%`}
                description="Workforce attendance is healthy. Keep monitoring for any emerging patterns."
              />
            )}

            {topDept && topDept[1] > 1 ? (
              <AIInsightAlert
                type="info"
                title={`${topDept[0]} has Most Pending Leaves (${topDept[1]})`}
                description={`The ${topDept[0]} department has the highest concentration of unprocessed leave requests. Consider prioritizing review.`}
              />
            ) : null}

            <AIInsightAlert
              type="info"
              title={`${employees.length} Active Employees Tracked`}
              description="All employee records are being actively monitored for leave, attendance, and payroll insights."
            />
          </div>
        </div>

        {/* AI-Analyzed Leave Requests */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-plum-accent" />
            <h3 className="font-semibold text-sm text-text-primary">AI-Analyzed Leave Requests</h3>
            <span className="badge-purple ml-auto">{aiAnalyzedLeaves.length} analyzed</span>
          </div>
          {aiAnalyzedLeaves.length === 0 ? (
            <div className="p-6">
              <EmptyState
                variant="analytics"
                title="No AI-analyzed requests yet"
                description="When employees apply for leave, AI will automatically analyze their requests and provide insights here."
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {aiAnalyzedLeaves.slice(0, 8).map((l: any) => (
                <div key={l.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-plum flex items-center justify-center text-white text-xs font-bold">
                        {l.employee?.firstName?.[0]}{l.employee?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{l.employee?.firstName} {l.employee?.lastName}</p>
                        <p className="text-xs text-text-secondary">{l.leaveType?.name} · {l.status}</p>
                      </div>
                    </div>
                    {(l.aiPriority || l.priority) && <PriorityBadge priority={l.aiPriority || l.priority} />}
                  </div>

                  {l.aiSummary && (
                    <div className="bg-primary-50 rounded-xl p-3 mb-2 border border-primary-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Brain className="w-3 h-3 text-plum-accent" />
                        <span className="text-[10px] font-bold text-plum-accent uppercase tracking-wider">AI Summary</span>
                      </div>
                      <p className="text-xs text-text-primary leading-relaxed">{l.aiSummary}</p>
                    </div>
                  )}

                  {(l.aiRecommendation || l.recommendation) && (
                    <div className="flex items-start gap-2 mt-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">{l.aiRecommendation || l.recommendation}</p>
                    </div>
                  )}

                  {l.suggestedLeaveType && l.suggestedLeaveType !== l.leaveType?.name && (
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        AI suggested: <strong>{l.suggestedLeaveType}</strong>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
