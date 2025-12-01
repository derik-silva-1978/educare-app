import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  badge,
  actions,
  children
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
          {Icon && <Icon className={`h-6 w-6 md:h-8 md:w-8 mr-3 ${iconColor}`} />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {badge && (
          <Badge 
            variant={badge.variant || 'secondary'} 
            className={badge.className || 'bg-primary/10 text-primary dark:bg-primary/20'}
          >
            {badge.label}
          </Badge>
        )}
        {actions}
        {children}
      </div>
    </div>
  );
}

export default AdminPageHeader;
