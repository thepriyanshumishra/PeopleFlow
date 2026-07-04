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
    <div className="space-y-6 animate-fade-in">
      {/* Check-in / Check-out card */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Today — {format(new Date(), 'EEEE, d MMMM yyyy')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Check In', value: today?.checkIn ? format(new Date(today.checkIn), 'hh:mm a') : '—' },
            { label: 'Check Out', value: today?.checkOut ? format(new Date(today.checkOut), 'hh:mm a') : '—' },
            { label: 'Total Hours', value: today?.totalHours ? `${today.totalHours}h` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-background rounded-xl p-4 text-center">
              <p className="text-xs text-text-secondary mb-1">{label}</p>
              <p className="text-xl font-bold text-text-primary">{value}</p>
            </div>
          ))}
        </div>
        {today?.status && (
          <div className="mb-4 text-center">
            <span className="text-sm text-text-secondary mr-2">Status:</span>
            {getAttendanceStatusBadge(today.status)}
          </div>
        )}
        <div className="flex gap-3">
          <button
            id="attendance-checkin"
            onClick={() => checkInMutation.mutate()}
            disabled={!!today?.checkIn || checkInMutation.isPending}
            className="btn-primary flex-1 py-3 disabled:opacity-40"
          >
            <LogIn className="w-4 h-4" />
            {checkInMutation.isPending ? 'Checking in…' : 'Check In'}
          </button>
          <button
            id="attendance-checkout"
            onClick={() => checkOutMutation.mutate()}
            disabled={!today?.checkIn || !!today?.checkOut || checkOutMutation.isPending}
            className="btn-secondary flex-1 py-3 disabled:opacity-40"
          >
            <LogOut className="w-4 h-4" />
            {checkOutMutation.isPending ? 'Checking out…' : 'Check Out'}
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {monthLabel}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Present', value: summary.present ?? 0, bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'Late', value: summary.late ?? 0, bg: 'bg-orange-50', text: 'text-orange-700' },
            { label: 'Half Day', value: summary.halfDay ?? 0, bg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'On Leave', value: summary.leave ?? 0, bg: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Absent', value: summary.absent ?? 0, bg: 'bg-red-50', text: 'text-red-700' },
            { label: 'Total Hrs', value: `${summary.totalHours ?? 0}h`, bg: 'bg-primary-50', text: 'text-primary' },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* History Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No attendance records for {monthLabel}</p>
          </div>
        ) : (
          <>
            <div className="table-container rounded-xl border border-border">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r: any) => (
                    <tr key={r.id}>
                      <td className="font-medium">{format(new Date(r.attendanceDate), 'EEE, d MMM')}</td>
                      <td>{r.checkIn ? format(new Date(r.checkIn), 'hh:mm a') : '—'}</td>
                      <td>{r.checkOut ? format(new Date(r.checkOut), 'hh:mm a') : '—'}</td>
                      <td>{r.totalHours ? `${r.totalHours}h` : '—'}</td>
                      <td>{getAttendanceStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <p className="text-text-secondary">
                  Showing {records.length} of {pagination.total} records
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-ghost btn-sm border border-border disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 text-text-primary font-medium">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="btn-ghost btn-sm border border-border disabled:opacity-40"
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
