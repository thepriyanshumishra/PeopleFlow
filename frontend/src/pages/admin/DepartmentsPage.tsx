import { useQuery } from '@tanstack/react-query';
import { Building2, Users } from 'lucide-react';
import { departmentsApi } from '@/api/endpoints';

export function DepartmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['departments-detail'],
    queryFn: () => departmentsApi.getAll().then(r => r.data.data),
  });

  const departments = (data as any[]) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Departments
        </h2>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-14">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-border" />
            <p className="text-text-secondary">No departments found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept: any) => (
              <div key={dept.id} className="p-5 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{dept.name}</p>
                    {dept.description && (
                      <p className="text-xs text-text-secondary truncate">{dept.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Users className="w-3.5 h-3.5" />
                  <span>{dept._count?.employees ?? 0} employees</span>
                </div>
                {dept.headEmployee && (
                  <p className="text-xs text-text-secondary mt-1.5">
                    Head: <span className="font-medium text-text-primary">
                      {dept.headEmployee.firstName} {dept.headEmployee.lastName}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
