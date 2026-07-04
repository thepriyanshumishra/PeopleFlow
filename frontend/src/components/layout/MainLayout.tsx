import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Clock, CalendarDays, DollarSign, User, Users,
  Building2, LogOut, Bell, Menu, X, ChevronDown, Shield, HelpCircle,
  Search, BarChart3, Brain, FileText, Globe, Calendar, Settings,
  Newspaper, Command, Activity, Sparkles, WifiOff, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { authApi } from '@/api/endpoints';
import toast from 'react-hot-toast';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { NotificationDrawer } from '@/components/shared/NotificationDrawer';
import { ProfileDrawer } from '@/components/shared/ProfileDrawer';
import { GlobalModals } from '@/components/shared/GlobalModals';
import { HelpOverlay } from '@/components/shared/HelpOverlay';
import { OnboardingTour } from '@/components/shared/OnboardingTour';

const employeeLinkSections = [
  {
    label: 'Overview',
    links: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'My Work',
    links: [
      { to: '/attendance', icon: Clock, label: 'Attendance' },
      { to: '/leave', icon: CalendarDays, label: 'Time Off' },
      { to: '/payroll', icon: DollarSign, label: 'Payroll' },
    ],
  },
  {
    label: 'General',
    links: [
      { to: '/calendar', icon: Calendar, label: 'Calendar' },
      { to: '/directory', icon: Globe, label: 'Directory' },
      { to: '/activity', icon: Activity, label: 'Activity Center' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/profile', icon: User, label: 'Profile' },
    ],
  },
];

const adminLinkSections = [
  {
    label: 'Overview',
    links: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'HR Management',
    links: [
      { to: '/admin/employees', icon: Users, label: 'Employees' },
      { to: '/admin/attendance', icon: Clock, label: 'Attendance' },
      { to: '/admin/leave', icon: CalendarDays, label: 'Leave Board' },
      { to: '/admin/payroll', icon: DollarSign, label: 'Payroll' },
      { to: '/admin/departments', icon: Building2, label: 'Departments' },
      { to: '/admin/organization', icon: Newspaper, label: 'Org Structure' },
    ],
  },
  {
    label: 'Intelligence',
    links: [
      { to: '/activity', icon: Activity, label: 'Activity Center' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/reports', icon: FileText, label: 'Reports' },
      { to: '/ai', icon: Brain, label: 'AI Insights' },
      { to: '/admin/audit', icon: Shield, label: 'Audit Logs' },
    ],
  },
  {
    label: 'General',
    links: [
      { to: '/calendar', icon: Calendar, label: 'Calendar' },
      { to: '/directory', icon: Globe, label: 'Directory' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/profile', icon: User, label: 'My Profile' },
    ],
  },
];

// Helper to generate path-based breadcrumbs dynamically
function getDynamicBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; to?: string }[] = [{ label: 'Home', to: '/dashboard' }];

  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    
    // Ignore numeric IDs in breadcrumb labels
    if (/^\d+$/.test(part)) {
      breadcrumbs.push({ label: 'Details', to: undefined });
      return;
    }

    // Format label prettily
    let label = part.charAt(0).toUpperCase() + part.slice(1);
    if (part === 'admin') return; // Skip "admin" segment for cleaner flow
    if (part === 'employees') label = 'Employees';
    if (part === 'leave') label = 'Leaves';
    if (part === 'payroll') label = 'Payroll';
    if (part === 'ai') label = 'AI Insights';

    breadcrumbs.push({
      label,
      to: index === parts.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand UI States
  const {
    isNotificationDrawerOpen,
    setNotificationDrawer,
    isProfileDrawerOpen,
    setProfileDrawer,
    isHelpOverlayOpen,
    setHelpOverlay,
    isOffline,
    setOffline,
    startOnboarding,
  } = useUiStore();

  const sections = user?.role === 'Admin' ? adminLinkSections : employeeLinkSections;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline]);

  // Cmd/Ctrl+K shortcut & '?' help shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in form inputs
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
      
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setHelpOverlay(true);
      }

      if (e.key === 'Escape') {
        setCmdOpen(false);
        setHelpOverlay(false);
        setNotificationDrawer(false);
        setProfileDrawer(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setNotificationDrawer, setProfileDrawer, setHelpOverlay]);

  // Auto-launch onboarding tour once for new users
  useEffect(() => {
    const onboarded = localStorage.getItem('peopleflow-onboarded');
    if (!onboarded) {
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [startOnboarding]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const initials = user?.employee
    ? `${user.employee.firstName[0]}${user.employee.lastName[0]}`
    : user?.email[0].toUpperCase() || 'U';

  const displayName = user?.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user?.email || '';

  const breadcrumbs = getDynamicBreadcrumbs(location.pathname);

  return (
    <div className="min-h-screen bg-background flex text-text-primary font-sans relative overflow-x-hidden">
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-xs font-bold text-center z-[9999] flex items-center justify-center gap-2">
          <WifiOff size={14} className="animate-pulse" />
          <span>You are currently offline. Check your internet connection.</span>
        </div>
      )}

      {/* Global Modals, Drawers, Help and Tours */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} isAdmin={user?.role === 'Admin'} />
      <NotificationDrawer />
      <ProfileDrawer />
      <GlobalModals />
      <HelpOverlay />
      <OnboardingTour />

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-40 flex flex-col py-4 px-3
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-5 px-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-plum flex items-center justify-center text-white font-black text-sm">
              PF
            </div>
            <div>
              <h1 className="font-display text-lg font-black text-plum-accent leading-none">PeopleFlow</h1>
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mt-0.5">HR Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-background"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Role Badge */}
        {user?.role === 'Admin' && (
          <div className="mx-1 mb-3 px-3 py-1.5 bg-primary-50 rounded-xl flex items-center gap-2 border border-primary-100">
            <Shield className="w-3.5 h-3.5 text-plum-accent" />
            <span className="text-xs font-bold text-plum-accent">Administrator</span>
          </div>
        )}

        {/* Navigation sections */}
        <nav className="flex-grow overflow-y-auto space-y-4 pr-1">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[10px] font-bold text-text-secondary uppercase tracking-widest">{section.label}</p>
              <div className="space-y-0.5">
                {section.links.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                        isActive
                          ? 'bg-primary-50 text-plum-accent border border-primary-100'
                          : 'text-text-secondary hover:bg-background hover:text-text-primary'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-3 space-y-1.5 pt-3 border-t border-border">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                isActive ? 'bg-primary-50 text-plum-accent border border-primary-100' : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }`
            }
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
          <button
            type="button"
            onClick={() => setHelpOverlay(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-text-secondary hover:bg-background hover:text-text-primary text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>Help Center</span>
          </button>

          <div
            onClick={() => setProfileDrawer(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-background/60 cursor-pointer hover:bg-background transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            <div className="w-8 h-8 rounded-full bg-plum flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
              <p className="text-[10px] text-text-secondary truncate">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-error hover:bg-red-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300 ${isOffline ? 'pt-10' : ''}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-6 justify-between">
          {/* Breadcrumb Display */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-background active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>

            <nav className="hidden md:flex items-center gap-1.5 text-xs text-text-secondary font-medium select-none">
              {breadcrumbs.map((bc, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-border" />}
                  {bc.to ? (
                    <Link to={bc.to} className="hover:text-plum transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
                      {bc.label}
                    </Link>
                  ) : (
                    <span className="text-text-primary font-bold">{bc.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Center search triggers */}
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="hidden lg:flex items-center gap-2 text-text-secondary bg-background px-4 py-1.5 rounded-full border border-border hover:border-primary transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-h-[36px]"
          >
            <Search className="w-4 h-4" />
            <span className="text-xs w-48 text-left text-text-secondary">Search pages, employees…</span>
            <div className="flex items-center gap-0.5 ml-2">
              <kbd className="px-1.5 py-0.5 rounded bg-border text-text-secondary text-[10px] font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-border text-text-secondary text-[10px] font-mono">K</kbd>
            </div>
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNotificationDrawer(true)}
              className="p-2 rounded-full hover:bg-background transition-colors active:scale-95 text-text-secondary min-h-[40px] min-w-[40px] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setHelpOverlay(true)}
              className="text-text-secondary hover:bg-background p-2 rounded-full transition-all active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-border mx-1" />
            
            <button
              type="button"
              onClick={() => setProfileDrawer(true)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-background transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-plum flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow pb-16">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-border bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-plum-accent">PeopleFlow HRMS</span>
            <span className="text-border">|</span>
            <span>Version 2.0.4 (Build #783154989)</span>
          </div>
          <div className="flex gap-4 font-semibold text-plum-accent">
            <button onClick={() => setHelpOverlay(true)} className="hover:underline">Support</button>
            <button onClick={() => startOnboarding()} className="hover:underline flex items-center gap-1">
              <Sparkles size={11} />
              Take Tour
            </button>
            <Link to="/help" className="hover:underline">Docs</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
