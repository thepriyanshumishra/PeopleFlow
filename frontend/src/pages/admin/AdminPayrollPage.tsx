import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CreditCard, Edit2, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { payrollApi, employeesApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

function EditPayrollModal({ payroll, onClose }: { payroll: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      basicSalary: payroll.basicSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
      tax: payroll.tax,
      paymentStatus: payroll.paymentStatus,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => payrollApi.adminUpdate(payroll.id, {
      ...data,
      basicSalary: parseFloat(data.basicSalary),
      allowances: parseFloat(data.allowances),
      deductions: parseFloat(data.deductions),
      tax: parseFloat(data.tax),
    }),
    onSuccess: () => {
      toast.success('Payroll updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-payroll'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Edit Payroll</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          {payroll.employee.firstName} {payroll.employee.lastName} — {format(new Date(payroll.payPeriod), 'MMMM yyyy')}
        </p>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'basicSalary', label: 'Basic Salary' },
              { name: 'allowances', label: 'Allowances' },
              { name: 'deductions', label: 'Deductions' },
              { name: 'tax', label: 'Tax' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="form-label">{label}</label>
                <input type="number" step="0.01" className="form-input" {...register(name as any)} />
              </div>
            ))}
          </div>
          <div>
            <label className="form-label">Payment Status</label>
            <select className="form-input" {...register('paymentStatus')}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-border">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminPayrollPage() {
  const [page, setPage] = useState(1);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [editPayroll, setEditPayroll] = useState<any>(null);

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['admin-payroll', month, year, page],
    queryFn: () => payrollApi.adminGetAll({ month, year, page, limit: 12 }).then(r => r.data),
  });

  const payrolls = payrollData?.data || [];
  const pagination = payrollData?.pagination;

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1);
    setPage(1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1);
    setPage(1);
  };

  const monthLabel = new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Summary
  const totalNet = payrolls.reduce((sum: number, p: any) => sum + p.netSalary, 0);
  const paidCount = payrolls.filter((p: any) => p.paymentStatus === 'Paid').length;

  return (
    <>
      {editPayroll && <EditPayrollModal payroll={editPayroll} onClose={() => setEditPayroll(null)} />}
      <div className="space-y-6 animate-fade-in">
        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Payroll</p>
              <p className="text-xl font-bold text-text-primary">₹{totalNet.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Paid</p>
              <p className="text-xl font-bold text-success">{paidCount}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Pending</p>
              <p className="text-xl font-bold text-warning">{payrolls.length - paidCount}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payroll — {monthLabel}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
                <ChevronLeft className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-background border border-border">
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => <div key={i} className="h-14 skeleton rounded-lg" />)}
            </div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-14">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-border" />
              <p className="text-text-secondary">No payroll records for {monthLabel}</p>
            </div>
          ) : (
            <>
              <div className="table-container rounded-xl border border-border">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Basic</th>
                      <th>Allowances</th>
                      <th>Deductions</th>
                      <th>Tax</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((p: any) => (
                      <tr key={p.id}>
                        <td>
                          <div>
                            <p className="text-sm font-medium">{p.employee.firstName} {p.employee.lastName}</p>
                            <p className="text-xs text-text-secondary">{p.employee.department?.name}</p>
                          </div>
                        </td>
                        <td className="text-sm">₹{p.basicSalary.toLocaleString('en-IN')}</td>
                        <td className="text-sm text-green-600">+₹{p.allowances.toLocaleString('en-IN')}</td>
                        <td className="text-sm text-red-500">-₹{p.deductions.toLocaleString('en-IN')}</td>
                        <td className="text-sm text-orange-500">-₹{p.tax.toLocaleString('en-IN')}</td>
                        <td className="text-sm font-bold text-text-primary">₹{p.netSalary.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            p.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setEditPayroll(p)}
                            className="p-1.5 rounded-lg hover:bg-primary-50 text-text-secondary hover:text-primary transition-colors"
                            title="Edit payroll"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <p className="text-text-secondary">{pagination.total} records</p>
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
