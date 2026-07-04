import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingClass = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding];

  return (
    <div className={`card ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, icon }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: { value: number; label: string };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg = 'bg-primary-50', trend, subtitle }) => (
  <div className="stat-card animate-fade-in">
    <div className={`stat-icon ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-text-secondary font-medium truncate">{title}</p>
      <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
      {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
      {trend && (
        <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-success' : 'text-error'}`}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  </div>
);
