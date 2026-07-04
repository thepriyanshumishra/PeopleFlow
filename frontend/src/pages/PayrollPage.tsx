import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { payrollApi } from '@/api/endpoints';

function PayslipCard({ payroll }: { payroll: any }) {
  const isPaid = payroll.paymentStatus === 'Paid';
  return (
    <div className={`p-6 bg-background rounded-2xl border ${isPaid ? 'border-green-200' : 'border-yellow-200'} hover:scale-[1.01] transition-transform`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-bold text-text-primary">
            {format(new Date(payroll.payPeriod), 'MMMM yyyy')}
          </p>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border mt-1 inline-block ${
            isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
          }`}>
            {payroll.paymentStatus}
          </span>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Net Salary</p>
          <p className="text-2xl font-extrabold text-text-primary">
            ₹{payroll.netSalary.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white rounded-xl p-3 border border-border/50">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Basic Salary</p>
          <p className="text-sm font-bold text-text-primary">₹{payroll.basicSalary.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-border/50">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Allowances</p>
          <p className="text-sm font-bold text-green-600">+₹{payroll.allowances.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-border/50">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Deductions</p>
          <p className="text-sm font-bold text-red-500">-₹{payroll.deductions.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-border/50">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Estimated Tax</p>
          <p className="text-sm font-bold text-orange-500">-₹{payroll.tax.toLocaleString('en-IN')}</p>
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
    <div className="p-6 md:p-8 space-y-12 max-w-[1440px] mx-auto animate-fade-in text-text-primary">
      {/* Header */}
      <header>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Financials & Payroll <span className="handwritten-text text-3xl ml-1 text-plum-accent italic font-normal">earnings</span>
        </h2>
        <p className="text-text-secondary text-sm">View payslips, monthly basic salary rates, and tax deductions.</p>
      </header>

      {/* Latest Payslip Summary Block */}
      {latest && (
        <div className="bg-plum rounded-[2rem] p-8 shadow-md relative overflow-hidden text-white flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10 mb-6">
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Latest Payslip Summary</p>
              <h2 className="text-4xl font-extrabold mt-2 tracking-tight">
                ₹{latest.netSalary.toLocaleString('en-IN')}
              </h2>
              <p className="text-white/80 text-xs mt-1.5 font-bold">
                Period: {format(new Date(latest.payPeriod), 'MMMM yyyy')}
              </p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
              latest.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-200 border-green-400/30' : 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
            }`}>
              {latest.paymentStatus}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 font-bold">
            {[
              { label: 'Basic Salary', value: `₹${latest.basicSalary.toLocaleString('en-IN')}` },
              { label: 'Allowances', value: `₹${latest.allowances.toLocaleString('en-IN')}` },
              { label: 'Deductions', value: `₹${latest.deductions.toLocaleString('en-IN')}` },
              { label: 'Tax Deducted', value: `₹${latest.tax.toLocaleString('en-IN')}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase tracking-wider">{label}</p>
                <p className="text-white text-base mt-1 tracking-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll History Log */}
      <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-plum-accent" />
            Payroll Registry
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setYear(y => y - 1)} className="p-2 border border-border hover:bg-background rounded-lg">
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <span className="text-xs font-bold text-text-primary min-w-[48px] text-center">{year}</span>
            <button
              onClick={() => setYear(y => y + 1)}
              className="p-2 border border-border hover:bg-background rounded-lg disabled:opacity-40"
              disabled={year >= new Date().getFullYear()}
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl animate-pulse bg-background border border-border" />)}
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
            <p className="text-sm text-text-secondary font-semibold">No payroll records for {year}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              {payrolls.map((p: any) => <PayslipCard key={p.id} payroll={p} />)}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                <p className="text-text-secondary font-semibold">{pagination.total} total payslips</p>
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
  );
}
