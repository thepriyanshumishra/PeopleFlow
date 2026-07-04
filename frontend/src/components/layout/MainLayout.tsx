import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Clock, CalendarDays, DollarSign, User, Users,
  Building2, LogOut, Bell, Menu, X, ChevronDown, Shield, HelpCircle, Search
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/endpoints';
import { notificationsApi } from '@/api/endpoints';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const employeeLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/attendance', icon: Clock, label: 'Attendance' },
  { to: '/leave', icon: CalendarDays, label: 'Time Off' },
  { to: '/payroll', icon: DollarSign, label: 'Payroll' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employees', icon: Users, label: 'Directory' },
  { to: '/admin/attendance', icon: Clock, label: 'Attendance Audit' },
  { to: '/admin/leave', icon: CalendarDays, label: 'Leave Board' },
  { to: '/admin/payroll', icon: DollarSign, label: 'Payroll Board' },
  { to: '/admin/departments', icon: Building2, label: 'Departments' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then(r => r.data.data || []),
    refetchInterval: 30000,
  });

  const notifications = (data as any[]) || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await notificationsApi.markAllRead();
    refetch();
  };

  const typeIcon: Record<string, string> = {
    success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-background transition-colors active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full flex items-center justify-center font-bold" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-surface rounded-modal shadow-dropdown border border-border z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline font-semibold">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-text-secondary text-sm py-8">No notifications</p>
            ) : (
              notifications.slice(0, 10).map((n: any) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border last:border-0 ${!n.isRead ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex gap-2">
                    <span className="text-base flex-shrink-0">{typeIcon[n.type] || 'ℹ️'}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{n.title}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const links = user?.role === 'Admin' ? adminLinks : employeeLinks;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  return (
    <div className="min-h-screen bg-background flex text-text-primary font-sans">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 flex flex-col py-6 px-4
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 px-4 flex items-center justify-between">
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
          <div className="mx-2 mb-4 px-3 py-2 bg-primary-50 rounded-xl flex items-center gap-2 border border-primary-100">
            <Shield className="w-3.5 h-3.5 text-plum-accent" />
            <span className="text-xs font-bold text-plum-accent">Administrator</span>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-grow space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.98] ${
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
        </nav>

        {/* User info & Logout at bottom */}
        <div className="mt-auto space-y-1.5 pt-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-background/60">
            <div className="w-8 h-8 rounded-full bg-plum flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
              <p className="text-[10px] text-text-secondary truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-error hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-6 justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-background active:scale-95"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Search bar inside header (Stitch theme) */}
          <div className="hidden lg:flex items-center gap-2 text-text-secondary bg-background px-4 py-1.5 rounded-full border border-border focus-within:border-primary transition-all">
            <Search className="w-4 h-4" />
            <input
              className="bg-transparent border-none focus:ring-0 text-xs w-64 text-text-primary placeholder:text-text-secondary outline-none"
              placeholder="Search directory, requests…"
              type="text"
            />
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <button className="text-text-secondary hover:bg-background p-2 rounded-full transition-all active:scale-95">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-border mx-1"></div>
            <button className="text-xs font-semibold text-text-secondary hover:text-plum-accent transition-colors">Support</button>
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-background transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-plum flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-dropdown border border-border z-50 animate-fade-in">
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                    <p className="text-[10px] font-bold text-plum-accent mt-0.5 uppercase tracking-wider">{user?.role}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
