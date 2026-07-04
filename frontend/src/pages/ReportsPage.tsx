import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Clock, CalendarDays, DollarSign, AlertTriangle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { attendanceApi, leaveApi, payrollApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNavigate } from 'react-router-dom';

type ReportType = 'attendance' | 'leave' | 'payroll';

function downloadCSV(rows: string[][], filename: string) {
  const content = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

interface ReportCardProps {
  type: ReportType;
  icon: React.FC<any>;
  title: string;
  description: string;
  color: string;
}

function ReportCard({ type, icon: Icon, title, description, color }: ReportCardProps) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchData = async () => {
    setIsGenerating(true);
    setGenerated(false);
    try {
      let data: any[] = [];
      if (type === 'attendance') {
        const r = await attendanceApi.adminGetAll({ month, year });
        data = r.data.data || [];
      } else if (type === 'leave') {
        const r = await leaveApi.adminGetAll({ month, year });
        data = r.data.data || [];
      } else {
        const r = await payrollApi.adminGetAll({ month, year });
        data = r.data.data || [];
      }
      setTableData(data);
      setGenerated(true);
      toast.success('Done! Everything was updated successfully.');
    } catch {
      toast.error('Failed to generate report. Let\'s try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (tableData.length === 0) { toast.error('No data to export yet!'); return; }
    let rows: string[][] = [];
    if (type === 'attendance') {
      rows = [['Employee', 'Employee Code', 'Date', 'Check In', 'Check Out', 'Duration']];
      tableData.forEach((a: any) => {
        const dateStr = a.date || (a.checkIn ? format(new Date(a.checkIn), 'yyyy-MM-dd') : '');
        const checkIn = a.checkIn ? format(new Date(a.checkIn), 'HH:mm') : '';
        const checkOut = a.checkOut ? format(new Date(a.checkOut), 'HH:mm') : '';
        rows.push([`${a.employee?.firstName ?? ''} ${a.employee?.lastName ?? ''}`, a.employee?.employeeCode ?? '', dateStr, checkIn, checkOut, a.duration ?? '']);
      });
    } else if (type === 'leave') {
      rows = [['Employee', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Reason']];
      tableData.forEach((l: any) => {
        rows.push([`${l.employee?.firstName ?? ''} ${l.employee?.lastName ?? ''}`, l.leaveType?.name ?? '', format(new Date(l.startDate), 'yyyy-MM-dd'), format(new Date(l.endDate), 'yyyy-MM-dd'), l.status ?? '', l.reason ?? '']);
      });
    } else {
      rows = [['Employee', 'Month', 'Year', 'Basic Salary', 'Deductions', 'Net Salary', 'Status']];
      tableData.forEach((p: any) => {
        rows.push([`${p.employee?.firstName ?? ''} ${p.employee?.lastName ?? ''}`, String(p.month), String(p.year), String(p.basicSalary ?? ''), String(p.deductions ?? ''), String(p.netSalary ?? ''), p.status ?? '']);
      });
    }
    downloadCSV(rows, `${type}-report-${MONTHS[month - 1]}-${year}.csv`);
    toast.success('CSV downloaded successfully!');
  };

  return (
    <div className="card overflow-hidden">
      <div className={`px-5 py-4 flex items-center gap-3 ${color} border-b border-border`}>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-white">{title}</h3>
          <p className="text-xs text-white/70">{description}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            <select
              aria-label="Select Month"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="bg-transparent text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
            <select
              aria-label="Select Year"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="bg-transparent text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={fetchData}
            disabled={isGenerating}
            className="btn-primary btn-sm min-h-[38px] px-4 font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {generated && (
          <>
            {tableData.length === 0 ? (
              <EmptyState variant="search" title="No records yet" description="No data matched the selected period." compact />
            ) : (
              <>
                <div className="table-container rounded-xl border border-border mb-3 max-h-56 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        {type === 'attendance' && <><th>Date</th><th>Check In</th><th>Check Out</th></>}
                        {type === 'leave' && <><th>Type</th><th>From</th><th>To</th><th>Status</th></>}
                        {type === 'payroll' && <><th>Month</th><th>Basic</th><th>Net Pay</th><th>Status</th></>}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.slice(0, 10).map((row: any, i: number) => (
                        <tr key={i} className="border-b border-border last:border-0 text-xs">
                          <td>{row.employee?.firstName} {row.employee?.lastName}</td>
                          {type === 'attendance' && (
                            <>
                              <td>{row.date || (row.checkIn ? format(new Date(row.checkIn), 'MMM d') : '—')}</td>
                              <td>{row.checkIn ? format(new Date(row.checkIn), 'HH:mm') : '—'}</td>
                              <td>{row.checkOut ? format(new Date(row.checkOut), 'HH:mm') : '—'}</td>
                            </>
                          )}
                          {type === 'leave' && (
                            <>
                              <td>{row.leaveType?.name}</td>
                              <td>{format(new Date(row.startDate), 'MMM d')}</td>
                              <td>{format(new Date(row.endDate), 'MMM d')}</td>
                              <td><span className={row.status === 'Approved' ? 'badge-green' : row.status === 'Rejected' ? 'badge-red' : 'badge-yellow'}>{row.status}</span></td>
                            </>
                          )}
                          {type === 'payroll' && (
                            <>
                              <td>{row.month}/{row.year}</td>
                              <td>₹{Number(row.basicSalary || 0).toLocaleString()}</td>
                              <td className="font-semibold text-green-700">₹{Number(row.netSalary || 0).toLocaleString()}</td>
                              <td><span className={row.status === 'Paid' ? 'badge-green' : 'badge-yellow'}>{row.status}</span></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tableData.length > 10 && (
                  <p className="text-xs text-text-secondary mb-3">Showing 10 of {tableData.length} records. Download CSV for full data.</p>
                )}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-secondary flex items-center gap-2 min-h-[40px] px-4 font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV ({tableData.length} rows)
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ReportsPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-text-primary">Admin Access Required</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Reports"
        subtitle="Generate and download HR reports for any time period"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Reports' }]}
        icon={<FileText className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ReportCard
            type="attendance"
            icon={Clock}
            title="Attendance Report"
            description="Daily check-in / check-out records"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <ReportCard
            type="leave"
            icon={CalendarDays}
            title="Leave Summary Report"
            description="All leave requests with status"
            color="bg-gradient-to-r from-amber-500 to-orange-500"
          />
          <ReportCard
            type="payroll"
            icon={DollarSign}
            title="Payroll Report"
            description="Salary and pay slip breakdown"
            color="bg-gradient-to-r from-[#714b67] to-[#5a3a53]"
          />
        </div>

        <div className="mt-8 p-5 rounded-2xl border border-border bg-surface">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-plum-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-text-primary">About Reports</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Select a month and year, click Generate to preview up to 10 rows, then Download CSV for the full dataset.
                Reports pull live data from your PeopleFlow backend for accurate, up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
