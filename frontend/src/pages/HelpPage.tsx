import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ExternalLink, BookOpen, MessageCircle, Clock, Zap } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';

const faqs = [
  {
    category: 'Attendance',
    items: [
      { q: 'How do I check in for the day?', a: 'Go to the Attendance page from the sidebar. Click the "Check In" button. The system will record your check-in time. You can only check in once per day.' },
      { q: 'Can I check in / check out from my mobile?', a: 'Yes! PeopleFlow is fully responsive. Open the app in any mobile browser and use the same Attendance page.' },
      { q: 'What happens if I forget to check out?', a: 'Contact your admin to manually update your attendance record. Admins can edit attendance from the Attendance Audit board.' },
    ],
  },
  {
    category: 'Leave & Time Off',
    items: [
      { q: 'How do I apply for leave?', a: 'Navigate to Time Off from the sidebar. Click "Apply for Leave", select the leave type, date range, enter your reason, and submit. Your manager/admin will review it.' },
      { q: 'How quickly will my leave be approved?', a: 'Leave approval time varies by your organization\'s HR policies. You\'ll receive a notification when your leave status changes.' },
      { q: 'Can I cancel a leave request?', a: 'Once a leave request is submitted, please contact your HR admin to cancel or modify it. Direct cancellation from the portal is coming soon.' },
      { q: 'How do I check my leave balance?', a: 'Visit the Time Off page. Your remaining leave balance for each leave type is shown in the balance cards at the top of the page.' },
    ],
  },
  {
    category: 'Payroll',
    items: [
      { q: 'When is payroll processed?', a: 'Payroll is processed by your HR admin, typically at the end of each month. You\'ll receive a notification when your pay slip is ready.' },
      { q: 'How do I view my pay slips?', a: 'Go to Payroll in the sidebar. All your past pay slips are listed there with breakdown details.' },
      { q: 'What does "Net Salary" include?', a: 'Net Salary = Basic Salary + Allowances - Deductions (PF, taxes, etc.). The exact breakdown is shown on each pay slip.' },
    ],
  },
  {
    category: 'Profile & Account',
    items: [
      { q: 'How do I update my profile picture?', a: 'Go to My Profile in the sidebar. Click on your profile picture to upload a new one. Supported formats: JPG, PNG (max 5MB).' },
      { q: 'Can I change my email address?', a: 'Email changes require admin approval for security reasons. Contact your HR admin to update your email.' },
      { q: 'How do I reset my password?', a: 'You can change your password from Settings → Security. Enter your current password and set a new one.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-background/60 transition-colors"
      >
        <span className={`text-sm font-medium ${open ? 'text-plum-accent' : 'text-text-primary'}`}>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-5 pb-4 animate-fade-in">
          <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function HelpPage() {
  const [searchQ, setSearchQ] = useState('');

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !searchQ || item.q.toLowerCase().includes(searchQ.toLowerCase()) || item.a.toLowerCase().includes(searchQ.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Help Center"
        subtitle="Find answers to common questions and get support"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Help' }]}
        icon={<HelpCircle className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper max-w-4xl mx-auto">
        {/* Hero Search */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-plum-accent text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" /> Quick Support
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">How can we help you?</h2>
          <p className="text-text-secondary text-sm mb-4">Search through our frequently asked questions</p>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-2xl px-5 py-3 max-w-lg mx-auto focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-card">
            <HelpCircle className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <input
              aria-label="Search FAQs"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search FAQs… (e.g. check in, leave balance, payroll)"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded px-1"
            />
          </div>
        </div>

        {/* Quick Links */}
        {!searchQ && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Clock, label: 'Attendance', desc: 'Check-in guidance' },
              { icon: BookOpen, label: 'Leave Policies', desc: 'Time off rules' },
              { icon: MessageCircle, label: 'Payroll', desc: 'Pay slip help' },
              { icon: Mail, label: 'Contact HR', desc: 'Get in touch' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="card p-4 flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-plum-accent" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <HelpCircle className="w-12 h-12 text-border mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-medium text-text-primary">No matches found yet</p>
              <p className="text-xs text-text-secondary mt-1">Try another keyword or reach out directly to support!</p>
            </div>
          ) : (
            filtered.map(cat => (
              <div key={cat.category} className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-background">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{cat.category}</p>
                </div>
                {cat.items.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-8 card p-6 flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary-50 to-surface border-primary-100">
          <div className="w-12 h-12 rounded-2xl bg-[#714b67] flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-text-primary">Still need help?</h3>
            <p className="text-sm text-text-secondary mt-0.5">
              Contact your HR administrator for assistance. They can help with account issues, leave policies, and payroll queries.
            </p>
          </div>
          <a
            href="mailto:hr@peopleflow.com"
            className="btn-primary flex items-center gap-2 flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Contact HR
          </a>
        </div>
      </div>
    </div>
  );
}
