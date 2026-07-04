import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Globe, ChevronDown, Sparkles, Shield, Heart, Eye } from 'lucide-react';

export function AboutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const team = [
    { name: "Sarah Johnson", role: "HR Manager & Admin", email: "admin@peopleflow.com", initials: "SJ", color: "bg-primary-100 text-primary-600" },
    { name: "Priyanshu Mishra", role: "Lead Software Engineer", email: "priyanshu@peopleflow.com", initials: "PM", color: "bg-blue-100 text-blue-600" },
    { name: "Aanya Sharma", role: "Marketing Executive", email: "aanya@peopleflow.com", initials: "AS", color: "bg-green-100 text-green-600" },
    { name: "Rahul Verma", role: "Finance Analyst", email: "rahul@peopleflow.com", initials: "RV", color: "bg-amber-100 text-amber-600" },
    { name: "Divya Patel", role: "Backend Developer", email: "divya@peopleflow.com", initials: "DP", color: "bg-purple-100 text-purple-600" },
    { name: "Arjun Singh", role: "Operations Manager", email: "arjun@peopleflow.com", initials: "AS", color: "bg-rose-100 text-rose-600" },
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
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/pricing">Pricing</Link>
            <Link className="text-primary-600 font-semibold text-xs rounded" to="/about">About Us</Link>
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
            Our mission is to make HR <span className="text-highlight">delightful.</span>
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
            PeopleFlow was founded to bring modern ERP principles to Human Resource Management. We believe that clean design, solid integrations, and AI automations can unlock true workforce potential.
          </p>
        </section>

        {/* Values Block */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-left">
          <div className="bg-white p-6 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">Design First</h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              We design tools that people enjoy using. Elegant typography, clean data grids, and micro-interactions make operational HR workflows feel light and visual.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">Gemini AI Assistance</h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Integrating LLMs directly into relational records lets us automate repetitive review processes, giving administrators high-level summaries instantly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">Relational Integrity</h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Built on a structured database layout, all shifts, attendance logs, leaves, and payroll records map cleanly to active employee cards without redundancy.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full max-w-5xl mx-auto mb-16 text-left">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-text-primary">Meet Our Seeded Team</h2>
            <p className="text-text-secondary text-xs mt-1">These employee profiles are pre-populated in your local database for instant demo evaluation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-border flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${member.color}`}>
                  {member.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{member.name}</h4>
                  <div className="text-[10px] text-text-secondary mt-0.5">{member.role}</div>
                  <div className="text-[9px] text-primary-600 font-mono mt-1">{member.email}</div>
                </div>
              </div>
            ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/10 pb-12 mb-8 text-xs w-full">
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/features">Features</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 flex flex-col">
                <li><a className="hover:text-white transition-colors" href="#">PRD Specification</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Architecture Specs</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Database Schema Contract</a></li>
                <li><a className="hover:text-white transition-colors" href="#">API Endpoint Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">About us</h4>
              <ul className="space-y-2 flex flex-col">
                <li><Link className="hover:text-white transition-colors" to="/about">Our company</Link></li>
                <li><Link className="hover:text-white transition-colors" to="/contact">Contact us</Link></li>
                <li><a className="hover:text-white transition-colors" href="#">Developer Team</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Brand Guidelines</a></li>
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
