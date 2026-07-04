import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'gray' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

// Attendance status badge
export function getAttendanceStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    Present:  { label: 'Present', variant: 'green' },
    Late:     { label: 'Late', variant: 'orange' },
    'Half Day': { label: 'Half Day', variant: 'yellow' },
    Leave:    { label: 'On Leave', variant: 'blue' },
    Absent:   { label: 'Absent', variant: 'red' },
    Holiday:  { label: 'Holiday', variant: 'purple' },
    Weekend:  { label: 'Weekend', variant: 'gray' },
  };
  const cfg = map[status] || { label: status, variant: 'gray' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// Leave request status badge
export function getLeaveStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    Pending:  { label: 'Pending', variant: 'yellow' },
    Approved: { label: 'Approved', variant: 'green' },
    Rejected: { label: 'Rejected', variant: 'red' },
    Cancelled:{ label: 'Cancelled', variant: 'gray' },
  };
  const cfg = map[status] || { label: status, variant: 'gray' as const };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// AI priority badge
export function getPriorityBadge(priority: string) {
  const map: Record<string, { variant: BadgeProps['variant'] }> = {
    High:   { variant: 'red' },
    Medium: { variant: 'orange' },
    Low:    { variant: 'green' },
  };
  const cfg = map[priority] || { variant: 'gray' as const };
  return <Badge variant={cfg.variant}>AI: {priority}</Badge>;
}
