import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Globe, ChevronDown, CheckCircle2, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

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
            <Link className="text-text-secondary hover:text-primary-600 transition-colors font-semibold text-xs rounded" to="/about">About Us</Link>
            <Link className="text-primary-600 font-semibold text-xs rounded" to="/contact">Contact</Link>
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
            Get in touch with <span className="text-highlight">our team.</span>
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
            Have questions about evaluations, deployment options, or custom development workflows? Drop us a line.
          </p>
        </section>

        {/* Contact Block Grid */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-left mb-16">
          {/* Contact Details (Left 5 Columns) */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-border space-y-6">
              <h3 className="font-display text-base font-bold text-text-primary">Corporate Office</h3>
              
              <div className="space-y-4 text-xs text-text-secondary">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary block">Address</span>
                    <span>15 Park Street, Salt Lake Sector V, Kolkata, West Bengal 700091</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary block">Support Email</span>
                    <span>support@peopleflow.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-primary block">Direct line</span>
                    <span>+91 8765432109</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right 7 Columns) */}
          <div className="md:col-span-7">
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="font-display text-xl font-bold text-text-primary">Message Sent!</h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting PeopleFlow. We have received your inquiry and our operations team will respond to you at <strong>{email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setName(''); setEmail(''); setOrg(''); setMessage(''); }}
                    className="bg-primary-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-border pb-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    <h3 className="font-display text-base font-bold text-text-primary">Send an Inquiry</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 text-xs text-left">
                      <label className="font-bold text-text-primary" htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Johnson"
                        className="border border-border p-2.5 rounded-lg text-xs focus:outline-primary-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs text-left">
                      <label className="font-bold text-text-primary" htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="border border-border p-2.5 rounded-lg text-xs focus:outline-primary-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-left">
                    <label className="font-bold text-text-primary" htmlFor="org">Organization Name</label>
                    <input
                      id="org"
                      type="text"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      placeholder="Acme Corporation"
                      className="border border-border p-2.5 rounded-lg text-xs focus:outline-primary-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-left">
                    <label className="font-bold text-text-primary" htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write details of your inquiry here..."
                      className="border border-border p-2.5 rounded-lg text-xs focus:outline-primary-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-600 text-white w-full py-3 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    Submit Message
                  </button>
                </form>
              )}
            </div>
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
