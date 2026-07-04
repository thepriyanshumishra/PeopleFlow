import { Link } from 'react-router-dom';
import { ArrowUp, Play, Sparkles, Clock, CalendarDays, CreditCard, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary antialiased">
      {/* Top Header */}
      <nav aria-label="Global Navigation" className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-plum flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">PF</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-plum-accent">PeopleFlow</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <a href="#features" className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-sm">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-sm">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-plum text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-plum-accent transition-colors text-sm font-semibold px-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-plum text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Try it free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16 pt-10 pb-12 relative w-full">
          <header>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight break-words">
              Unleash{' '}
              <span className="handwritten-text text-6xl md:text-7xl plum-accent font-normal italic pr-2">your</span>
              workforce potential
            </h1>
          </header>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
            PeopleFlow is an all-in-one HRMS built for modern, scaling enterprises. Clock in shifts, automate payroll ledgers, and manage leave balances with built-in AI routing.
          </p>
          <div className="flex flex-col items-center gap-4 mt-6">
            <Link
              to="/login"
              className="bg-plum text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Start now - It's free
            </Link>
            <div className="flex flex-col items-center text-text-secondary text-xs mt-2 gap-1">
              <ArrowUp className="w-4 h-4 text-plum-accent animate-bounce" />
              <span>No credit card required · Instant demo access</span>
            </div>
          </div>
        </section>

        {/* Abstract Illustration Deck */}
        <section className="w-full max-w-4xl mx-auto relative mb-20 bg-white rounded-2xl border border-border p-6 shadow-card flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="text-xs font-bold text-plum-accent uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full">Flagship Redesign</span>
            <h2 className="text-2xl font-bold text-text-primary mt-3 leading-snug">
              Workplace Management,{' '}
              <span className="handwritten-text text-3xl font-normal plum-accent">reinvented</span>
            </h2>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              Designed to look like a polished, commercial SaaS product. Clean fonts, soft container rounded corners, and a focus on clarity reduce cognitive fatigue for administrators.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-plum" />
                No glassmorphism or messy gradients
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-plum" />
                Soft, high-contrast grays and white workspaces
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 bg-background rounded-xl p-4 border border-border flex items-center justify-center">
            {/* Visual Hammock / Palm Tree line art */}
            <div className="text-center py-6">
              <span className="text-4xl">🌴🧘🌴</span>
              <p className="handwritten-text text-xl plum-accent mt-2">relax, HR is automated</p>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="w-full max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary">Features Built for Success</h2>
            <p className="text-text-secondary text-sm mt-2">Real-time actions powered by a fully normalized transactional database.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Clock */}
            <div className="bg-white p-6 rounded-xl border border-border hover:shadow-card hover:-translate-y-1 transition-all flex flex-col h-full">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">Attendance Portal</h3>
              <p className="text-text-secondary text-sm flex-grow">
                Real-time check-in and check-out tracking. Handles late entries, half-day computations, and admin overrides cleanly.
              </p>
            </div>

            {/* AI Leave Assistant */}
            <div className="bg-white p-6 rounded-xl border border-border hover:shadow-card hover:-translate-y-1 transition-all flex flex-col h-full">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-plum-accent" />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">AI Leave Assistant</h3>
              <p className="text-text-secondary text-sm flex-grow">
                Integrates with Gemini API to summarize employee leave requests, suggest categorization, and flag urgent priorities.
              </p>
            </div>

            {/* Payroll Compensation */}
            <div className="bg-white p-6 rounded-xl border border-border hover:shadow-card hover:-translate-y-1 transition-all flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">Automated Payroll</h3>
              <p className="text-text-secondary text-sm flex-grow">
                Automatic monthly salary slips. Calculated from basic pay, custom allowances, deductions, and tax withholdings.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Segment */}
        <section id="pricing" className="w-full max-w-4xl mx-auto mb-16 text-center">
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card">
            <h2 className="text-2xl font-bold text-text-primary">Flat Rate Pricing</h2>
            <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
              Simple, transparent billing suited for startups and established enterprises.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1">
              <span className="text-text-secondary text-xl font-medium">₹</span>
              <span className="text-text-primary text-5xl font-black">0</span>
              <span className="text-text-secondary text-sm">/ user / month</span>
            </div>
            <p className="text-plum-accent text-xs font-semibold mt-2">Free during the Odoo Hackathon period!</p>
            <Link
              to="/login"
              className="btn-primary inline-flex mt-6 px-8 py-3 rounded-lg text-sm font-semibold"
            >
              Start Free Trial <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1B26] text-white py-12 border-t border-border mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-white mb-3">Community</h4>
            <ul className="space-y-1.5 text-text-secondary text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Services</h4>
            <ul className="space-y-1.5 text-text-secondary text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Hosting</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Devs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">About us</h4>
            <ul className="space-y-1.5 text-text-secondary text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Our Company</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand Assets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white mb-3 flex items-center gap-1">
              <span className="w-5 h-5 rounded bg-plum flex items-center justify-center text-[10px] font-bold text-white">PF</span>
              PeopleFlow
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              An integrated platform designed to combine easy operations with robust database transactions.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 mt-8 text-center text-xs text-text-secondary">
          © 2026 PeopleFlow · Odoo × Adamas University Hackathon. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
