import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowUp, Globe, ChevronDown, Clock, Sparkles, CreditCard, 
  Users, Building2, Award, ArrowRight, Check,
  Linkedin, Github, Twitter, MessageSquare
} from 'lucide-react';

const features = [
  {
    title: 'Attendance Management',
    description: 'Real-time check-in/out shifts registry. Handles late hours, half-day states, and audit trails.',
    icon: Clock,
    iconColor: 'text-[#7A4B8F] bg-[#7A4B8F]/8 border border-[#7A4B8F]/15',
  },
  {
    title: 'AI Leave Assistant',
    description: 'Automatic leave summaries and prioritization powered by the Gemini AI decision board.',
    icon: Sparkles,
    iconColor: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
  },
  {
    title: 'Payroll Automation',
    description: 'Monthly slip calculations covering basic salary scales, allowances, tax brackets, and deductions.',
    icon: CreditCard,
    iconColor: 'text-amber-600 bg-amber-50 border border-amber-100',
  },
  {
    title: 'Employee Directory',
    description: 'A unified listing of active personnel profiles, role filters, and designation parameters.',
    icon: Users,
    iconColor: 'text-rose-600 bg-rose-50 border border-rose-100',
  },
  {
    title: 'Department Management',
    description: 'Structure organizational divisions, map team count parameters, and designate heads of department.',
    icon: Building2,
    iconColor: 'text-indigo-600 bg-indigo-50 border border-indigo-100',
  },
  {
    title: 'Employee Certifications',
    description: 'Learning portals, onboarding guides, and certifications to verify employee qualifications.',
    icon: Award,
    iconColor: 'text-yellow-600 bg-yellow-50 border border-yellow-100',
  },
];

const pricingFeatures = [
  'Unlimited Employees',
  'Attendance Management',
  'Payroll Automation',
  'Leave Management',
  'AI Leave Assistant',
  'Custom Reports',
  'Analytics Dashboard',
];

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary antialiased selection:bg-primary-50 selection:text-[#7A4B8F]">
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Subtle Radial Gradient Backgrounds */}
      <div className="absolute top-[8%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#7A4B8F]/3 blur-[120px] pointer-events-none -z-50"></div>
      <div className="absolute top-[25%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#714B67]/3 blur-[150px] pointer-events-none -z-50"></div>
      <div className="absolute top-[60%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#62417B]/4 blur-[130px] pointer-events-none -z-50"></div>
      <div className="absolute top-[80%] right-[8%] w-[380px] h-[380px] rounded-full bg-primary/3 blur-[120px] pointer-events-none -z-50"></div>

      {/* Top Navigation */}
      <nav aria-label="Global Navigation" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40 w-full transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-12 h-20 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7A4B8F] to-[#714B67] flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:scale-[1.04] transition-transform duration-200">
                PF
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[#111827]">PeopleFlow</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <a className="text-text-secondary hover:text-[#7A4B8F] transition-all duration-200 font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0" href="#features">Features</a>
              <a className="text-text-secondary hover:text-[#7A4B8F] transition-all duration-200 font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0" href="#pricing">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-[#7A4B8F] to-[#62417B] text-white h-12 px-6 rounded-[14px] font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A4B8F]/20 active:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-md shadow-[#7A4B8F]/10"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-[#7A4B8F] transition-colors font-semibold text-xs md:text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#7A4B8F] to-[#62417B] text-white h-12 px-6 rounded-[14px] font-semibold text-xs md:text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A4B8F]/20 active:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-md shadow-[#7A4B8F]/10"
                >
                  Try it free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-24">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-28 relative w-full">
          <header className="flex flex-col items-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#714B67]/8 text-[#714B67] border border-[#714B67]/15 mb-6 shadow-sm hover:scale-[1.02] transition-transform duration-300 cursor-default animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5 text-[#7A4B8F]" />
              <span>✨ Built for Modern HR Teams</span>
            </div>

            <h1 className="font-display text-5xl md:text-[72px] md:leading-[1.05] font-extrabold text-[#111827] tracking-tight max-w-[900px] mx-auto mb-6 text-center animate-fade-in-up">
              All your HR operations on <span className="bg-gradient-to-r from-[#7A4B8F] to-[#714B67] bg-clip-text text-transparent">one platform.</span>
              <span className="block mt-3 text-gray-900">
                Simple, efficient, and modern.
              </span>
            </h1>
          </header>
          
          <p className="font-sans text-lg md:text-[22px] md:leading-[1.4] max-w-[700px] mx-auto text-[#6B7280] mb-10 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Manage employees, attendance, payroll, leave management, and AI-powered HR workflows from one beautiful platform.
          </p>

          <div className="flex justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#7A4B8F] to-[#62417B] text-white h-14 px-8 flex items-center justify-center gap-2 rounded-[16px] font-semibold text-base shadow-lg shadow-[#7A4B8F]/15 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7A4B8F]/25 active:translate-y-0 transition-all duration-300"
            >
              Start now - It's free
            </Link>
            <a
              href="#features"
              className="bg-white text-[#111827] border border-[#E5E7EB] hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 hover:-translate-y-1 transition-all duration-300 h-14 px-8 flex items-center justify-center gap-2 rounded-[16px] font-semibold text-base shadow-sm"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-col items-center text-[#6B7280] text-xs mt-8 font-semibold animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <ArrowUp className="w-4 h-4 text-[#7A4B8F] mb-1.5 animate-bounce" />
            <span>No credit card required · Instant demo access</span>
          </div>
        </section>

        {/* Social Proof / Glassmorphism Connect Section */}
        <section className="w-full max-w-5xl mx-auto mb-32 relative">
          <div className="bg-white/40 backdrop-blur-xl border border-[#E5E7EB] rounded-[32px] p-8 md:p-12 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-left">
              <div className="flex items-center gap-1.5 text-[#22C55E] font-semibold text-sm mb-3">
                <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                <span>Trusted by modern teams</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111827] leading-tight mb-3">
                Join thousands of active HR professionals
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Empower your workspace. PeopleFlow streamlines daily operations so your team can focus on what matters most.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12">
              {/* Counter / Stats */}
              <div className="text-center sm:text-left">
                <div className="font-display text-5xl font-extrabold text-[#111827] tracking-tight mb-1">
                  15k+
                </div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Active Employees
                </div>
              </div>
              
              {/* Counter 2 */}
              <div className="text-center sm:text-left">
                <div className="font-display text-5xl font-extrabold text-[#7A4B8F] tracking-tight mb-1">
                  99.9%
                </div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Platform Uptime
                </div>
              </div>

              {/* Avatars stacked */}
              <div className="flex -space-x-3 overflow-hidden">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" alt="User Avatar" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="User Avatar" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="User Avatar" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" alt="User Avatar" />
              </div>
            </div>
          </div>

          {/* Floating logos grid (Grayscale & Soft opacity) */}
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 mt-12 opacity-40">
            <span className="font-display text-lg font-bold text-gray-500 tracking-wide uppercase">Slack</span>
            <span className="font-display text-lg font-bold text-gray-500 tracking-wide uppercase">Stripe</span>
            <span className="font-display text-lg font-bold text-gray-500 tracking-wide uppercase">Figma</span>
            <span className="font-display text-lg font-bold text-gray-500 tracking-wide uppercase">Linear</span>
            <span className="font-display text-lg font-bold text-gray-500 tracking-wide uppercase">Vercel</span>
          </div>
        </section>

        {/* Features Header Section */}
        <section id="features" className="w-full text-center py-16">
          <div className="max-w-3xl mx-auto px-4">
            <span className="text-[#7A4B8F] text-xs font-bold uppercase tracking-widest mb-3 block">Product Capabilities</span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
              All-in-one HR platform
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              From shifts to payroll, PeopleFlow simplifies all core HR functions under a modern, unified dashboard.
            </p>
          </div>
        </section>
        
        {/* Features Cards Grid */}
        <section className="w-full mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-10 rounded-[20px] border border-[#ECEEF5] hover:-translate-y-2 hover:shadow-xl hover:shadow-[#7A4B8F]/5 hover:border-[#7A4B8F]/15 transition-all duration-300 group flex flex-col h-full cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <header>
                    <h3 className="font-display text-xl font-bold mb-2 text-[#111827]">{feature.title}</h3>
                  </header>
                  <p className="text-sm text-[#6B7280] leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing Segment */}
        <section id="pricing" className="w-full max-w-4xl mx-auto mb-16 text-center relative px-6">
          {/* Glow behind pricing */}
          <div className="absolute inset-0 bg-[#7A4B8F]/3 blur-[80px] pointer-events-none -z-10 rounded-full max-w-md mx-auto"></div>
          
          <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-10 md:p-16 shadow-xl shadow-gray-200/40 relative overflow-hidden">
            <h2 className="font-display text-3xl font-extrabold text-[#111827]">Transparent, simple pricing</h2>
            <p className="text-[#6B7280] text-base mt-3 max-w-md mx-auto">
              No hidden fees. Build and grow your team with our completely free business suite.
            </p>
            
            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-8 max-w-lg mx-auto text-left border-y border-gray-100 py-6">
              {pricingFeatures.map((feat) => (
                <div key={feat} className="flex items-center gap-3 text-sm text-[#6B7280]">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-[#111827]">{feat}</span>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="mt-10 flex flex-col items-center">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Lifetime Free</span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-[#6B7280] text-3xl font-medium">₹</span>
                <span className="text-[#111827] text-7xl font-extrabold tracking-tight">0</span>
                <span className="text-[#6B7280] text-lg font-medium">/ user / month</span>
              </div>
              <p className="text-[#7A4B8F] text-xs font-bold mt-3">Free during the Odoo Hackathon period!</p>
            </div>
            
            {/* CTA Button */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#7A4B8F] to-[#62417B] text-white h-14 px-10 rounded-[16px] font-semibold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7A4B8F]/20 active:translate-y-0 transition-all duration-300 flex items-center justify-center shadow-md shadow-[#7A4B8F]/15"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#090A0F] text-gray-400 py-20 w-full mt-auto border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm w-full pb-16 border-b border-white/10 mb-12">
            <div className="flex flex-col gap-4">
              <span className="font-display text-2xl font-extrabold text-white tracking-tight">PeopleFlow</span>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                PeopleFlow's unique value proposition is to be at the same time very easy to use and fully integrated.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-4 mt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Community</h4>
              <ul className="space-y-3 flex flex-col text-xs text-gray-500">
                <li><a className="hover:text-white transition-colors" href="#">Tutorials</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Forum</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Download App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-3 flex flex-col text-xs text-gray-500">
                <li><a className="hover:text-white transition-colors" href="#">Cloud Hosting</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Enterprise Support</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Custom Upgrade</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Developer API</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Education Program</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">About Us</h4>
              <ul className="space-y-3 flex flex-col text-xs text-gray-500">
                <li><a className="hover:text-white transition-colors" href="#">Our Company</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Brand Assets</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Contact Sales</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Live Events</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-gray-600">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <span>
              © 2026 PeopleFlow. All rights reserved. Built for evaluation.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
