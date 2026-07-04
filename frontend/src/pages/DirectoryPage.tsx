import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, LayoutGrid, List, Filter, Users, Building2, Mail, Phone, ChevronRight } from 'lucide-react';
import { employeesApi, departmentsApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';

function getInitials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

const PLUM_SHADES = [
  'bg-[#714b67]', 'bg-[#8b6b85]', 'bg-[#5a3a53]',
  'bg-[#9c5d7e]', 'bg-[#6d4c72]', 'bg-[#4a3060]',
];

function colorFor(id: number) {
  return PLUM_SHADES[id % PLUM_SHADES.length];
}

function EmployeeCard({ emp, isAdmin, onClick }: { emp: any; isAdmin: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="card p-5 flex flex-col items-center text-center gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className={`w-16 h-16 rounded-full ${colorFor(emp.id)} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
        {emp.profilePicture ? (
          <img src={emp.profilePicture} alt={emp.firstName} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(emp.firstName, emp.lastName)
        )}
      </div>
      <div className="w-full min-w-0">
        <p className="font-semibold text-text-primary text-sm leading-tight group-hover:text-plum-accent transition-colors">
          {emp.firstName} {emp.lastName}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{emp.position || 'Employee'}</p>
        <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-plum-accent border border-primary-100">
          {emp.department?.name || 'No Department'}
        </span>
      </div>
      {isAdmin && (
        <div className="w-full pt-3 border-t border-border">
          <p className="text-[11px] text-text-secondary truncate flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />{emp.user?.email || '—'}
          </p>
        </div>
      )}
      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
      </span>
    </div>
  );
}

function EmployeeRow({ emp, isAdmin, onClick }: { emp: any; isAdmin: boolean; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-border hover:bg-background/60 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${colorFor(emp.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {emp.profilePicture
              ? <img src={emp.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
              : getInitials(emp.firstName, emp.lastName)}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{emp.firstName} {emp.lastName}</p>
            <p className="text-[11px] text-text-secondary">{emp.employeeCode}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary">{emp.department?.name || '—'}</td>
      <td className="px-4 py-3 text-sm text-text-secondary">{emp.position || '—'}</td>
      {isAdmin && <td className="px-4 py-3 text-sm text-text-secondary">{emp.user?.email || '—'}</td>}
      <td className="px-4 py-3">
        <span className="badge-green">Active</span>
      </td>
      <td className="px-4 py-3 text-right">
        <ChevronRight className="w-4 h-4 text-border ml-auto" />
      </td>
    </tr>
  );
}

export function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'Admin';
  const navigate = useNavigate();

  const { data: employeesData, isLoading: loadingEmps } = useQuery({
    queryKey: ['employees', 'directory'],
    queryFn: () => employeesApi.getAll().then(r => r.data.data || []),
  });

  const { data: deptsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getAll().then(r => r.data.data || []),
  });

  const employees: any[] = employeesData || [];
  const departments: any[] = deptsData || [];

  const filtered = employees.filter(e => {
    const name = `${e.firstName} ${e.lastName}`.toLowerCase();
    const dept = e.department?.name?.toLowerCase() ?? '';
    const q = search.toLowerCase();
    const matchSearch = !search || name.includes(q) || dept.includes(q) || e.position?.toLowerCase().includes(q);
    const matchDept = deptFilter === 'all' || String(e.departmentId) === deptFilter;
    return matchSearch && matchDept;
  });

  const handleEmployeeClick = (emp: any) => {
    if (isAdmin) navigate(`/admin/employees/${emp.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Company Directory"
        subtitle="Browse and connect with your team members"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Directory' }]}
        icon={<Globe className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 flex items-center gap-3">
            <div className="stat-icon bg-primary-50">
              <Users className="w-5 h-5 text-plum-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{employees.length}</p>
              <p className="text-xs text-text-secondary">Total Employees</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="stat-icon bg-green-50">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{departments.length}</p>
              <p className="text-xs text-text-secondary">Departments</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="stat-icon bg-blue-50">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{filtered.length}</p>
              <p className="text-xs text-text-secondary">Showing</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5 flex-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, department, or position…"
              className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none flex-1 focus-visible:ring-1 focus-visible:ring-primary/20 rounded px-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5">
              <Filter className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <select
                aria-label="Filter by Department"
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="bg-transparent text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
              >
                <option value="all">All Departments</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={String(d.id)}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center rounded-xl border border-border overflow-hidden bg-surface">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-background'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-background'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loadingEmps ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card p-5 flex flex-col items-center gap-3 animate-pulse">
                <div className="w-16 h-16 skeleton rounded-full" />
                <div className="w-full space-y-2">
                  <div className="h-3.5 skeleton rounded w-3/4 mx-auto" />
                  <div className="h-3 skeleton rounded w-1/2 mx-auto" />
                  <div className="h-5 skeleton rounded-full w-2/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState variant="search" title="No employees yet" description="No team members match your selected search." />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(emp => (
              <EmployeeCard key={emp.id} emp={emp} isAdmin={isAdmin} onClick={() => handleEmployeeClick(emp)} />
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Position</th>
                    {isAdmin && <th>Email</th>}
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <EmployeeRow key={emp.id} emp={emp} isAdmin={isAdmin} onClick={() => handleEmployeeClick(emp)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
