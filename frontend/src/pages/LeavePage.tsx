import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, CalendarDays, ChevronLeft, ChevronRight, X, Sparkles, Info, Calendar } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-fade-in shadow-xl relative" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-plum-accent">
              <Sparkles className="w-5 h-5 text-plum-accent" />
              AI Leave Analysis
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background">
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          <div className="space-y-5">
            <div className="p-5 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-[10px] font-bold text-plum-accent uppercase tracking-wider mb-1.5">Summary</p>
              <p className="text-sm text-text-primary leading-relaxed">{aiPreview.summary || 'Leave request submitted.'}</p>
            </div>
            {aiPreview.suggestedType && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-2xl border border-border/50">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">Suggested</p>
                  <p className="text-sm font-semibold text-text-primary">{aiPreview.suggestedType}</p>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-border/50">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">Priority</p>
                  <div>{getPriorityBadge(aiPreview.priority)}</div>
                </div>
              </div>
            )}
            {aiPreview.recommendation && (
              <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-2">
                <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 leading-relaxed">{aiPreview.recommendation}</p>
              </div>
            )}
            <p className="text-xs text-center text-text-secondary">
              Your leave request is submitted and pending admin approval.
            </p>
            <button onClick={onClose} className="w-full py-3 bg-plum text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full animate-fade-in shadow-xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Apply for Leave</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div>
            <label className="form-label block" htmlFor="leaveType">Leave Type <span className="text-error">*</span></label>
            <select
              id="leaveType"
              className="w-full py-3 px-4 border border-border bg-white rounded-lg outline-none text-sm"
              {...register('leaveTypeId', { required: true })}
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((lt: any) => (
                <option key={lt.id} value={lt.id}>{lt.name}</option>
              ))}
            </select>
            {selectedBalance && (
              <p className="text-xs text-text-secondary mt-1.5">
                Balance: <strong className="text-plum-accent">{selectedBalance.remainingDays} days</strong> remaining
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label block" htmlFor="startDate">From <span className="text-error">*</span></label>
              <input
                type="date"
                id="startDate"
                className="w-full py-3 px-4 border border-border bg-white rounded-lg outline-none text-sm"
                min={format(new Date(), 'yyyy-MM-dd')}
                {...register('startDate', { required: true })}
              />
            </div>
            <div>
              <label className="form-label block" htmlFor="endDate">To <span className="text-error">*</span></label>
              <input
                type="date"
                id="endDate"
                className="w-full py-3 px-4 border border-border bg-white rounded-lg outline-none text-sm"
                min={format(new Date(), 'yyyy-MM-dd')}
                {...register('endDate', { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="form-label block" htmlFor="reason">Reason <span className="text-error">*</span></label>
            <textarea
              id="reason"
              className={`w-full py-3 px-4 border border-border bg-white rounded-lg outline-none text-sm resize-none ${errors.reason ? 'border-error' : ''}`}
              rows={4}
              placeholder="Describe your reason for leave… AI will analyze and classify it."
              {...register('reason', { required: 'Reason is required', minLength: { value: 10, message: 'At least 10 characters' } })}
            />
            {errors.reason && <p className="text-xs text-red-600 mt-1">{String(errors.reason.message)}</p>}
            <p className="text-xs text-text-secondary mt-1.5 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-plum-accent" />
              AI will analyze your reason and determine priority.
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="w-1/2 py-3 bg-plum text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
              {mutation.isPending ? 'Analyzing…' : 'Submit with AI'}
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

  const balances = (balanceData as any[]) || [];
  const leaves = leavesData?.data || [];
  const pagination = leavesData?.pagination;

  return (
    <>
      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} />}
      <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
        {/* Welcoming Hero Header */}
        <section className="relative bg-[#F4F1FA] rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-primary-100">
          <div className="flex-1 z-10 space-y-6">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-plum-accent leading-tight">
              Ready for your <br />
              next break?
            </h2>
            <p className="text-text-secondary text-sm max-w-md">
              You've earned some downtime. Check your balances below and plan your next adventure.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-plum hover:bg-primary-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              Request Time Off
            </button>
          </div>
          <div className="flex-1 relative z-10 w-full max-w-xs md:max-w-sm flex items-center justify-center">
            <svg viewBox="0 0 280 220" className="w-full h-auto drop-shadow-xl" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sky background */}
              <rect width="280" height="220" rx="20" fill="#F0EBF4"/>
              {/* Sun */}
              <circle cx="220" cy="50" r="30" fill="#FBBF24" opacity="0.8"/>
              <circle cx="220" cy="50" r="20" fill="#FCD34D"/>
              {/* Clouds */}
              <ellipse cx="60" cy="60" rx="30" ry="16" fill="white" opacity="0.9"/>
              <ellipse cx="85" cy="52" rx="22" ry="14" fill="white" opacity="0.9"/>
              <ellipse cx="40" cy="55" rx="18" ry="12" fill="white" opacity="0.9"/>
              <ellipse cx="170" cy="80" rx="25" ry="13" fill="white" opacity="0.7"/>
              <ellipse cx="190" cy="74" rx="18" ry="11" fill="white" opacity="0.7"/>
              {/* Ground */}
              <ellipse cx="140" cy="185" rx="120" ry="20" fill="#C4B5D5" opacity="0.4"/>
              {/* Suitcase body */}
              <rect x="90" y="130" width="100" height="65" rx="8" fill="#714b67"/>
              <rect x="90" y="130" width="100" height="65" rx="8" fill="none" stroke="#5a3a54" strokeWidth="2"/>
              {/* Suitcase handle */}
              <path d="M115 130 C115 110 165 110 165 130" stroke="#5a3a54" strokeWidth="5" strokeLinecap="round" fill="none"/>
              {/* Suitcase stripe */}
              <rect x="90" y="157" width="100" height="8" fill="#5a3a54"/>
              {/* Suitcase lock */}
              <rect x="128" y="150" width="24" height="18" rx="3" fill="#FBBF24"/>
              <circle cx="140" cy="162" r="4" fill="#D97706"/>
              {/* Decorative stars */}
              <circle cx="50" cy="100" r="3" fill="#FBBF24"/>
              <circle cx="230" cy="100" r="3" fill="#FBBF24"/>
              <circle cx="240" cy="140" r="2" fill="#C4B5D5"/>
              {/* Palm tree */}
              <line x1="40" y1="175" x2="45" y2="120" stroke="#6B4F3A" strokeWidth="4" strokeLinecap="round"/>
              <path d="M45 120 C35 105 20 108 25 95" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M45 120 C55 105 70 108 65 95" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M45 120 C38 112 25 115 30 105" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {/* Ticket */}
              <rect x="185" y="140" width="55" height="35" rx="5" fill="white" stroke="#C4B5D5" strokeWidth="1.5"/>
              <line x1="200" y1="140" x2="200" y2="175" stroke="#C4B5D5" strokeWidth="1" strokeDasharray="3,3"/>
              <rect x="205" y="148" width="25" height="4" rx="2" fill="#714b67" opacity="0.5"/>
              <rect x="205" y="156" width="18" height="3" rx="1.5" fill="#714b67" opacity="0.3"/>
              <rect x="205" y="163" width="22" height="3" rx="1.5" fill="#714b67" opacity="0.3"/>
            </svg>
          </div>
        </section>

        {/* Leave Balances Grid */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <h2 className="text-base font-bold mb-6">Leave Balance ({new Date().getFullYear()})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {balances.map((b: any) => (
              <div key={b.id} className="bg-background rounded-2xl p-6 border border-border/40 hover:scale-[1.01] transition-transform">
                <p className="text-xs font-bold text-plum-accent uppercase tracking-wider">{b.leaveType.name}</p>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <span className="text-3xl font-extrabold text-text-primary">{b.remainingDays}</span>
                    <span className="text-xs text-text-secondary ml-1 font-semibold">/ {b.totalDays} days</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">{b.usedDays} used</span>
                </div>
                {/* Progress bar */}
                <div className="mt-3.5 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-plum rounded-full transition-all"
                    style={{ width: `${(b.remainingDays / b.totalDays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests Logs */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-plum-accent" />
              My Leave Requests
            </h2>
            <div className="flex gap-3">
              <select
                className="py-2 px-4 border border-border bg-white rounded-lg text-xs outline-none"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                id="apply-leave-btn"
                onClick={() => setShowModal(true)}
                className="bg-plum hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Apply
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl animate-pulse bg-background border border-border" />)}
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
              <p className="text-sm text-text-secondary font-semibold">No leave requests found</p>
              <button onClick={() => setShowModal(true)} className="bg-plum hover:bg-primary-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl mt-4 shadow-sm">
                Apply for Leave
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {leaves.map((l: any) => (
                  <div key={l.id} className="p-5 bg-background rounded-2xl border border-border/60 hover:border-plum-accent/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-text-primary">{l.leaveType.name}</span>
                          {getLeaveStatusBadge(l.status)}
                          {l.aiPriority && getPriorityBadge(l.aiPriority)}
                        </div>
                        <p className="text-xs text-text-secondary">
                          {format(new Date(l.startDate), 'd MMM yyyy')} — {format(new Date(l.endDate), 'd MMM yyyy')}
                          {' '}· <span className="font-semibold text-text-primary">{l.totalDays} working day(s)</span>
                        </p>
                        <p className="text-xs text-text-primary bg-white p-3 rounded-lg border border-border/40 mt-2">{l.reason}</p>
                        {l.aiSummary && (
                          <div className="text-xs text-plum-accent font-medium mt-2 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI summary: {l.aiSummary}</span>
                          </div>
                        )}
                        {l.adminComment && (
                          <p className="text-xs text-text-secondary mt-1.5 italic font-medium">
                            Admin comment: {l.adminComment}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-text-secondary font-semibold flex-shrink-0">
                        {format(new Date(l.createdAt), 'd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                  <p className="text-text-secondary font-semibold">{pagination.total} total requests</p>
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
