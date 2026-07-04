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
  const [search, setSearch] = useState('');

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['admin-attendance', month, year, statusFilter, page],
    queryFn: () => attendanceApi.adminGetAll({ month, year, status: statusFilter || undefined, page, limit: 15 }).then(r => r.data),
  });

  const records = attendanceData?.data || [];
  const pagination = attendanceData?.pagination;

  const filteredRecords = search
    ? records.filter((r: any) =>
        `${r.employee.firstName} ${r.employee.lastName}`.toLowerCase().includes(search.toLowerCase())
      )
    : records;

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
          Attendance Registry <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">audits</span>
        </h2>
        <p className="text-text-secondary text-sm">Review employee time-card logs and monthly check-ins.</p>
      </header>

      {/* Board */}
      <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-plum-accent" />
            Timecards for <strong className="text-plum-accent">{monthLabel}</strong>
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous Month"
                className="p-2 border border-border hover:bg-background rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next Month"
                className="p-2 border border-border hover:bg-background rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <select
              aria-label="Filter by Attendance Status"
              className="py-2 px-4 border border-border bg-white rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">On Leave</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search employee…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 border border-border bg-white rounded-lg text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:border-primary w-44"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl animate-pulse bg-background border border-border" />)}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
            <Clock className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
            <p className="text-sm text-text-secondary font-semibold">
              No records yet{search ? ` matching "${search}"` : ` for ${monthLabel}`}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-background font-bold text-text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white font-medium text-text-primary">
                  {filteredRecords.map((r: any) => {
                    const empInitials = `${r.employee.firstName[0]}${r.employee.lastName[0]}`;
                    return (
                      <tr key={r.id} className="hover:bg-primary-50/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-plum flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {empInitials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{r.employee.firstName} {r.employee.lastName}</p>
                              <p className="text-[10px] text-text-secondary font-semibold">{r.employee.department?.name || 'No Dept'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold">{format(new Date(r.attendanceDate), 'EEE, d MMM yyyy')}</td>
                        <td className="px-6 py-4">{r.checkIn ? format(new Date(r.checkIn), 'hh:mm a') : '—'}</td>
                        <td className="px-6 py-4">{r.checkOut ? format(new Date(r.checkOut), 'hh:mm a') : '—'}</td>
                        <td className="px-6 py-4">{r.totalHours ? `${r.totalHours} hrs` : '—'}</td>
                        <td className="px-6 py-4">{getAttendanceStatusBadge(r.status)}</td>
                      </tr>
                    );
                  })}
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
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 text-text-primary font-bold">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
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
