import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Clock, Sparkles, CreditCard, Users, Building2, Globe, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

export function FeaturesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary antialiased">
      <style>{`
        .plum-accent { color: #714B67; }
        .text-highlight {
          position: relative;
          z-index: 1;
        }
        .text-highlight::after {
          content: '';
          position: absolute;
          left: -4px;
          right: -4px;
          bottom: 2px;
          height: 35%;
          background-color: #FBBF24;
          z-index: -1;
          opacity: 0.5;
          border-radius: 4px;
          transform: rotate(-1deg);
        }
      `}</style>

      {/* Top Navigation */}
      <nav aria-label="Global Navigation" className="sticky top-0 z-50 bg-white border-b border-border shadow-sm w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center px-6 md:px-12 h-16 w-full max-w-[1440px] mx-auto">
          {/* Logo (Left) */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-1 font-display text-xl font-extrabold tracking-tight">
              <span className="text-primary-600">People</span>
              <span className="text-gray-400">Flow</span>
            </Link>
          </div>

          {/* Links (Center) */}
          <div className="hidden md:flex justify-center items-center gap-8">
            <Link className="text-primary-600 font-semibold text-xs rounded" to="/features">Features</Link>
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/pricing">Pricing</Link>
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/about">About Us</Link>
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/contact">Contact</Link>
          </div>

          {/* Auth Actions (Right) */}
          <div className="flex justify-end items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold text-xs hover:bg-primary-700 transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Try it free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        {/* Page Hero */}
        <section className="text-center max-w-3xl mx-auto mb-16 pt-6">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text-primary mb-4 leading-tight">
            Integrated modules built for <span className="text-highlight">modern HR.</span>
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
            Say goodbye to fragmented files, messy spreadsheets, and disconnected platforms. PeopleFlow brings all your company processes under a single codebase.
          </p>
        </section>

        {/* Features Blocks */}
        <div className="w-full max-w-5xl mx-auto space-y-24 mb-16">
          {/* Feature 1: AI Assistant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini AI</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary">AI-Powered Leave Assistant</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our database connects to the Google Gemini model to read and analyze employee leave request justifications. It auto-categorizes leaves, extracts prioritizations (High/Medium/Low), and writes a brief one-sentence summary, letting administrators approve or reject requests in batches.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Category matching (Sick Leave, Paid Leave, Unpaid Leave)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Context-aware urgency markers to flag emergency notifications</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Automated summary output logged directly in database tables</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md text-left">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Leave Request Analysis Output</span>
              <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl mt-3 space-y-2 text-[11px] text-text-secondary">
                <div><span className="font-bold text-text-primary">Leave Category:</span> Sick Leave</div>
                <div><span className="font-bold text-text-primary">Priority Level:</span> High</div>
                <div><span className="font-bold text-text-primary">AI Recommendation:</span> Approve. Medical rest required for recovery.</div>
                <div className="pt-2 border-t border-blue-100 mt-2 font-medium text-text-primary">
                  "Employee requested 3 days sick leave due to viral fever."
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Shifts & Attendance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md text-left order-2 md:order-1">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Attendance Register</span>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                  <span className="font-semibold text-text-primary">Clock-in Time</span>
                  <span className="text-text-secondary">09:05 AM (Late by 5m)</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                  <span className="font-semibold text-text-primary">Clock-out Time</span>
                  <span className="text-text-secondary">06:12 PM</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text-primary">Shift State</span>
                  <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-[10px]">Full Day Present</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 text-left order-1 md:order-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-green-600 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Shift Registry</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary">Attendance & Shift Registry</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Log clock-ins, clock-outs, and active hours in real time. The attendance calculator computes total hours worked and flags late logins based on custom shift targets, and compiles individual logs into admin registers automatically.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>One-click digital punch-in card on the user dashboard</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Automatic late arrival status flags and clock counters</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Interactive historical shift log sheets for employees</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Automated Payroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Relational Calculator</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary">Automated Monthly Payroll</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our payroll engine maps raw salary scales to final net calculations. It dynamically computes basic salary amounts, adds company allowances, deducts income tax brackets, and outputs a formatted payslip record monthly.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Flexible allowances, bonuses, and standard deductions config</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Dynamic tax calculations based on employee income scales</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-text-primary">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Readable payslip files queryable by employees</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md text-left">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Payroll Slip Calculation</span>
              <div className="space-y-2 mt-3 text-xs text-text-primary font-mono border-t border-border pt-3">
                <div className="flex justify-between"><span>Basic Salary:</span> <span>₹75,000.00</span></div>
                <div className="flex justify-between text-green-600"><span>Allowances:</span> <span>+₹13,000.00</span></div>
                <div className="flex justify-between text-red-500"><span>Deductions:</span> <span>-₹4,000.00</span></div>
                <div className="flex justify-between text-red-500 border-b border-border pb-2 mb-2"><span>Taxes:</span> <span>-₹7,500.00</span></div>
                <div className="flex justify-between font-bold text-sm"><span>Net Salary:</span> <span>₹76,500.00</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1b26] text-white/70 py-16 w-full mt-auto text-left">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Logo Brand row */}
          <div className="flex justify-center md:justify-start mb-10">
            <span className="font-display text-3xl font-extrabold tracking-tight">
              <span className="text-primary-400">People</span>
              <span className="text-gray-400">Flow</span>
            </span>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/10 pb-12 mb-8 text-xs w-full text-white/70">
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px] text-primary-400">Product</h4>
              <ul className="space-y-2.5 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/features">Core Features</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/pricing">Pricing Plans</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/login">Employee Login</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/login">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px] text-primary-400">Self-Service</h4>
              <ul className="space-y-2.5 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/dashboard">Dashboard</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/attendance">Clock-In/Out</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/leave">Leave Request</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/payroll">My Payslips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px] text-primary-400">Administration</h4>
              <ul className="space-y-2.5 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/admin/employees">Personnel Directory</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/admin/leave">Leave Approvals</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/admin/attendance">Shift Operations</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/admin/payroll">Payroll Generation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px] text-primary-400">Company</h4>
              <ul className="space-y-2.5 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/about">Our Story</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/contact">Contact Us</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/help">Help Center</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/calendar">Calendar Workspace</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <button className="flex items-center gap-2 mb-4 text-white hover:opacity-80 transition-opacity">
                <Globe className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-bold">English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] opacity-75 leading-relaxed mt-2">
                PeopleFlow is an intelligent, integrated HRMS platform that handles attendance, leaves, payroll, and directory operations in a single, modern interface powered by Gemini AI.
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-60 text-white/50 gap-2">
            <span>© 2026 PeopleFlow. All rights reserved.</span>
            <div className="flex gap-4">
              <Link className="hover:text-white transition-colors" to="/settings">System Settings</Link>
              <Link className="hover:text-white transition-colors" to="/profile">User Profile</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
