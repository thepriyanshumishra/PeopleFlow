import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, CalendarDays, ChevronLeft, ChevronRight, X, Sparkles, Info } from 'lucide-react';
import { leaveApi } from '@/api/endpoints';
import { getLeaveStatusBadge, getPriorityBadge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

function ApplyLeaveModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [aiPreview, setAiPreview] = useState<any>(null);

  const { data: leaveTypesData } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.getTypes().then(r => r.data.data),
  });

  const { data: balanceData } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: () => leaveApi.getBalance().then(r => r.data.data),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => leaveApi.apply({
      leaveTypeId: parseInt(data.leaveTypeId),
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    }),
    onSuccess: (res) => {
      const leave = res.data.data;
      setAiPreview({
        summary: leave.aiSummary,
        suggestedType: leave.aiSuggestedType,
        priority: leave.aiPriority,
        recommendation: leave.aiRecommendation,
      });
      queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      toast.success('Leave request submitted!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit'),
  });

  const leaveTypes = (leaveTypesData as any[]) || [];
  const balances = (balanceData as any[]) || [];
  const watchedTypeId = watch('leaveTypeId');
  const selectedBalance = balances.find((b: any) => String(b.leaveTypeId) === String(watchedTypeId));

  if (mutation.isSuccess && aiPreview) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Analysis
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background">
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-xl">
              <p className="text-xs font-semibold text-primary uppercase mb-1.5">Summary</p>
              <p className="text-sm text-text-primary">{aiPreview.summary || 'Leave request submitted.'}</p>
            </div>
            {aiPreview.suggestedType && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded-xl">
                  <p className="text-xs text-text-secondary mb-1">Suggested Type</p>
                  <p className="text-sm font-semibold text-text-primary">{aiPreview.suggestedType}</p>
                </div>
                <div className="p-3 bg-background rounded-xl">
                  <p className="text-xs text-text-secondary mb-1">AI Priority</p>
                  <div>{getPriorityBadge(aiPreview.priority)}</div>
                </div>
              </div>
            )}
            {aiPreview.recommendation && (
              <div className="p-4 bg-yellow-50 rounded-xl flex gap-2">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">{aiPreview.recommendation}</p>
              </div>
            )}
            <p className="text-sm text-center text-text-secondary">
              Your leave request is submitted and pending admin approval.
            </p>
            <button onClick={onClose} className="btn-primary w-full">Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Apply for Leave</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="form-label">Leave Type <span className="text-error">*</span></label>
            <select className="form-input" {...register('leaveTypeId', { required: true })}>
              <option value="">Select leave type</option>
              {leaveTypes.map((lt: any) => (
                <option key={lt.id} value={lt.id}>{lt.name}</option>
              ))}
            </select>
            {selectedBalance && (
              <p className="text-xs text-text-secondary mt-1">
                Balance: <strong className="text-primary">{selectedBalance.remainingDays} days</strong> remaining
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">From <span className="text-error">*</span></label>
              <input
                type="date"
                className="form-input"
                min={format(new Date(), 'yyyy-MM-dd')}
                {...register('startDate', { required: true })}
              />
            </div>
            <div>
              <label className="form-label">To <span className="text-error">*</span></label>
              <input
                type="date"
                className="form-input"
                min={format(new Date(), 'yyyy-MM-dd')}
                {...register('endDate', { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Reason <span className="text-error">*</span></label>
            <textarea
              className={`form-input resize-none ${errors.reason ? 'form-input-error' : ''}`}
              rows={4}
              placeholder="Describe your reason for leave… AI will analyze and classify it."
              {...register('reason', { required: 'Reason is required', minLength: { value: 10, message: 'At least 10 characters' } })}
            />
            {errors.reason && <p className="form-error">{String(errors.reason.message)}</p>}
            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI will analyze your reason and provide recommendations
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-border">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
              ) : (
                <><Sparkles className="w-4 h-4" />Submit with AI</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LeavePage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  const { data: balanceData } = useQuery({
    queryKey: ['leave-balance'],
    queryFn: () => leaveApi.getBalance().then(r => r.data.data),
  });

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ['my-leaves', filterStatus, page],
    queryFn: () => leaveApi.getMyLeaves({ status: filterStatus || undefined, page, limit: 10 }).then(r => r.data),
  });

  const { data: leaveTypesData } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.getTypes().then(r => r.data.data),
  });

  const balances = (balanceData as any[]) || [];
  const leaves = leavesData?.data || [];
  const pagination = leavesData?.pagination;

  return (
    <>
      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}
      <div className="space-y-6 animate-fade-in">
        {/* Leave Balances */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4">Leave Balance ({new Date().getFullYear()})</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {balances.map((b: any) => (
              <div key={b.id} className="bg-background rounded-xl p-4">
                <p className="text-sm font-medium text-text-primary">{b.leaveType.name}</p>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="text-2xl font-bold text-primary">{b.remainingDays}</span>
                    <span className="text-sm text-text-secondary ml-1">/ {b.totalDays}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{b.usedDays} used</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(b.remainingDays / b.totalDays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              My Leave Requests
            </h2>
            <div className="flex gap-2">
              <select
                className="form-input w-auto text-sm py-2"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button id="apply-leave-btn" onClick={() => setShowModal(true)} className="btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                Apply
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-14">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-border" />
              <p className="text-text-secondary">No leave requests found</p>
              <button onClick={() => setShowModal(true)} className="btn-primary btn-sm mt-4">
                Apply for Leave
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {leaves.map((l: any) => (
                  <div key={l.id} className="p-4 bg-background rounded-xl border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-text-primary">{l.leaveType.name}</span>
                          {getLeaveStatusBadge(l.status)}
                          {l.aiPriority && getPriorityBadge(l.aiPriority)}
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          {format(new Date(l.startDate), 'd MMM yyyy')} — {format(new Date(l.endDate), 'd MMM yyyy')}
                          {' '}· {l.totalDays} working day(s)
                        </p>
                        <p className="text-xs text-text-primary mt-1.5 line-clamp-1">{l.reason}</p>
                        {l.aiSummary && (
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {l.aiSummary}
                          </p>
                        )}
                        {l.adminComment && (
                          <p className="text-xs text-text-secondary mt-1 italic">
                            Admin: {l.adminComment}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary flex-shrink-0">
                        {format(new Date(l.createdAt), 'd MMM')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <p className="text-text-secondary">{pagination.total} total requests</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost btn-sm border border-border disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1.5 text-text-primary font-medium">{page} / {pagination.totalPages}</span>
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
