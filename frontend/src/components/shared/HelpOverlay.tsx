import { useState } from 'react';
import { X, Keyboard, HelpCircle, Bug, User, Phone, CheckCircle } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';

export function HelpOverlay() {
  const { isHelpOverlayOpen, setHelpOverlay } = useUiStore();
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'support' | 'bug'>('shortcuts');
  
  // Bug report states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('low');
  const [submitted, setSubmitted] = useState(false);

  if (!isHelpOverlayOpen) return null;

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Bug report logged successfully. IT has been notified.');
    setTimeout(() => {
      setTitle('');
      setDesc('');
      setSubmitted(false);
      setHelpOverlay(false);
    }, 1500);
  };

  const SHORTCUTS = [
    { keys: ['⌘', 'K'], desc: 'Open Universal Search / Command Menu' },
    { keys: ['esc'], desc: 'Close open dialogs, drawers, and panels' },
    { keys: ['?'], desc: 'Open this Help & Shortcuts panel' },
  ];

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setHelpOverlay(false)}
      />

      {/* Panel */}
      <div className="relative bg-surface rounded-2xl max-w-lg w-full border border-border shadow-modal flex flex-col max-h-[90vh] animate-fade-in overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background/20">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-plum" />
            <span className="font-bold text-text-primary text-base">Help & Support</span>
          </div>
          <button
            onClick={() => setHelpOverlay(false)}
            className="p-1.5 rounded-lg hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-background/50 px-4">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'shortcuts' ? 'border-plum text-plum-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Keyboard size={14} />
            Shortcuts
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'support' ? 'border-plum text-plum-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Phone size={14} />
            HR Support
          </button>
          <button
            onClick={() => setActiveTab('bug')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'bug' ? 'border-plum text-plum-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bug size={14} />
            Report Bug
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Keyboard Shortcuts</h3>
              <div className="space-y-2.5">
                {SHORTCUTS.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-xs text-text-secondary">{s.desc}</span>
                    <div className="flex items-center gap-1.5">
                      {s.keys.map((k, i) => (
                        <kbd key={i} className="px-2 py-1 rounded bg-background border border-border/80 text-text-primary text-xs font-mono font-bold shadow-sm">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">HR Contact Information</h3>
                <p className="text-xs text-text-secondary">Have issues with payroll, leaves, or policies? Contact HR representatives directly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-4 flex gap-3 items-start border-border/80">
                  <div className="w-8 h-8 rounded-lg bg-plum-50 flex items-center justify-center text-plum mt-0.5 flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">Workspace HR Admin</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Primary Contact</p>
                    <p className="text-xs text-plum-accent font-semibold mt-1">support@peopleflow.co</p>
                  </div>
                </div>

                <div className="card p-4 flex gap-3 items-start border-border/80">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mt-0.5 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">Corporate IT Helpline</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Availability: 9AM - 6PM</p>
                    <p className="text-xs text-teal-600 font-semibold mt-1">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bug' && (
            <div>
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="font-bold text-text-primary text-sm">Issue Logged</h3>
                  <p className="text-xs text-text-secondary">Thank you! IT has received your diagnostic report and will inspect it.</p>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="form-label text-xs">Bug Title <span className="text-error">*</span></label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Attendance check-in buttons overlapping on mobile"
                      className="form-input text-xs w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="form-label text-xs">Description <span className="text-error">*</span></label>
                    <textarea
                      required
                      rows={3}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="What did you do? What happened instead?"
                      className="form-input text-xs w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="form-label text-xs">Severity Level</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="form-input text-xs w-full pr-8"
                    >
                      <option value="low">Low (Cosmetic/Typo)</option>
                      <option value="medium">Medium (Workaround available)</option>
                      <option value="high">High (Broken functionality)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-xs w-full py-2.5 rounded-xl font-bold mt-2"
                  >
                    Submit Bug Report
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
