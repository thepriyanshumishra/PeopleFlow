import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Settings, Shield, LogOut, ArrowRight, HelpCircle, Building } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { authApi } from '@/api/endpoints';
import toast from 'react-hot-toast';

export function ProfileDrawer() {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isProfileDrawerOpen, setProfileDrawer } = useUiStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    setProfileDrawer(false);
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isProfileDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement;
        if (target.closest('.relative.ml-2')) return; // Avoid toggle click
        setProfileDrawer(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isProfileDrawerOpen, setProfileDrawer]);

  if (!isProfileDrawerOpen || !user) return null;

  const initials = user.employee
    ? `${user.employee.firstName[0]}${user.employee.lastName[0]}`
    : user.email[0].toUpperCase() || 'U';

  const displayName = user.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user.email;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setProfileDrawer(false)}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative w-screen max-w-sm bg-surface h-full flex flex-col shadow-2xl border-l border-border animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background/30">
          <h2 className="text-base font-bold text-text-primary">My Profile</h2>
          <button
            type="button"
            onClick={() => setProfileDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-background transition-colors text-text-secondary hover:text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Close Profile Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-6 py-8 border-b border-border text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-plum ring-4 ring-primary-100 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {initials}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-text-primary truncate">{displayName}</h3>
            <p className="text-xs text-text-secondary truncate">{user.email}</p>
          </div>

          <div className="flex justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-plum-accent text-xs font-bold rounded-full border border-primary-100">
              <Shield size={12} />
              {user.role}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            type="button"
            onClick={() => {
              navigate('/profile');
              setProfileDrawer(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold text-text-secondary hover:bg-background hover:text-text-primary transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <User size={16} />
            </div>
            <span className="flex-grow">My Workspace Profile</span>
            <ArrowRight size={14} className="text-border group-hover:text-text-secondary transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/settings');
              setProfileDrawer(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold text-text-secondary hover:bg-background hover:text-text-primary transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <Settings size={16} />
            </div>
            <span className="flex-grow">Account Settings</span>
            <ArrowRight size={14} className="text-border group-hover:text-text-secondary transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/help');
              setProfileDrawer(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold text-text-secondary hover:bg-background hover:text-text-primary transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <HelpCircle size={16} />
            </div>
            <span className="flex-grow">Help & Shortcuts</span>
            <ArrowRight size={14} className="text-border group-hover:text-text-secondary transition-colors" />
          </button>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-border bg-background/30">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-error bg-red-50 hover:bg-red-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
          >
            <LogOut size={16} />
            Log Out of PeopleFlow
          </button>
        </div>
      </div>
    </div>
  );
}
