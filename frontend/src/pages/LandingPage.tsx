import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowUp, Globe, ChevronDown, Clock, Sparkles, CreditCard, 
  Users, Building2, Award, ShieldAlert, ArrowRight, Sun, HelpCircle, Search
} from 'lucide-react';

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary antialiased selection:bg-primary-50 selection:text-plum-accent">
      <style>{`
        .handwritten-text {
          font-family: 'Caveat', cursive;
        }
        .plum-accent {
          color: #714B67;
        }
        .bg-plum {
          background-color: #714B67;
        }
        .text-plum-inverse {
          color: #ffffff;
        }
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
        .hand-drawn-underline {
          position: relative;
          display: inline-block;
        }
        .hand-drawn-underline::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 8px;
          background: url("data:image/svg+xml,%3Csvg width='100' height='10' viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 5 Q 25 2, 50 5 T 98 5' fill='none' stroke='%233B82F6' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseSubtle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.95;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-pulse-subtle {
          animation: pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/features">Features</Link>
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

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16 relative w-full pt-10 pb-16">
          <div className="absolute inset-0 w-full h-full -z-10 opacity-30 rounded-3xl" />
          <header>
            <h1 className="font-display text-4xl md:text-[60px] md:leading-[68px] font-extrabold text-text-primary mb-6 relative inline-block animate-fade-in-up break-words">
              All your HR operations on <span className="text-highlight">one platform.</span><br />
              <span className="block mt-2">
                Simple, efficient, yet <span className="hand-drawn-underline">delightful!</span>
              </span>
            </h1>
          </header>
          
          <div className="flex justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/login"
              className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors shadow-md"
            >
              Start now - It's free
            </Link>
            <a
              href="#features"
              className="bg-primary-50 text-primary-600 border border-primary-100 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-100 transition-colors shadow-sm"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-col items-center text-text-secondary text-xs mt-6 font-semibold">
            <ArrowUp className="w-4 h-4 text-primary-600 mb-1 animate-bounce" />
            <span>No credit card required · Instant demo access</span>
          </div>
        </section>

        {/* Dashboard Preview Showcase */}
        <section className="w-full max-w-5xl mx-auto mb-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-2xl border border-border shadow-2xl overflow-hidden">
            {/* Mock Browser Header */}
            <div className="bg-[#f0f2f5] px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
              </div>
              <div className="bg-white rounded-md text-[10px] text-text-secondary px-3 py-1 flex items-center gap-1.5 max-w-xs mx-auto border border-border/80 w-64 justify-center">
                <Globe className="w-2.5 h-2.5 text-text-secondary/60" />
                <span>localhost:5174/dashboard</span>
              </div>
            </div>

            {/* Mock Dashboard Workspace */}
            <div className="p-6 bg-background grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {/* Sidebar Mock */}
              <div className="hidden md:flex flex-col gap-3 col-span-1 bg-white p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-text-primary">Sarah Johnson</div>
                    <div className="text-[8px] text-text-secondary">HR Manager</div>
                  </div>
                </div>
                <div className="h-6 bg-primary-50 rounded text-[9px] font-bold text-primary-600 flex items-center px-2.5">Dashboard</div>
                <div className="h-6 rounded text-[9px] text-text-secondary flex items-center px-2.5 hover:bg-background transition-colors">Attendance</div>
                <div className="h-6 rounded text-[9px] text-text-secondary flex items-center px-2.5 hover:bg-background transition-colors">Leave Requests</div>
                <div className="h-6 rounded text-[9px] text-text-secondary flex items-center px-2.5 hover:bg-background transition-colors">Payroll</div>
                <div className="h-6 rounded text-[9px] text-text-secondary flex items-center px-2.5 hover:bg-background transition-colors">Employee Directory</div>
              </div>

              {/* Main Dashboard Canvas Mock */}
              <div className="col-span-3 flex flex-col gap-6">
                {/* Greetings Banner */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-5 rounded-xl text-white flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-display text-base font-bold">Good afternoon, Sarah!</h3>
                    <p className="text-[10px] opacity-80 mt-0.5">Welcome back to your workspace. Here is today's HR status report.</p>
                  </div>
                  <div className="bg-white/10 px-3 py-1.5 rounded-lg text-center backdrop-blur-sm">
                    <div className="text-[8px] uppercase tracking-wider opacity-85">Active Shift</div>
                    <div className="text-xs font-bold mt-0.5">04 hrs : 18 mins</div>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                    <span className="text-[10px] text-text-secondary font-semibold">Total Employees</span>
                    <div className="text-xl font-extrabold text-text-primary mt-1">6</div>
                    <span className="text-[8px] text-green-500 font-semibold mt-1 inline-block">● 100% active</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                    <span className="text-[10px] text-text-secondary font-semibold">Leaves Pending</span>
                    <div className="text-xl font-extrabold text-text-primary mt-1">2</div>
                    <span className="text-[8px] text-amber-500 font-semibold mt-1 inline-block">⚡ Requires review</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                    <span className="text-[10px] text-text-secondary font-semibold">Active Clock-ins</span>
                    <div className="text-xl font-extrabold text-text-primary mt-1">5 / 6</div>
                    <span className="text-[8px] text-primary-500 font-semibold mt-1 inline-block">1 employee late</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section id="ai-assistant" className="w-full max-w-5xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Mock AI Interface */}
          <div className="bg-white p-6 rounded-2xl border border-border shadow-xl relative order-2 md:order-1">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-text-primary">Gemini Leave Assistant</span>
              </div>
              <span className="bg-red-50 text-red-600 text-[8px] font-bold px-2 py-0.5 rounded-full">High Priority</span>
            </div>

            <div className="space-y-4">
              {/* Employee Reason */}
              <div className="bg-background p-3.5 rounded-xl text-left border border-border">
                <span className="text-[8px] uppercase tracking-wider text-text-secondary font-bold">Submitted Leave Reason:</span>
                <p className="text-[11px] text-text-primary mt-1 font-medium leading-relaxed">
                  "I have a viral fever and need three days of rest to recover. I will submit medical certificates when back."
                </p>
              </div>

              {/* AI Extraction Analysis */}
              <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl text-left space-y-3">
                <div className="flex items-center gap-1.5 text-primary-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">AI Automated Insight Summary</span>
                </div>
                
                <div className="space-y-2 text-[10px] text-text-secondary leading-relaxed">
                  <div>
                    <span className="font-bold text-text-primary">Category Match:</span> Sick Leave
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">Extracted Priority:</span> High (Medical recovery required)
                  </div>
                  <div>
                    <span className="font-bold text-text-primary">Executive Summary:</span>
                    <p className="mt-0.5 text-text-primary">Employee requests sick leave due to viral fever requiring 3 days of rest. Medical documentation recommended.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Copy */}
          <div className="text-left space-y-6 order-1 md:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini AI Integration</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              Say goodbye to <span className="text-highlight">leave management bottlenecks.</span>
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every leave request is instantly analyzed using state-of-the-art AI. Our built-in Gemini parser auto-categorizes reasons, extracts urgency markers, and generates concise summaries so you can review and approve leaves in seconds.
            </p>
            <div className="flex flex-col gap-3 text-xs font-semibold text-text-primary">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                <span>Automatic categorization into Sick, Paid, or Unpaid leaves</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                <span>Smart priority tagging (High/Medium/Low) based on context urgency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                <span>One-sentence executive summaries to speed up HR approvals</span>
              </div>
            </div>
          </div>
        </section>

        {/* Shifts & Attendance Section */}
        <section id="shifts" className="w-full max-w-5xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Copy */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-green-600 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Attendance Engine</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              Register hours and <span className="text-highlight">track productivity</span> effortlessly.
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              PeopleFlow features an intuitive shift tracker. Employees can register clock-ins, clock-outs, and breaks with a single click. The backend automatically calculates late states, total hours worked, and determines if a shift counts as a full day or half day.
            </p>
            <div className="flex flex-col gap-3 text-xs font-semibold text-text-primary">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Automatic late-arrival detection based on shift configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Audit trail logging each shift's exact duration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Seeded dummy directory to evaluate user performance instantly</span>
              </div>
            </div>
          </div>

          {/* Right Side: Mock Shift Log Card */}
          <div className="bg-white p-6 rounded-2xl border border-border shadow-xl text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-primary">Daily Shift Registry</span>
              <span className="text-[8px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full">Present</span>
            </div>
            
            {/* Mock Shift Log Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] border-b border-border/60 pb-2">
                <div>
                  <div className="font-bold text-text-primary">Check-in</div>
                  <div className="text-[8px] text-text-secondary">09:12 AM</div>
                </div>
                <span className="text-green-500 font-bold text-[8px]">On Time</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-b border-border/60 pb-2">
                <div>
                  <div className="font-bold text-text-primary">Check-out</div>
                  <div className="text-[8px] text-text-secondary">06:08 PM</div>
                </div>
                <span className="text-text-secondary text-[8px]">Regular Departure</span>
              </div>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <div>
                  <div className="font-bold text-text-primary">Total Work Hours</div>
                  <div className="text-[8px] text-text-secondary">08.93 Hours</div>
                </div>
                <span className="bg-primary-50 text-primary-600 font-bold text-[8px] px-2 py-0.5 rounded-md">8 hrs shift target met</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (Standard Odoo App Directory Style) */}
        <section id="features" className="w-full bg-primary text-white py-12 px-6 rounded-t-3xl text-center">
          <header>
            <h2 className="handwritten-text text-[48px] font-normal">Core Modules</h2>
            <p className="text-xs font-semibold opacity-85 uppercase tracking-widest mt-1">Everything you need, completely integrated</p>
          </header>
        </section>
        
        <section className="w-full bg-background-50 py-16 px-6 rounded-b-3xl mb-16 border-x border-b border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-blue-500">
                <Clock className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">Attendance</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                Real-time check-in/out shifts registry. Handles late hours, half-day states, and audit trails.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-emerald-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">AI Leave Assistant</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                Automatic leave summaries and prioritization powered by the Gemini AI decision board.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-amber-500">
                <CreditCard className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">Automated Payroll</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                Monthly slip calculations covering basic salary scales, allowances, tax brackets, and deductions.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-rose-500">
                <Users className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">Directory</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                A unified listing of active personnel profiles, role filters, and designation parameters.
              </p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-indigo-500">
                <Building2 className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">Departments</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                Structure organizational divisions, map team count parameters, and designate heads of department.
              </p>
            </div>
            {/* Card 6 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left">
              <div className="mb-4 text-yellow-600">
                <Award className="w-8 h-8" />
              </div>
              <header>
                <h3 className="handwritten-text text-[28px] font-normal mb-1 text-text-primary">Certifications</h3>
              </header>
              <p className="text-xs text-text-secondary leading-relaxed flex-grow">
                Learning portals, onboarding guides, and certifications to verify employee qualifications.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Segment */}
        <section id="pricing" className="w-full max-w-4xl mx-auto mb-16 text-center">
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary">Flat Rate Pricing</h2>
            <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
              Simple, transparent billing suited for startups and established enterprises.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1">
              <span className="text-text-secondary text-xl font-medium">₹</span>
              <span className="text-text-primary text-5xl font-black">0</span>
              <span className="text-text-secondary text-sm">/ user / month</span>
            </div>
            <p className="text-primary-600 text-xs font-semibold mt-2">Free during the Odoo Hackathon period!</p>
            <Link
              to="/login"
              className="bg-primary-600 text-white inline-flex mt-6 px-8 py-3.5 rounded-xl text-xs font-bold shadow-sm hover:bg-primary-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1b26] text-white/70 py-16 w-full mt-auto text-left">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-center md:justify-start mb-8">
            <span className="font-display text-3xl font-extrabold tracking-tight">
              <span className="text-primary-400">People</span>
              <span className="text-gray-400">Flow</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 pb-12 mb-8 text-xs w-full">
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/features">Features</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">About us</h4>
              <ul className="space-y-2 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/about">Our company</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/contact">Contact us</Link></li>
              </ul>
            </div>
            <div>
              <button className="flex items-center gap-2 mb-4 text-white hover:opacity-80 transition-opacity">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="text-xs opacity-80 leading-relaxed mt-4 border-t border-white/10 pt-4">
                PeopleFlow is an intelligent, integrated HRMS platform that handles attendance, leaves, payroll, and directory operations in a single, modern interface powered by Gemini AI.
                <br /><br />
                PeopleFlow's unique value proposition is to provide enterprise-grade HR management that is incredibly easy to use, beautiful to look at, and smart by design.
              </div>
            </div>
          </div>
          <div className="text-center md:text-left text-xs opacity-60 text-white/50">
            © 2026 PeopleFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
