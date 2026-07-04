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
    <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
      {/* Header */}
      <header>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Departments <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">divisions</span>
        </h2>
        <p className="text-text-secondary text-sm">Overview of organization departments, headcount, and managers.</p>
      </header>

      {/* Grid */}
      <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
        <h2 className="text-base font-bold mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-plum-accent" />
          Division Registry
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl animate-pulse bg-background border border-border" />)}
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
            <p className="text-sm text-text-secondary font-semibold">No departments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept: any) => (
              <div key={dept.id} className="p-6 bg-background rounded-2xl border border-border hover:border-plum-accent/30 transition-all hover:scale-[1.01] flex flex-col justify-between h-44">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 border border-primary-100">
                    <Building2 className="w-5 h-5 text-plum-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text-primary text-sm truncate">{dept.name}</p>
                    {dept.description && (
                      <p className="text-xs text-text-secondary font-semibold truncate mt-0.5">{dept.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                    <Users className="w-4 h-4 text-plum-accent" />
                    <span>{dept._count?.employees ?? 0} active employees</span>
                  </div>
                  {dept.headEmployee && (
                    <p className="text-xs text-text-secondary font-medium">
                      Manager: <span className="font-bold text-text-primary">
                        {dept.headEmployee.firstName} {dept.headEmployee.lastName}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
