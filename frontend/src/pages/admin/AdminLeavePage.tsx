import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarDays, CheckCircle2, XCircle, Sparkles, ChevronLeft, ChevronRight, MessageSquare, X } from 'lucide-react';
import { leaveApi } from '@/api/endpoints';
import { getLeaveStatusBadge, getPriorityBadge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

function ActionModal({
  leave,
  action,
  onClose,
  onConfirm,
  loading,
}: {
  leave: any;
  action: 'Approved' | 'Rejected';
  onClose: () => void;
  onConfirm: (comment: string) => void;
  loading: boolean;
}) {
  const [comment, setComment] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 animate-fade-in max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${action === 'Approved' ? 'text-success' : 'text-error'}`}>
            {action === 'Approved' ? '✅ Approve Leave' : '❌ Reject Leave'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          {action === 'Approved' ? 'Approving' : 'Rejecting'} {leave.totalDays}-day {leave.leaveType.name} for{' '}
          <strong>{leave.employee.firstName} {leave.employee.lastName}</strong>.
        </p>
        <div>
          <label className="form-label flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Comment (optional)
          </label>
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="Add a note for the employee…"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="btn-ghost flex-1 border border-border">Cancel</button>
          <button
            onClick={() => onConfirm(comment)}
            disabled={loading}
            className={`flex-1 btn ${action === 'Approved' ? 'bg-success text-white hover:bg-green-600' : 'btn-danger'}`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLeavePage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [actionState, setActionState] = useState<{ leave: any; action: 'Approved' | 'Rejected' } | null>(null);

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ['admin-leaves', statusFilter, page],
    queryFn: () => leaveApi.adminGetAll({ status: statusFilter || undefined, page, limit: 10 }).then(r => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: number; status: string; comment: string }) =>
      leaveApi.adminUpdateStatus(id, { status, comment }),
    onSuccess: () => {
      toast.success(`Leave request ${actionState?.action.toLowerCase()} successfully`);
      setActionState(null);
      queryClient.invalidateQueries({ queryKey: ['admin-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });

  const leaves = leavesData?.data || [];
  const pagination = leavesData?.pagination;

  return (
    <>
      {actionState && (
        <ActionModal
          leave={actionState.leave}
          action={actionState.action}
          onClose={() => setActionState(null)}
          onConfirm={(comment) => updateMutation.mutate({ id: actionState.leave.id, status: actionState.action, comment })}
          loading={updateMutation.isPending}
        />
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Leave Requests Management
            </h2>
            <div className="flex gap-2">
              {['Pending', 'Approved', 'Rejected', ''].map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-14">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-border" />
              <p className="text-text-secondary">No {statusFilter.toLowerCase()} leave requests</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {leaves.map((l: any) => (
                  <div key={l.id} className="p-4 bg-background rounded-xl border border-border">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Employee */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {l.employee.firstName[0]}{l.employee.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{l.employee.firstName} {l.employee.lastName}</p>
                            <p className="text-xs text-text-secondary">{l.employee.employeeCode} · {l.employee.department?.name}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{l.leaveType.name}</span>
                          {getLeaveStatusBadge(l.status)}
                          {l.aiPriority && getPriorityBadge(l.aiPriority)}
                        </div>
                        <p className="text-xs text-text-secondary">
                          {format(new Date(l.startDate), 'd MMM')} — {format(new Date(l.endDate), 'd MMM yyyy')}
                          {' '}· <strong>{l.totalDays} working day(s)</strong>
                        </p>
                        <p className="text-xs text-text-primary mt-1.5 line-clamp-2">{l.reason}</p>

                        {/* AI Analysis */}
                        {l.aiSummary && (
                          <div className="mt-2 p-2 bg-primary-50 rounded-lg">
                            <p className="text-xs text-primary flex items-center gap-1 mb-0.5">
                              <Sparkles className="w-3 h-3" />AI Analysis
                            </p>
                            <p className="text-xs text-text-primary">{l.aiSummary}</p>
                            {l.aiRecommendation && (
                              <p className="text-xs text-text-secondary mt-0.5 italic">{l.aiRecommendation}</p>
                            )}
                          </div>
                        )}

                        {l.adminComment && (
                          <p className="text-xs text-text-secondary mt-1.5 italic">
                            Admin note: {l.adminComment}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      {l.status === 'Pending' && (
                        <div className="flex gap-2 lg:flex-col">
                          <button
                            onClick={() => setActionState({ leave: l, action: 'Approved' })}
                            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => setActionState({ leave: l, action: 'Rejected' })}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <p className="text-text-secondary">{pagination.total} requests</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost btn-sm border border-border disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1.5 font-medium">{page} / {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn-ghost btn-sm border border-border disabled:opacity-40">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
