import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { LogIn, LogOut, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { attendanceApi } from '@/api/endpoints';
import { getAttendanceStatusBadge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export function AttendancePage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: todayData } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => attendanceApi.getToday().then(r => r.data.data),
    refetchInterval: 60000,
  });

  const { data: summaryData } = useQuery({
    queryKey: ['attendance-summary', month, year],
    queryFn: () => attendanceApi.getSummary({ month, year }).then(r => r.data.data),
  });

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['attendance-history', month, year, page],
    queryFn: () => attendanceApi.getMyAttendance({ month, year, page, limit: 15 }).then(r => r.data),
  });

  const checkInMutation = useMutation({
    mutationFn: () => attendanceApi.checkIn(),
    onSuccess: () => {
      toast.success('Checked in! Have a great day 🚀');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Check-in failed'),
  });

  const checkOutMutation = useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      toast.success('Checked out! See you tomorrow 👋');
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Check-out failed'),
  });

  const today = todayData;
  const summary = summaryData || {};
  const records = historyData?.data || [];
  const pagination = historyData?.pagination;

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setPage(1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setPage(1);
  };

  const monthLabel = new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
      {/* Header */}
      <header>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Attendance Portal <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">tracking</span>
        </h2>
        <p className="text-text-secondary text-sm">Register your check-ins and audit monthly status reports.</p>
      </header>

      {/* Clocking dashboard */}
      <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-plum-accent" />
          Today — {format(new Date(), 'EEEE, d MMMM yyyy')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Check In', value: today?.checkIn ? format(new Date(today.checkIn), 'hh:mm a') : '—' },
            { label: 'Check Out', value: today?.checkOut ? format(new Date(today.checkOut), 'hh:mm a') : '—' },
            { label: 'Total Hours', value: today?.totalHours ? `${today.totalHours} hrs` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-background rounded-2xl p-5 border border-border/50 text-center">
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {today?.status && (
          <div className="mb-6 flex justify-center items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Current Status:</span>
            {getAttendanceStatusBadge(today.status)}
          </div>
        )}

        <div className="flex gap-4">
          <button
            id="attendance-checkin"
            onClick={() => checkInMutation.mutate()}
            disabled={!!today?.checkIn || checkInMutation.isPending}
            className="w-1/2 py-3.5 bg-plum hover:bg-primary-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            {checkInMutation.isPending ? 'Clocking in…' : 'Clock In'}
          </button>
          <button
            id="attendance-checkout"
            onClick={() => checkOutMutation.mutate()}
            disabled={!today?.checkIn || !!today?.checkOut || checkOutMutation.isPending}
            className="w-1/2 py-3.5 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl disabled:opacity-40 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            {checkOutMutation.isPending ? 'Clocking out…' : 'Clock Out'}
          </button>
        </div>
      </div>

      {/* Monthly details */}
      <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-plum-accent" />
            <span>Monthly summary for <strong className="text-plum-accent">{monthLabel}</strong></span>
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 border border-border hover:bg-background rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-border hover:bg-background rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Present', value: summary.present ?? 0, bg: 'bg-green-50/50', text: 'text-green-700 border-green-100' },
            { label: 'Late', value: summary.late ?? 0, bg: 'bg-orange-50/50', text: 'text-orange-700 border-orange-100' },
            { label: 'Half Day', value: summary.halfDay ?? 0, bg: 'bg-yellow-50/50', text: 'text-yellow-700 border-yellow-100' },
            { label: 'On Leave', value: summary.leave ?? 0, bg: 'bg-blue-50/50', text: 'text-blue-700 border-blue-100' },
            { label: 'Absent', value: summary.absent ?? 0, bg: 'bg-red-50/50', text: 'text-red-700 border-red-100' },
            { label: 'Total Hrs', value: `${summary.totalHours ?? 0}h`, bg: 'bg-primary-50/50', text: 'text-plum-accent border-primary-100' },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`${bg} border rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-extrabold ${text.split(' ')[0]}`}>{value}</p>
              <p className="text-[10px] text-text-secondary font-bold uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* History table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl animate-pulse bg-background border border-border" />)}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
            <p className="text-sm text-text-secondary font-semibold">No attendance records for {monthLabel}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-background font-bold text-text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white font-medium text-text-primary">
                  {records.map((r: any) => (
                    <tr key={r.id} className="hover:bg-primary-50/10 transition-colors">
                      <td className="px-6 py-4 font-bold">{format(new Date(r.attendanceDate), 'EEE, d MMM yyyy')}</td>
                      <td className="px-6 py-4">{r.checkIn ? format(new Date(r.checkIn), 'hh:mm a') : '—'}</td>
                      <td className="px-6 py-4">{r.checkOut ? format(new Date(r.checkOut), 'hh:mm a') : '—'}</td>
                      <td className="px-6 py-4">{r.totalHours ? `${r.totalHours} hrs` : '—'}</td>
                      <td className="px-6 py-4">{getAttendanceStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                <p className="text-text-secondary font-semibold">
                  Showing {records.length} of {pagination.total} records
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 text-text-primary font-bold">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
