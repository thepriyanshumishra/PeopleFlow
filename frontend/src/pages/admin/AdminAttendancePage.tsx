import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Clock, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { attendanceApi } from '@/api/endpoints';
import { getAttendanceStatusBadge } from '@/components/ui/Badge';

export function AdminAttendancePage() {
  const [page, setPage] = useState(1);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [statusFilter, setStatusFilter] = useState('');

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['admin-attendance', month, year, statusFilter, page],
    queryFn: () => attendanceApi.adminGetAll({ month, year, status: statusFilter || undefined, page, limit: 15 }).then(r => r.data),
  });

  const records = attendanceData?.data || [];
  const pagination = attendanceData?.pagination;

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
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Attendance — {monthLabel}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
                <ChevronLeft className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <select
              className="form-input w-auto text-sm py-2"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">On Leave</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-14">
            <Clock className="w-12 h-12 mx-auto mb-3 text-border" />
            <p className="text-text-secondary">No attendance records for {monthLabel}</p>
          </div>
        ) : (
          <>
            <div className="table-container rounded-xl border border-border">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
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
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {r.employee.firstName[0]}{r.employee.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{r.employee.firstName} {r.employee.lastName}</p>
                            <p className="text-[10px] text-text-secondary">{r.employee.department?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium text-sm">{format(new Date(r.attendanceDate), 'EEE, d MMM')}</td>
                      <td className="text-sm">{r.checkIn ? format(new Date(r.checkIn), 'hh:mm a') : '—'}</td>
                      <td className="text-sm">{r.checkOut ? format(new Date(r.checkOut), 'hh:mm a') : '—'}</td>
                      <td className="text-sm">{r.totalHours ? `${r.totalHours}h` : '—'}</td>
                      <td>{getAttendanceStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <p className="text-text-secondary">{pagination.total} records</p>
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
  );
}
