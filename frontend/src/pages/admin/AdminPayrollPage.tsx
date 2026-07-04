import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CreditCard, Edit2, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { payrollApi } from '@/api/endpoints';
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-fade-in shadow-xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-plum-accent">Edit Payroll Log</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-background">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <p className="text-xs text-text-secondary mb-5">
          {payroll.employee.firstName} {payroll.employee.lastName} — {format(new Date(payroll.payPeriod), 'MMMM yyyy')}
        </p>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            {[
              { name: 'basicSalary', label: 'Basic Salary' },
              { name: 'allowances', label: 'Allowances' },
              { name: 'deductions', label: 'Deductions' },
              { name: 'tax', label: 'Tax' },
            ].map(({ name, label }) => (
              <div key={name} className="space-y-1">
                <label className="text-text-secondary block">{label}</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full py-2.5 px-3 border border-border bg-white rounded-lg outline-none text-sm focus:border-brand-purple focus:ring-2 focus:ring-primary-100 transition-all"
                  {...register(name as any)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold block">Payment Status</label>
            <select
              className="w-full py-2.5 px-3 border border-border bg-white rounded-lg outline-none text-sm"
              {...register('paymentStatus')}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="w-1/2 py-3 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="w-1/2 py-3 bg-plum text-white font-bold text-xs rounded-xl hover:bg-primary-700 transition-all shadow-sm">
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

  // Summary counts
  const totalNet = payrolls.reduce((sum: number, p: any) => sum + p.netSalary, 0);
  const paidCount = payrolls.filter((p: any) => p.paymentStatus === 'Paid').length;

  return (
    <>
      {editPayroll && <EditPayrollModal payroll={editPayroll} onClose={() => setEditPayroll(null)} />}
      <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
        {/* Header */}
        <header>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Payroll Console <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">ledgers</span>
          </h2>
          <p className="text-text-secondary text-sm">Verify corporate payouts, taxes, allowances, and check status parameters.</p>
        </header>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-plum-accent" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Total Payroll</p>
              <p className="text-xl font-extrabold">₹{totalNet.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
              <span className="text-base text-green-700">✅</span>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Paid Accounts</p>
              <p className="text-xl font-extrabold text-green-600">{paidCount}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-yellow-50 flex items-center justify-center">
              <span className="text-base text-yellow-700">⏳</span>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Pending Payouts</p>
              <p className="text-xl font-extrabold text-orange-500">{payrolls.length - paidCount}</p>
            </div>
          </div>
        </div>

        {/* Table Board */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-plum-accent" />
              Payroll Register for <strong className="text-plum-accent">{monthLabel}</strong>
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 border border-border hover:bg-background rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-2 border border-border hover:bg-background rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 skeleton rounded-xl animate-pulse bg-background border border-border" />)}
            </div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
              <p className="text-sm text-text-secondary font-semibold">No payroll records for {monthLabel}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-full divide-y divide-border text-left text-sm">
                  <thead className="bg-background font-bold text-text-secondary text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Basic</th>
                      <th className="px-6 py-4">Allowances</th>
                      <th className="px-6 py-4">Deductions</th>
                      <th className="px-6 py-4">Tax</th>
                      <th className="px-6 py-4">Net Salary</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white font-medium text-text-primary">
                    {payrolls.map((p: any) => {
                      const empInitials = `${p.employee.firstName[0]}${p.employee.lastName[0]}`;
                      return (
                        <tr key={p.id} className="hover:bg-primary-50/10 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-plum flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                {empInitials}
                              </div>
                              <div>
                                <p className="text-xs font-bold">{p.employee.firstName} {p.employee.lastName}</p>
                                <p className="text-[10px] text-text-secondary font-semibold">{p.employee.department?.name || 'No Dept'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">₹{p.basicSalary.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-green-600 font-bold">+₹{p.allowances.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-red-500 font-bold">-₹{p.deductions.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-orange-500 font-bold">-₹{p.tax.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 font-bold text-text-primary">₹{p.netSalary.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                              p.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            }`}>
                              {p.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setEditPayroll(p)}
                              className="p-2 bg-white border border-border hover:bg-primary-50 rounded-lg text-text-secondary hover:text-plum-accent transition-colors"
                              title="Edit payroll"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                  <p className="text-text-secondary font-semibold">{pagination.total} records total</p>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
