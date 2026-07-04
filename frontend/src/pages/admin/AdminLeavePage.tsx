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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-fade-in shadow-xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${action === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
            {action === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <p className="text-xs text-text-secondary mb-5">
          You are processing {leave.totalDays} day(s) of {leave.leaveType.name} request for{' '}
          <strong className="text-text-primary">{leave.employee.firstName} {leave.employee.lastName}</strong>.
        </p>
        <div className="space-y-2">
          <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
            Add Comment (Optional)
          </label>
          <textarea
            className="w-full py-3 px-4 border border-border bg-white rounded-lg outline-none text-sm resize-none focus:border-brand-purple focus:ring-2 focus:ring-primary-100 transition-all"
            rows={3}
            placeholder="Add a comment or decision note for the employee…"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(comment)}
            disabled={loading}
            className={`w-1/2 py-3 font-bold text-xs rounded-xl shadow-sm text-white transition-all ${
              action === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Processing...' : action}
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

      <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
        {/* Header */}
        <header>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Leave Approvals <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">requests</span>
          </h2>
          <p className="text-text-secondary text-sm">Review, reject, or approve employee time-off requests.</p>
        </header>

        {/* Board Management Container */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-plum-accent" />
              Time-off Board
            </h2>
            <div className="flex gap-2 bg-background p-1 rounded-xl border border-border/60">
              {['Pending', 'Approved', 'Rejected', ''].map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s
                      ? 'bg-white text-plum-accent shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl animate-pulse bg-background border border-border" />)}
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
              <p className="text-sm text-text-secondary font-semibold">No {statusFilter.toLowerCase() || 'processed'} leave requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {leaves.map((l: any) => {
                  const empInitials = `${l.employee.firstName[0]}${l.employee.lastName[0]}`;
                  return (
                    <div key={l.id} className="p-6 bg-background rounded-2xl border border-border hover:border-plum-accent/35 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* Employee Identity block */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                              {empInitials}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{l.employee.firstName} {l.employee.lastName}</p>
                              <p className="text-xs text-text-secondary font-semibold mt-0.5">
                                {l.employee.employeeCode} · {l.employee.department?.name || 'No Dept'}
                              </p>
                            </div>
                          </div>

                          {/* Request parameters */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-text-primary bg-white px-3 py-1.5 rounded-lg border border-border/50">{l.leaveType.name}</span>
                            {getLeaveStatusBadge(l.status)}
                            {l.aiPriority && getPriorityBadge(l.aiPriority)}
                          </div>

                          <p className="text-xs text-text-secondary font-semibold">
                            Period: {format(new Date(l.startDate), 'dd MMM yyyy')} — {format(new Date(l.endDate), 'dd MMM yyyy')}
                            {' '}· <span className="text-text-primary font-bold">{l.totalDays} working day(s)</span>
                          </p>

                          <p className="text-xs text-text-primary bg-white p-3 rounded-lg border border-border/40 leading-relaxed">{l.reason}</p>

                          {/* AI Analysis callout */}
                          {l.aiSummary && (
                            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 space-y-1">
                              <p className="text-[10px] font-bold text-plum-accent flex items-center gap-1 uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Decision Helper
                              </p>
                              <p className="text-xs text-text-primary font-semibold leading-relaxed">{l.aiSummary}</p>
                              {l.aiRecommendation && (
                                <p className="text-[11px] text-text-secondary italic font-medium mt-1">{l.aiRecommendation}</p>
                              )}
                            </div>
                          )}

                          {l.adminComment && (
                            <p className="text-xs text-text-secondary italic font-semibold mt-1.5">
                              Admin comment: {l.adminComment}
                            </p>
                          )}
                        </div>

                        {/* Actions block */}
                        {l.status === 'Pending' && (
                          <div className="flex gap-2 lg:flex-col lg:w-32 shrink-0">
                            <button
                              onClick={() => setActionState({ leave: l, action: 'Approved' })}
                              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-all border border-green-100"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => setActionState({ leave: l, action: 'Rejected' })}
                              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                  <p className="text-text-secondary font-semibold">{pagination.total} leave requests total</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 text-text-primary font-bold">{page} / {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
