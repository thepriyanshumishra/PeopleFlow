import {
  FileQuestion, SearchX, AlertTriangle, Inbox, Users, BarChart3,
  Calendar, Clock, Landmark, Building2, FileText, FolderClosed,
  Sparkles, LucideIcon
} from 'lucide-react';

export type EmptyVariant =
  | 'default'
  | 'search'
  | 'error'
  | 'notifications'
  | 'employees'
  | 'analytics'
  | 'calendar'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'departments'
  | 'reports'
  | 'documents'
  | 'ai';

const variants: Record<EmptyVariant, {
  icon: LucideIcon;
  defaultTitle: string;
  defaultDesc: string;
  color: string;
  bg: string;
}> = {
  default: {
    icon: FileQuestion,
    defaultTitle: 'Nothing here yet',
    defaultDesc: 'There is no data to display at this time.',
    color: 'text-text-secondary',
    bg: 'bg-background',
  },
  search: {
    icon: SearchX,
    defaultTitle: 'No results found',
    defaultDesc: 'Try adjusting your search query or filters to discover matching records.',
    color: 'text-text-secondary',
    bg: 'bg-background',
  },
  error: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultDesc: 'We could not fetch or load this data. Please verify your connection.',
    color: 'text-error',
    bg: 'bg-red-50',
  },
  notifications: {
    icon: Inbox,
    defaultTitle: 'You\'re all caught up!',
    defaultDesc: 'No new notifications right now. We\'ll let you know when something happens.',
    color: 'text-plum-accent',
    bg: 'bg-primary-50',
  },
  employees: {
    icon: Users,
    defaultTitle: 'No employees registered',
    defaultDesc: 'No team members are in this directory yet. Let\'s build the workspace team!',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  analytics: {
    icon: BarChart3,
    defaultTitle: 'Analytics waiting for data',
    defaultDesc: 'Once check-ins, leave, and payroll activity commence, full visual stats will appear here.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  calendar: {
    icon: Calendar,
    defaultTitle: 'No calendar events',
    defaultDesc: 'There are no leave requests, holidays, or attendance events registered for this range.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  attendance: {
    icon: Clock,
    defaultTitle: 'No attendance records today',
    defaultDesc: 'You haven\'t checked in yet today. Tap below to log your start time.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  leave: {
    icon: Calendar,
    defaultTitle: 'No leave applications',
    defaultDesc: 'You haven\'t submitted any leave requests yet. Need some time off? Apply here.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  payroll: {
    icon: Landmark,
    defaultTitle: 'No pay slips available',
    defaultDesc: 'Pay slips appear here once payroll boards generate and release monthly salary slips.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  departments: {
    icon: Building2,
    defaultTitle: 'No departments created',
    defaultDesc: 'Departments help organize leaves, headcount, and reporting lines. Create one to start.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  reports: {
    icon: FileText,
    defaultTitle: 'No reports generated yet',
    defaultDesc: 'Set a date filter and select dynamic report templates to generate CSV downloads.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  documents: {
    icon: FolderClosed,
    defaultTitle: 'No document folders yet',
    defaultDesc: 'Upload identity, salary receipts, certificates, or forms to keep them in one secure hub.',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
  },
  ai: {
    icon: Sparkles,
    defaultTitle: 'AI Insights are getting ready',
    defaultDesc: 'Gemini AI compiles insights from organizational activity logs. Generate summaries to start.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
};

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  compact?: boolean;
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  action,
  secondaryAction,
  compact,
}: EmptyStateProps) {
  const v = variants[variant] || variants.default;
  const Icon = v.icon;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8 px-4' : 'py-16 px-6'} animate-fade-in`}>
      {/* Decorative Odoo-inspired circular container */}
      <div className={`w-16 h-16 rounded-2xl ${v.bg} flex items-center justify-center mb-5 ring-4 ring-white shadow-sm border border-border`}>
        <Icon className={`w-8 h-8 ${v.color}`} strokeWidth={1.5} />
      </div>

      {/* Title with slightly playful handwritten vibe or display font */}
      <h3 className="text-base font-bold text-text-primary mb-2 tracking-tight">
        {title ?? v.defaultTitle}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-secondary max-w-sm leading-relaxed mb-6">
        {description ?? v.defaultDesc}
      </p>

      {/* Action Buttons */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
