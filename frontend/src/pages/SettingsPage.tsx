import { useState } from 'react';
import { Settings, User, Lock, Bell, Palette, Globe, ChevronRight, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';

type SettingsTab = 'account' | 'security' | 'notifications' | 'appearance';

const tabs: { id: SettingsTab; label: string; icon: React.FC<any> }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary mt-0.5">{description}</p>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${value ? 'bg-primary' : 'bg-border'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  );
}

function AccountTab() {
  const user = useAuthStore(s => s.user);
  const initials = user?.employee
    ? `${user.employee.firstName[0]}${user.employee.lastName[0]}`
    : (user?.email[0].toUpperCase() || 'U');
  const displayName = user?.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user?.email || '';

  return (
    <div>
      <SectionHeader title="Account Information" description="Your personal account details on PeopleFlow." />
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-[#714b67] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{displayName}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
            <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${user?.role === 'Admin' ? 'bg-primary-50 text-plum-accent border border-primary-100' : 'badge-blue'}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-input" value={displayName} readOnly />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-input" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="form-label">Role</label>
            <input className="form-input" value={user?.role || ''} readOnly />
          </div>
          {user?.employee && (
            <div>
              <label className="form-label">Employee Code</label>
              <input className="form-input" value={user.employee.employeeCode} readOnly />
            </div>
          )}
        </div>
        <p className="text-xs text-text-secondary">To update profile information, visit <a href="/profile" className="text-primary hover:underline font-medium">My Profile</a>.</p>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!form.newPassword || form.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <div>
      <SectionHeader title="Password & Security" description="Change your password and manage account security." />
      <div className="card p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className={`form-input ${errors.currentPassword ? 'form-input-error' : ''}`}
              value={form.currentPassword}
              onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
              placeholder="Enter current password"
            />
            {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              className={`form-input ${errors.newPassword ? 'form-input-error' : ''}`}
              value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              placeholder="Minimum 8 characters"
            />
            {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="Repeat new password"
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Changing Password…' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="card p-5 mt-4">
        <h4 className="font-medium text-sm text-text-primary mb-3">Security Tips</h4>
        <ul className="space-y-2">
          {['Use a unique password not used elsewhere', 'Include uppercase, lowercase, numbers, and symbols', 'Change your password regularly', 'Never share your credentials'].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-xs text-text-secondary">
              <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    leaveUpdates: true,
    payrollAlerts: true,
    attendanceReminders: false,
    systemAnnouncements: true,
    emailDigest: false,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div>
      <SectionHeader title="Notification Preferences" description="Choose what notifications you want to receive." />
      <div className="card p-5">
        <ToggleRow label="Leave Request Updates" description="Get notified when your leave is approved or rejected." value={prefs.leaveUpdates} onChange={() => toggle('leaveUpdates')} />
        <ToggleRow label="Payroll Alerts" description="Receive notifications when payroll is processed." value={prefs.payrollAlerts} onChange={() => toggle('payrollAlerts')} />
        <ToggleRow label="Attendance Reminders" description="Daily reminders to check in / check out." value={prefs.attendanceReminders} onChange={() => toggle('attendanceReminders')} />
        <ToggleRow label="System Announcements" description="Important updates from the HR team." value={prefs.systemAnnouncements} onChange={() => toggle('systemAnnouncements')} />
        <ToggleRow label="Email Digest" description="Receive a daily email summary of your notifications." value={prefs.emailDigest} onChange={() => toggle('emailDigest')} />
      </div>
      <p className="text-xs text-text-secondary mt-3">
        Note: Notification preferences are stored locally for this session.
      </p>
    </div>
  );
}

function AppearanceTab() {
  return (
    <div>
      <SectionHeader title="Appearance" description="Customize how PeopleFlow looks for you." />
      <div className="card p-5 space-y-5">
        <div>
          <p className="text-sm font-medium text-text-primary mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Light', active: true, bg: 'bg-white border-primary', dot: 'bg-gray-800' },
              { label: 'Dark', active: false, bg: 'bg-gray-900 border-border', dot: 'bg-white' },
              { label: 'System', active: false, bg: 'bg-gradient-to-r from-white to-gray-900 border-border', dot: 'bg-gray-500' },
            ].map(t => (
              <button
                key={t.label}
                className={`p-3 rounded-xl border-2 ${t.active ? 'border-primary' : 'border-border'} flex flex-col items-center gap-2`}
              >
                <div className={`w-full h-10 rounded-lg ${t.bg} border flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full ${t.dot}`} />
                </div>
                <span className="text-xs font-medium text-text-primary">{t.label}</span>
                {t.active && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-2">Dark mode coming soon. Currently PeopleFlow uses the Light theme.</p>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-text-primary mb-3">Language</p>
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-fit">
            <Globe className="w-4 h-4 text-text-secondary" />
            <select className="bg-transparent text-sm text-text-primary outline-none">
              <option>English (US)</option>
              <option>Hindi (India)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and security"
        breadcrumbs={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }]}
        icon={<Settings className="w-5 h-5 text-plum-accent" />}
      />

      <div className="page-wrapper">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-52 flex-shrink-0">
            <nav className="card p-2 space-y-0.5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${activeTab === tab.id ? 'bg-primary-50 text-plum-accent border border-primary-100' : 'text-text-secondary hover:bg-background hover:text-text-primary'}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 animate-fade-in">
            {activeTab === 'account' && <AccountTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'appearance' && <AppearanceTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
