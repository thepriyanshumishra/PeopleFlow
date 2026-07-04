import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, Eye, Trash2, ChevronLeft, ChevronRight, UserCheck, UserX, X, Loader2, AlertTriangle } from 'lucide-react';
import { employeesApi, departmentsApi } from '@/api/endpoints';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function EmployeeDetailModal({ employee, onClose }: { employee: any; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full animate-fade-in shadow-xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Employee Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <div className="flex items-center gap-4 mb-6 p-4 bg-background rounded-2xl border border-border/40">
          <div className="w-14 h-14 rounded-2xl bg-plum flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{employee.firstName} {employee.lastName}</h3>
            <p className="text-xs text-text-secondary font-semibold mt-0.5">{employee.designation}</p>
            <p className="text-xs text-plum-accent font-bold mt-1 uppercase tracking-wider">{employee.employeeCode}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          {[
            { label: 'Email Address', value: employee.email },
            { label: 'Phone Number', value: employee.phone || '—' },
            { label: 'Department', value: employee.department?.name || '—' },
            { label: 'User Role', value: employee.user?.role || employee.user?.role?.name || 'Employee' },
            { label: 'Employment Status', value: employee.status },
            { label: 'Joining Date', value: employee.joiningDate ? format(new Date(employee.joiningDate), 'dd MMM yyyy') : '—' },
            { label: 'Residential Address', value: employee.address || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-background rounded-xl p-3 border border-border/50">
              <p className="text-[10px] text-text-secondary uppercase mb-1">{label}</p>
              <p className="text-sm font-bold text-text-primary truncate">{value}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 bg-plum text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition-colors shadow-sm mt-6">
          Close Window
        </button>
      </div>
    </div>
  );
}

function DeactivateConfirmModal({
  employee,
  onClose,
  onConfirm,
  loading,
}: {
  employee: any;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full animate-fade-in shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 border border-red-100">
          <AlertTriangle className="w-6 h-6 text-error" />
        </div>
        <h2 className="text-lg font-bold mb-2">Deactivate Employee?</h2>
        <p className="text-sm text-text-secondary mb-1">
          You are about to deactivate{' '}
          <strong className="text-text-primary">
            {employee.firstName} {employee.lastName}
          </strong>.
        </p>
        <p className="text-xs text-text-secondary mb-6">
          This will remove their access to the system. This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-1/2 py-3 bg-error text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deactivating…
              </>
            ) : (
              'Deactivate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmployeesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [deactivateEmployee, setDeactivateEmployee] = useState<any>(null);

  const { data: empData, isLoading } = useQuery({
    queryKey: ['admin-employees', search, deptFilter, page],
    queryFn: () => employeesApi.getAll({ search: search || undefined, departmentId: deptFilter || undefined, page, limit: 12 }).then(r => r.data),
  });

  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getAll().then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: () => {
      toast.success('Employee deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] });
      setDeactivateEmployee(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  const employees = empData?.data || [];
  const pagination = empData?.pagination;
  const departments = (deptData as any[]) || [];

  const handleDelete = (emp: any) => {
    setDeactivateEmployee(emp);
  };

  return (
    <>
      {selectedEmployee && (
        <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
      {deactivateEmployee && (
        <DeactivateConfirmModal
          employee={deactivateEmployee}
          onClose={() => setDeactivateEmployee(null)}
          onConfirm={() => deleteMutation.mutate(deactivateEmployee.id)}
          loading={deleteMutation.isPending}
        />
      )}
      <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
        {/* Header */}
        <header>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Employee Directory <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">members</span>
          </h2>
          <p className="text-text-secondary text-sm">Search and manage registered employee accounts.</p>
        </header>

        {/* Directory Controls */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="search"
                placeholder="Search by name, email, employee code…"
                className="w-full pl-12 pr-4 py-3 border border-border bg-white rounded-lg outline-none text-sm focus:border-brand-purple focus:ring-2 focus:ring-primary-100 transition-all"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="py-3 px-4 border border-border bg-white rounded-lg text-sm outline-none w-full sm:w-auto"
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Departments</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl animate-pulse bg-background border border-border" />)}
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
              <Users className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
              <p className="text-sm text-text-secondary font-semibold">No employees found</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp: any) => {
                  const empInitials = `${emp.firstName[0]}${emp.lastName[0]}`;
                  return (
                    <div key={emp.id} className="p-6 bg-background rounded-2xl border border-border hover:border-plum-accent/30 transition-all hover:scale-[1.01] flex flex-col justify-between h-44">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-plum flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-sm">
                          {empInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-text-primary text-sm truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-text-secondary font-semibold mt-0.5 truncate">{emp.designation}</p>
                          <p className="text-[10px] text-plum-accent font-bold mt-1 uppercase tracking-wider">{emp.employeeCode}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                        <span className="text-xs font-semibold text-text-secondary truncate max-w-[120px]">{emp.department?.name || 'No Dept'}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-2 bg-white border border-border hover:bg-primary-50 rounded-lg text-text-secondary hover:text-plum-accent transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-2 bg-white border border-border hover:bg-red-50 rounded-lg text-text-secondary hover:text-error transition-colors"
                            title="Deactivate"
                            disabled={deleteMutation.isPending}
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                  <p className="text-text-secondary font-semibold">{pagination.total} employees registered</p>
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
