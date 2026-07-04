import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { payrollApi } from '@/api/endpoints';

function PayslipCard({ payroll }: { payroll: any }) {
  const isPaid = payroll.paymentStatus === 'Paid';
  return (
    <div className={`p-4 bg-background rounded-xl border ${isPaid ? 'border-green-200' : 'border-yellow-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {format(new Date(payroll.payPeriod), 'MMMM yyyy')}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {payroll.paymentStatus}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">Net Salary</p>
          <p className="text-xl font-bold text-text-primary">
            ₹{payroll.netSalary.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-surface rounded-lg p-2">
          <p className="text-text-secondary">Basic</p>
          <p className="font-semibold text-text-primary">₹{payroll.basicSalary.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <p className="text-text-secondary">Allowances</p>
          <p className="font-semibold text-green-600">+₹{payroll.allowances.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <p className="text-text-secondary">Deductions</p>
          <p className="font-semibold text-red-500">-₹{payroll.deductions.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-surface rounded-lg p-2">
          <p className="text-text-secondary">Tax</p>
          <p className="font-semibold text-orange-500">-₹{payroll.tax.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}

export function PayrollPage() {
  const [page, setPage] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: latestData } = useQuery({
    queryKey: ['payroll-latest'],
    queryFn: () => payrollApi.getLatest().then(r => r.data.data),
  });

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['my-payroll', year, page],
    queryFn: () => payrollApi.getMyPayroll({ year, page, limit: 12 }).then(r => r.data),
  });

  const payrolls = payrollData?.data || [];
  const pagination = payrollData?.pagination;
  const latest = latestData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Latest Payslip Summary */}
      {latest && (
        <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-200 text-sm">Latest Payslip</p>
              <h2 className="text-2xl font-bold mt-1">
                ₹{latest.netSalary.toLocaleString('en-IN')}
              </h2>
              <p className="text-primary-200 text-sm mt-1">
                {format(new Date(latest.payPeriod), 'MMMM yyyy')}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              latest.paymentStatus === 'Paid' ? 'bg-green-400/20 text-green-200' : 'bg-yellow-400/20 text-yellow-200'
            }`}>
              {latest.paymentStatus}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Basic', value: `₹${latest.basicSalary.toLocaleString('en-IN')}` },
              { label: 'Allowances', value: `₹${latest.allowances.toLocaleString('en-IN')}` },
              { label: 'Deductions', value: `₹${latest.deductions.toLocaleString('en-IN')}` },
              { label: 'Tax', value: `₹${latest.tax.toLocaleString('en-IN')}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <p className="text-primary-200 text-xs">{label}</p>
                <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll History */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Payroll History
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded-lg hover:bg-background border border-border">
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <span className="text-sm font-semibold text-text-primary min-w-[48px] text-center">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded-lg hover:bg-background border border-border" disabled={year >= new Date().getFullYear()}>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-14">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-border" />
            <p className="text-text-secondary">No payroll records for {year}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payrolls.map((p: any) => <PayslipCard key={p.id} payroll={p} />)}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 text-sm">
                <p className="text-text-secondary">{pagination.total} payslips</p>
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
          </div>
        )}
      </div>
    </div>
  );
}
