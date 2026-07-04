import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, addMonths, subMonths, isSameDay } from 'date-fns';
import { leaveApi, attendanceApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type DayEvent = {
  type: 'leave' | 'attendance';
  label: string;
  color: string;
};

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'Admin';

  const { data: leavesData } = useQuery({
    queryKey: ['leaves-calendar'],
    queryFn: () => {
      const fn = isAdmin ? leaveApi.adminGetAll : leaveApi.getMyLeaves;
      return fn().then(r => r.data.data || []);
    },
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['attendance-calendar'],
    queryFn: () => {
      const fn = isAdmin ? attendanceApi.adminGetAll : attendanceApi.getMyAttendance;
      return fn().then(r => r.data.data || []);
    },
  });

  const leaves: any[] = leavesData || [];
  const attendances: any[] = attendanceData || [];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // number of empty cells before first day

  const getEventsForDay = (day: Date): DayEvent[] => {
    const events: DayEvent[] = [];
    leaves.forEach(l => {
      const from = new Date(l.startDate);
      const to = new Date(l.endDate);
      if (day >= from && day <= to && l.status === 'Approved') {
        events.push({
          type: 'leave',
          label: isAdmin ? `${l.employee?.firstName} - ${l.leaveType?.name}` : (l.leaveType?.name || 'Leave'),
          color: 'bg-amber-100 text-amber-800 border border-amber-200',
        });
      }
    });
    attendances.forEach(a => {
      const aDate = a.date ? new Date(a.date) : (a.checkIn ? new Date(a.checkIn) : null);
      if (aDate && isSameDay(aDate, day)) {
        events.push({
          type: 'attendance',
          label: isAdmin ? `${a.employee?.firstName} - ${a.checkOut ? 'Complete' : 'Present'}` : (a.checkOut ? 'Present' : 'In Progress'),
          color: a.checkOut ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200',
        });
      }
    });
    return events;
  };

  // Upcoming leaves (next 30 days, approved)
  const now = new Date();
  const upcoming = leaves
    .filter(l => l.status === 'Approved' && new Date(l.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Leave & Attendance Calendar"
        subtitle="View approved leaves and attendance records in a calendar view"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Calendar' }]}
        icon={<CalendarDays className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3 card overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-text-primary">{format(currentMonth, 'MMMM yyyy')}</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-background transition-colors text-text-secondary"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS.map(d => (
                <div key={d} className="px-2 py-3 text-center text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Padding */}
              {Array.from({ length: startPad }).map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[90px] p-2 border-b border-r border-border bg-background/30" />
              ))}

              {daysInMonth.map(day => {
                const events = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDay = isToday(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[90px] p-2 border-b border-r border-border transition-colors
                      ${!isCurrentMonth ? 'bg-background/30' : ''}
                      ${isTodayDay ? 'bg-primary-50' : 'hover:bg-background/60'}`}
                  >
                    <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold mb-1
                      ${isTodayDay ? 'bg-primary text-white' : 'text-text-primary'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="space-y-0.5 overflow-hidden">
                      {events.slice(0, 2).map((ev, i) => (
                        <div key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate ${ev.color}`}>
                          {ev.label}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-text-secondary px-1 font-medium">+{events.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Legend */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-200 border border-amber-300 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">Approved Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-200 border border-green-300 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">Full Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">Checked In</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-50 border border-primary-100 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">Today</span>
                </div>
              </div>
            </div>

            {/* Upcoming Leaves */}
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-plum-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Upcoming Leaves</h3>
              </div>
              {upcoming.length === 0 ? (
                <div className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-text-secondary">No upcoming approved leaves</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {upcoming.map((l: any) => (
                    <div key={l.id} className="p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        {isAdmin && (
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {l.employee?.firstName} {l.employee?.lastName}
                          </p>
                        )}
                        <p className="text-xs text-text-secondary">{l.leaveType?.name}</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {format(new Date(l.startDate), 'MMM d')} – {format(new Date(l.endDate), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Legend</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" /><span className="text-xs text-text-secondary">Approved Leave</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" /><span className="text-xs text-text-secondary">Present</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" /><span className="text-xs text-text-secondary">Absent</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400 flex-shrink-0" /><span className="text-xs text-text-secondary">Late</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
