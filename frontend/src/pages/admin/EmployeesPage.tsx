import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, Eye, Trash2, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-react';
import { employeesApi, departmentsApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

function EmployeeDetailModal({ employee, onClose }: { employee: any; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Employee Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background">
            <span className="text-text-secondary text-lg">×</span>
          </button>
        </div>
        <div className="flex items-center gap-4 mb-5 p-4 bg-background rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-text-secondary">{employee.designation}</p>
            <p className="text-xs text-primary mt-0.5">{employee.employeeCode}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Email', value: employee.email },
            { label: 'Phone', value: employee.phone || '—' },
            { label: 'Department', value: employee.department?.name || '—' },
            { label: 'Role', value: employee.user?.role?.name || '—' },
            { label: 'Status', value: employee.status },
            { label: 'Joining Date', value: employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-IN') : '—' },
            { label: 'Address', value: employee.address || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="col-span-1">
              <p className="text-xs text-text-secondary mb-0.5">{label}</p>
              <p className="font-medium text-text-primary">{value}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-secondary w-full mt-5">Close</button>
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
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  const employees = empData?.data || [];
  const pagination = empData?.pagination;
  const departments = (deptData as any[]) || [];

  const handleDelete = (emp: any) => {
    if (window.confirm(`Deactivate ${emp.firstName} ${emp.lastName}? This cannot be undone.`)) {
      deleteMutation.mutate(emp.id);
    }
  };

  return (
    <>
      {selectedEmployee && (
        <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
      <div className="space-y-6 animate-fade-in">
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="search"
                placeholder="Search by name, email, code…"
                className="form-input pl-10"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="form-input w-auto"
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-14">
              <Users className="w-12 h-12 mx-auto mb-3 text-border" />
              <p className="text-text-secondary">No employees found</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp: any) => (
                  <div key={emp.id} className="p-4 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary text-sm truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-text-secondary truncate">{emp.designation}</p>
                        <p className="text-xs text-primary mt-0.5">{emp.employeeCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-text-secondary truncate mr-2">{emp.department?.name}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-text-secondary hover:text-primary transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-error transition-colors"
                          title="Deactivate"
                          disabled={deleteMutation.isPending}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 text-sm">
                  <p className="text-text-secondary">{pagination.total} employees</p>
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
    </>
  );
}
