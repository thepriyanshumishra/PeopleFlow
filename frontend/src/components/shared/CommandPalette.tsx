import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search, LayoutDashboard, Clock, CalendarDays, DollarSign, User,
  Users, Building2, Bell, BarChart3, Globe, Settings, HelpCircle,
  Brain, FileText, ChevronRight, X, Sparkles, Bug, Play
} from 'lucide-react';
import { employeesApi } from '@/api/endpoints';
import { useUiStore } from '@/stores/uiStore';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  action?: () => void;
  group: string;
  adminOnly?: boolean;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function CommandPalette({ open, onClose, isAdmin }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { setBugReport, startOnboarding } = useUiStore();

  // Fetch employees matching the query when the user types
  const { data: searchEmployees = [] } = useQuery({
    queryKey: ['search-employees', query],
    queryFn: () =>
      employeesApi.getAll({ search: query, limit: '5' }).then((r) => r.data.data || []),
    enabled: open && query.length >= 2,
  });

  const staticCommands: CommandItem[] = [
    // Navigation Pages
    { id: 'dashboard', label: 'Dashboard', description: 'Overview of your HR stats', icon: LayoutDashboard, to: '/dashboard', group: 'Pages' },
    { id: 'attendance', label: 'Attendance', description: 'Check in / check out', icon: Clock, to: '/attendance', group: 'Pages' },
    { id: 'leave', label: 'Time Off', description: 'Apply for leave', icon: CalendarDays, to: '/leave', group: 'Pages' },
    { id: 'payroll', label: 'Payroll', description: 'View your pay slips', icon: DollarSign, to: '/payroll', group: 'Pages' },
    { id: 'profile', label: 'My Profile', description: 'Edit your profile', icon: User, to: '/profile', group: 'Pages' },
    { id: 'notifications', label: 'Notifications', description: 'View all notifications', icon: Bell, to: '/notifications', group: 'Pages' },
    { id: 'directory', label: 'Directory', description: 'Browse company directory', icon: Globe, to: '/directory', group: 'Pages' },
    { id: 'calendar', label: 'Calendar', description: 'View leave & attendance calendar', icon: CalendarDays, to: '/calendar', group: 'Pages' },
    
    // Quick Actions
    {
      id: 'onboarding-tour',
      label: 'Restart Onboarding Tour',
      description: 'Take the step-by-step walkthrough again',
      icon: Sparkles,
      action: () => {
        startOnboarding();
        onClose();
      },
      group: 'Quick Actions',
    },
    {
      id: 'report-bug-action',
      label: 'Report a Bug',
      description: 'Log an issue directly with support',
      icon: Bug,
      action: () => {
        // Toggle bug tab inside help overlay
        useUiStore.getState().setHelpOverlay(true);
        onClose();
      },
      group: 'Quick Actions',
    },

    // Admin Tools
    { id: 'analytics', label: 'Analytics', description: 'HR insights and charts', icon: BarChart3, to: '/analytics', group: 'Admin Tools', adminOnly: true },
    { id: 'reports', label: 'Reports', description: 'Generate downloadable reports', icon: FileText, to: '/reports', group: 'Admin Tools', adminOnly: true },
    { id: 'ai', label: 'AI Insights', description: 'AI-powered HR analysis', icon: Brain, to: '/ai', group: 'Admin Tools', adminOnly: true },
    { id: 'employees-admin', label: 'Employee Registry', description: 'Manage employee profiles', icon: Users, to: '/admin/employees', group: 'Admin Tools', adminOnly: true },
    { id: 'departments', label: 'Departments Board', description: 'Manage departments', icon: Building2, to: '/admin/departments', group: 'Admin Tools', adminOnly: true },
    
    // Settings & FAQ
    { id: 'settings', label: 'Settings', description: 'App preferences', icon: Settings, to: '/settings', group: 'General' },
    { id: 'help', label: 'Help Center', description: 'FAQs and support', icon: HelpCircle, to: '/help', group: 'General' },
  ];

  const filteredStatic = staticCommands.filter((cmd) => {
    if (cmd.adminOnly && !isAdmin) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.description ?? '').toLowerCase().includes(q)
    );
  });

  // Map employee matches into commands
  const employeeCommands: CommandItem[] = searchEmployees.map((emp: any) => ({
    id: `emp-${emp.id}`,
    label: `${emp.firstName} ${emp.lastName}`,
    description: `${emp.designation || 'Employee'} · ${emp.department?.name || 'Staff'}`,
    icon: User,
    to: isAdmin ? `/admin/employees/${emp.id}` : `/directory`,
    group: 'Employees Found',
  }));

  const combinedCommands = [...employeeCommands, ...filteredStatic];
  const groups = [...new Set(combinedCommands.map((c) => c.group))];

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (cmd: CommandItem) => {
    if (cmd.to) {
      navigate(cmd.to);
    } else if (cmd.action) {
      cmd.action();
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-modal w-full max-w-xl border border-border animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, active employees, quick actions…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-background text-text-secondary">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {combinedCommands.length === 0 ? (
            <p className="text-center text-text-secondary text-sm py-8">No results found</p>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <p className="px-4 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-background/30 border-y border-border/20">
                  {group}
                </p>
                {combinedCommands
                  .filter((c) => c.group === group)
                  .map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-background transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 group-hover:bg-primary-50 transition-colors">
                          <Icon className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{cmd.label}</p>
                          {cmd.description && (
                            <p className="text-xs text-text-secondary truncate">{cmd.description}</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-border group-hover:text-text-secondary transition-colors flex-shrink-0" />
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-background/50">
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <kbd className="px-1.5 py-0.5 rounded bg-border text-text-secondary text-[10px] font-mono">↵</kbd> select
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <kbd className="px-1.5 py-0.5 rounded bg-border text-text-secondary text-[10px] font-mono">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
