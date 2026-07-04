import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Globe, ChevronDown, Check, HelpCircle, Sparkles } from 'lucide-react';

export function PricingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // FAQ Accordion states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is PeopleFlow really free to use?",
      a: "Yes! The core software sandbox is completely open-source. During the Odoo Hackathon evaluation period, all features including AI insights and attendance registries are fully functional without any subscription fees."
    },
    {
      q: "Can I connect my own Google Gemini API key?",
      a: "Absolutely. In your local `.env` configuration file, you can specify your own Google AI Studio API key (`GEMINI_API_KEY`) to run the AI Leave Assistant module directly on your Gemini quota."
    },
    {
      q: "Does it support local offline execution?",
      a: "Yes. By default, the codebase has been adapted to run on a zero-config SQLite engine (`dev.db`). You do not need PostgreSQL or Docker running to boot up the project locally."
    },
    {
      q: "How do I log in to evaluate the demo data?",
      a: "Once the seeding script is run, you can log in immediately. Admin account credentials: `admin@peopleflow.com` / `Admin@1234`. Employee credentials: `priyanshu@peopleflow.com` / `Employee@1234`."
    }
  ];

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
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/features">Features</Link>
            <Link className="text-primary-600 font-semibold text-xs rounded" to="/pricing">Pricing</Link>
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
            Transparent pricing for <span className="text-highlight">growing teams.</span>
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
            Choose the plan that fits your organization scale. Evaluators can start for free with no contract lockups.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Card 1: Free Developer Sandbox */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col text-left justify-between h-full hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Developer Tier</span>
                <span className="bg-primary-50 text-primary-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <h3 className="font-display text-xl font-bold mt-2">Hackathon Sandbox</h3>
              <p className="text-xs text-text-secondary mt-1">Perfect for evaluating local setups and codebase features.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold">₹0</span>
                <span className="text-xs text-text-secondary ml-1">forever</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>SQLite local database connection</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>AI Leave analysis (with your own Gemini key)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>6 seeded employee profile accounts</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Fully-featured Admin & Employee portals</span>
                </div>
              </div>
            </div>
            <Link
              to="/login"
              className="bg-primary-600 text-white w-full text-center py-2.5 rounded-lg text-xs font-bold mt-8 hover:bg-primary-700 transition-colors block"
            >
              Sign In to Demo
            </Link>
          </div>

          {/* Card 2: Enterprise Tier */}
          <div className="bg-white p-8 rounded-2xl border-2 border-primary-600 shadow-md flex flex-col text-left justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary-600 text-white text-[9px] font-bold py-1 px-4 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Recommended
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Enterprise</span>
              </div>
              <h3 className="font-display text-xl font-bold mt-2">Enterprise Scale</h3>
              <p className="text-xs text-text-secondary mt-1">Tailored for companies looking for complete cloud management.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold">Custom</span>
                <span className="text-xs text-text-secondary ml-1">tailored scale</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Managed PostgreSQL relational databases</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Dedicated Gemini API clusters & limits</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>Unlimited employees and departments</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>99.9% uptime SLA & dedicated HR support</span>
                </div>
              </div>
            </div>
            <Link
              to="/contact"
              className="bg-text-primary text-white w-full text-center py-2.5 rounded-lg text-xs font-bold mt-8 hover:bg-black transition-colors block"
            >
              Contact Sales
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full max-w-2xl mx-auto mb-16 text-left">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <h2 className="font-display text-2xl font-bold text-text-primary text-center">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200">
                <button
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold text-xs text-text-primary hover:bg-background/40"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${openFaq === idx ? 'rotate-185' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
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
