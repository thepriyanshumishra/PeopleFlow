import React from 'react';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'orange' | 'blue' | 'gray' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', dot = false, className = '' }) => {
  const variantClass = `badge-${variant}`;

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block bg-current`} />
      )}
      {children}
    </span>
  );
};

// Predefined status badges
export const getAttendanceStatusBadge = (status: string): React.ReactNode => {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    Present: { variant: 'green', label: 'Present' },
    Absent: { variant: 'red', label: 'Absent' },
    'Half Day': { variant: 'yellow', label: 'Half Day' },
    Leave: { variant: 'blue', label: 'On Leave' },
    Late: { variant: 'orange', label: 'Late' },
  };

  const config = map[status] || { variant: 'gray' as BadgeVariant, label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
};

export const getLeaveStatusBadge = (status: string): React.ReactNode => {
  const map: Record<string, { variant: BadgeVariant }> = {
    Pending: { variant: 'orange' },
    Approved: { variant: 'green' },
    Rejected: { variant: 'red' },
  };

  const config = map[status] || { variant: 'gray' as BadgeVariant };
  return <Badge variant={config.variant} dot>{status}</Badge>;
};

export const getPriorityBadge = (priority: string): React.ReactNode => {
  const map: Record<string, { variant: BadgeVariant }> = {
    High: { variant: 'red' },
    Medium: { variant: 'orange' },
    Low: { variant: 'green' },
  };

  const config = map[priority] || { variant: 'gray' as BadgeVariant };
  return <Badge variant={config.variant}>{priority}</Badge>;
};
