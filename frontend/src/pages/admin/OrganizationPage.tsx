import { useQuery } from '@tanstack/react-query';
import { Building2, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { employeesApi, departmentsApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

const PLUM_SHADES = ['bg-[#714b67]', 'bg-[#8b6b85]', 'bg-[#5a3a53]', 'bg-[#9c5d7e]', 'bg-[#6d4c72]', 'bg-[#4a3060]'];

function DeptCard({ dept, employees, onEmployeeClick }: { dept: any; employees: any[]; onEmployeeClick: (id: number) => void }) {
  const headcount = employees.filter(e => e.departmentId === dept.id).length;
  const deptEmployees = employees.filter(e => e.departmentId === dept.id);

  return (
    <div className="card overflow-hidden">
      {/* Department Header */}
      <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-background to-surface flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-plum-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm truncate">{dept.name}</h3>
          {dept.description && <p className="text-xs text-text-secondary truncate">{dept.description}</p>}
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-plum-accent bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 flex-shrink-0">
          <Users className="w-3 h-3" />{headcount}
        </span>
      </div>

      {/* Employees in dept */}
      {deptEmployees.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <p className="text-xs text-text-secondary">No employees assigned yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {deptEmployees.slice(0, 5).map((e: any, i: number) => (
            <button
              type="button"
              key={e.id}
              onClick={() => onEmployeeClick(e.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset outline-none"
            >
              <div className={`w-7 h-7 rounded-full ${PLUM_SHADES[i % PLUM_SHADES.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                {e.firstName?.[0]}{e.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{e.firstName} {e.lastName}</p>
                <p className="text-[11px] text-text-secondary truncate">{e.position || 'Employee'}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
            </button>
          ))}
          {deptEmployees.length > 5 && (
            <div className="px-5 py-2.5 text-center">
              <p className="text-xs text-text-secondary">+{deptEmployees.length - 5} more employees</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OrganizationPage() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const { data: employeesData, isLoading: loadingEmps } = useQuery({
    queryKey: ['employees-org'],
    queryFn: () => employeesApi.getAll().then(r => r.data.data || []),
  });

  const { data: deptsData, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments-org'],
    queryFn: () => departmentsApi.getAll().then(r => r.data.data || []),
  });

  if (user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-3xl border border-border shadow-sm max-w-sm">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-text-primary">Admin Access Required</h2>
          <p className="text-sm text-text-secondary mt-1">This area is restricted to administrators. Let\'s get you back to safety!</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-primary mt-4 w-full min-h-[40px] font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const employees: any[] = employeesData || [];
  const departments: any[] = deptsData || [];
  const unassigned = employees.filter(e => !e.departmentId);

  const isLoading = loadingEmps || loadingDepts;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Organization Structure"
        subtitle="View your company's department hierarchy and team members"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Organization' }]}
        icon={<Building2 className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 flex items-center gap-3">
            <div className="stat-icon bg-primary-50">
              <Building2 className="w-5 h-5 text-plum-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{departments.length}</p>
              <p className="text-xs text-text-secondary">Departments</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="stat-icon bg-green-50">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{employees.length}</p>
              <p className="text-xs text-text-secondary">Total Employees</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="stat-icon bg-amber-50">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{unassigned.length}</p>
              <p className="text-xs text-text-secondary">Unassigned</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-5 space-y-3">
                <div className="h-5 skeleton rounded w-1/2" />
                {[1, 2, 3].map(j => <div key={j} className="h-8 skeleton rounded" />)}
              </div>
            ))}
          </div>
        ) : departments.length === 0 ? (
          <EmptyState variant="employees" title="No departments found" description="Create departments to see your org structure." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {departments.map((dept: any) => (
              <DeptCard
                key={dept.id}
                dept={dept}
                employees={employees}
                onEmployeeClick={id => navigate(`/admin/employees/${id}`)}
              />
            ))}

            {/* Unassigned employees */}
            {unassigned.length > 0 && (
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">Unassigned</h3>
                    <p className="text-xs text-text-secondary">No department</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-xs font-bold text-text-secondary bg-background px-2.5 py-1 rounded-full border border-border">
                    <Users className="w-3 h-3" />{unassigned.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {unassigned.slice(0, 5).map((e: any, i: number) => (
                    <button
                      type="button"
                      key={e.id}
                      onClick={() => navigate(`/admin/employees/${e.id}`)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset outline-none"
                    >
                      <div className={`w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                        {e.firstName?.[0]}{e.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary">{e.firstName} {e.lastName}</p>
                        <p className="text-[11px] text-text-secondary">{e.position || 'Employee'}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
