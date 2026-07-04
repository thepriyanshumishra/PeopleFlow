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
        <div className="flex justify-between items-center px-6 md:px-12 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-plum flex items-center justify-center text-white font-black text-sm">
                PF
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-plum-accent">PeopleFlow</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <a className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-xs rounded" href="#features">Features</a>
              <a className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-xs rounded" href="#documentation">Documentation</a>
              <a className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-xs rounded" href="#pricing">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-plum text-white px-5 py-2 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-plum-accent transition-colors font-semibold text-xs rounded"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-plum text-white px-4 py-2 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
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
              className="bg-plum text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              Start now - It's free
            </Link>
            <a
              href="#features"
              className="bg-primary-50 text-plum-accent border border-primary-100 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-100 transition-colors shadow-sm"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-col items-center text-text-secondary text-xs mt-6 font-semibold">
            <ArrowUp className="w-4 h-4 text-plum-accent mb-1 animate-bounce" />
            <span>No credit card required · Instant demo access</span>
          </div>
        </section>

        {/* Brand Apps Connect Section (Odoo Inspired Illustration Grid) */}
        <section className="w-full max-w-5xl mx-auto relative mb-24 py-12 transition-all duration-700">
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-md border border-border">
              <header>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary mb-2 break-words">
                  Join <span className="handwritten-text text-[40px] font-normal plum-accent">thousands</span> of users
                  <span className="absolute top-4 right-4 text-orange-400 handwritten-text text-[24px] rotate-12 flex items-center">
                    <svg className="mr-1" fill="none" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M5 15c2.5-3 7-5 12-2M15 8l4 5-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    happy
                  </span>
                </h2>
              </header>
              <p className="text-text-secondary text-xs font-semibold">who run their operations smoothly with PeopleFlow</p>
            </div>
          </div>

          {/* Odoo Style Connected Grid */}
          <div className="grid grid-cols-6 md:grid-cols-8 gap-4 opacity-25 w-full pointer-events-none">
            <div className="aspect-square bg-primary-50 rounded-tl-full flex items-center justify-center text-plum-accent">
              <Clock className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-plum rounded-tr-full opacity-60 flex items-center justify-center text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="col-span-2"></div>
            <div className="aspect-square bg-primary-50 rounded-bl-full flex items-center justify-center text-plum-accent">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-plum rounded-br-full opacity-60 flex items-center justify-center text-white">
              <Users className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-primary-50 rounded-full flex items-center justify-center text-plum-accent">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-primary-50 rounded-tl-full flex items-center justify-center text-plum-accent">
              <Award className="w-8 h-8" />
            </div>
            
            <div className="col-span-1"></div>
            <div className="aspect-square bg-primary-50 rounded-full flex items-center justify-center text-plum-accent">
              <Sun className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-primary-50 rounded-tr-full flex items-center justify-center text-plum-accent">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="col-span-2"></div>
            <div className="aspect-square bg-plum rounded-bl-full opacity-60 flex items-center justify-center text-white">
              <Search className="w-8 h-8" />
            </div>
            <div className="aspect-square bg-primary-50 rounded-full flex items-center justify-center text-plum-accent">
              <Clock className="w-8 h-8" />
            </div>
            <div className="col-span-1"></div>
          </div>
        </section>

        {/* Documentation/Features Section Style */}
        <section id="features" className="w-full bg-[#714B67] text-white py-12 px-6 rounded-t-3xl mt-12 text-center">
          <header>
            <h2 className="handwritten-text text-[48px] font-normal">PeopleFlow HRMS Features</h2>
            <p className="text-xs font-semibold opacity-85 uppercase tracking-widest mt-1">Optimized for productivity</p>
          </header>
        </section>
        
        <section id="documentation" className="w-full bg-background-50 py-16 px-6 rounded-b-3xl mb-16 border-x border-b border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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
            <p className="text-plum-accent text-xs font-semibold mt-2">Free during the Odoo Hackathon period!</p>
            <Link
              to="/login"
              className="bg-plum text-white inline-flex mt-6 px-8 py-3.5 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1b26] text-surface-container-high py-16 w-full mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-center mb-8">
            <span className="font-display text-3xl font-extrabold text-white tracking-tight">PeopleFlow</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 pb-12 mb-8 text-xs w-full text-white/70">
            <div>
              <h4 className="font-bold text-white mb-4">Community</h4>
              <ul className="space-y-2 flex flex-col">
                <li><a className="hover:text-white transition-colors" href="#">Tutorials</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Forum</a></li>
              </ul>
              <h4 className="font-bold text-white mt-6 mb-4">Open Source</h4>
              <ul className="space-y-2 flex flex-col">
                <li><a className="hover:text-white transition-colors" href="#">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 flex flex-col">
                <li><a className="hover:text-white transition-colors" href="#">Hosting</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Support</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Upgrade</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Custom Developments</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Education</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">About us</h4>
              <ul className="space-y-2 flex flex-col">
                <li><a className="hover:text-white transition-colors" href="#">Our company</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Brand Assets</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Contact us</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Jobs</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Events</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Podcast</a></li>
              </ul>
            </div>
            <div>
              <button className="flex items-center gap-2 mb-4 text-white hover:opacity-80 transition-opacity">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="text-xs opacity-80 leading-relaxed mt-4 border-t border-white/10 pt-4">
                PeopleFlow is a suite of open source business apps that cover all your company needs: CRM, eCommerce, accounting, inventory, point of sale, project management, etc.
                <br /><br />
                PeopleFlow's unique value proposition is to be at the same time very easy to use and fully integrated.
              </div>
            </div>
          </div>
          <div className="text-center text-xs opacity-60 text-white/50">
            © 2026 PeopleFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
