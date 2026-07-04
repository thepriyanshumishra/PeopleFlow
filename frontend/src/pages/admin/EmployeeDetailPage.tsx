import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Mail, Building2, Calendar, Clock, DollarSign, CalendarDays, Briefcase, Hash, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { employeesApi, attendanceApi, leaveApi, payrollApi } from '@/api/endpoints';
import { PageHeader } from '@/components/shared/PageHeader';

function InfoRow({ icon: Icon, label, value }: { icon: React.FC<any>; label: string; value: string | number | undefined }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-plum-accent" />
      </div>
      <div>
        <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-text-primary font-semibold mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}

const PLUM_SHADES = ['bg-[#714b67]', 'bg-[#8b6b85]', 'bg-[#5a3a53]', 'bg-[#9c5d7e]'];

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const empId = Number(id);

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employee', empId],
    queryFn: () => employeesApi.getById(empId).then(r => r.data.data),
    enabled: !!empId,
  });

  const { data: leaveData } = useQuery({
    queryKey: ['admin-leave', empId],
    queryFn: () => leaveApi.adminGetAll({ employeeId: empId, limit: 5 }).then(r => r.data.data || []),
    enabled: !!empId,
  });

  const { data: payrollData } = useQuery({
    queryKey: ['admin-payroll', empId],
    queryFn: () => payrollApi.adminGetAll({ employeeId: empId, limit: 3 }).then(r => r.data.data || []),
    enabled: !!empId,
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['admin-attendance', empId],
    queryFn: () => attendanceApi.adminGetAll({ employeeId: empId, limit: 5 }).then(r => r.data.data || []),
    enabled: !!empId,
  });

  const emp = empData;
  const leaves: any[] = leaveData || [];
  const payrolls: any[] = payrollData || [];
  const attendances: any[] = attendanceData || [];

  const initials = emp ? `${emp.firstName?.[0] ?? ''}${emp.lastName?.[0] ?? ''}`.toUpperCase() : '';
  const colorClass = PLUM_SHADES[empId % PLUM_SHADES.length];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-5 border-b border-border bg-surface flex items-center gap-3">
          <div className="w-24 h-6 skeleton rounded" />
          <div className="w-48 h-6 skeleton rounded" />
        </div>
        <div className="page-wrapper animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-6 space-y-4">
              <div className="w-20 h-20 skeleton rounded-full mx-auto" />
              <div className="h-5 skeleton rounded w-3/4 mx-auto" />
              <div className="h-4 skeleton rounded w-1/2 mx-auto" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="card p-6 h-32 skeleton" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-border mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-primary">Employee not found</h2>
          <button onClick={() => navigate('/admin/employees')} className="btn-secondary mt-4">
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={`${emp.firstName} ${emp.lastName}`}
        subtitle={emp.position || 'Employee'}
        breadcrumbs={[
          { label: 'Home', to: '/dashboard' },
          { label: 'Employees', to: '/admin/employees' },
          { label: `${emp.firstName} ${emp.lastName}` }
        ]}
        icon={<User className="w-5 h-5 text-plum-accent" />}
        actions={
          <button onClick={() => navigate('/admin/employees')} className="btn-ghost flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        }
      />

      <div className="page-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full ${colorClass} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                {emp.profilePicture
                  ? <img src={emp.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                  : initials}
              </div>
              <h2 className="text-lg font-bold text-text-primary">{emp.firstName} {emp.lastName}</h2>
              <p className="text-sm text-text-secondary mt-0.5">{emp.position || 'Employee'}</p>
              <span className="mt-2 badge-green">Active</span>
              {emp.user?.role === 'Admin' && (
                <div className="mt-2 flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-full">
                  <Shield className="w-3 h-3 text-plum-accent" />
                  <span className="text-[10px] font-bold text-plum-accent">Administrator</span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Quick Info</h3>
              <InfoRow icon={Hash} label="Employee Code" value={emp.employeeCode} />
              <InfoRow icon={Mail} label="Email" value={emp.user?.email} />
              <InfoRow icon={Building2} label="Department" value={emp.department?.name} />
              <InfoRow icon={Briefcase} label="Position" value={emp.position} />
              <InfoRow icon={Calendar} label="Date of Birth" value={emp.dateOfBirth ? format(new Date(emp.dateOfBirth), 'MMM d, yyyy') : undefined} />
              <InfoRow icon={Calendar} label="Join Date" value={emp.joiningDate ? format(new Date(emp.joiningDate), 'MMM d, yyyy') : undefined} />
              {emp.phone && <InfoRow icon={Hash} label="Phone" value={emp.phone} />}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Attendance Recent */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Clock className="w-4 h-4 text-plum-accent" />
                <h3 className="font-semibold text-sm text-text-primary">Recent Attendance</h3>
              </div>
              {attendances.length === 0 ? (
                <p className="text-center text-text-secondary text-sm py-8">No attendance records found</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.map((a: any) => (
                        <tr key={a.id} className="border-b border-border last:border-0">
                          <td>{format(new Date(a.date || a.checkIn), 'MMM d, yyyy')}</td>
                          <td>{a.checkIn ? format(new Date(a.checkIn), 'HH:mm') : '—'}</td>
                          <td>{a.checkOut ? format(new Date(a.checkOut), 'HH:mm') : '—'}</td>
                          <td>
                            <span className={a.checkOut ? 'badge-green' : 'badge-yellow'}>
                              {a.checkOut ? 'Complete' : 'In Progress'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Leave History */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-plum-accent" />
                <h3 className="font-semibold text-sm text-text-primary">Leave History</h3>
              </div>
              {leaves.length === 0 ? (
                <p className="text-center text-text-secondary text-sm py-8">No leave records found</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l: any) => (
                        <tr key={l.id} className="border-b border-border last:border-0">
                          <td>{l.leaveType?.name ?? '—'}</td>
                          <td>{format(new Date(l.startDate), 'MMM d, yyyy')}</td>
                          <td>{format(new Date(l.endDate), 'MMM d, yyyy')}</td>
                          <td>
                            <span className={
                              l.status === 'Approved' ? 'badge-green' :
                              l.status === 'Rejected' ? 'badge-red' : 'badge-yellow'
                            }>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Payroll Summary */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-plum-accent" />
                <h3 className="font-semibold text-sm text-text-primary">Recent Payroll</h3>
              </div>
              {payrolls.length === 0 ? (
                <p className="text-center text-text-secondary text-sm py-8">No payroll records found</p>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Net Pay</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.map((p: any) => (
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td>{p.month}/{p.year}</td>
                          <td>₹{Number(p.basicSalary || 0).toLocaleString()}</td>
                          <td className="font-semibold text-green-700">₹{Number(p.netSalary || 0).toLocaleString()}</td>
                          <td>
                            <span className={p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}>{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
