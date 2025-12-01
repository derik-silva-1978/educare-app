
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend,
  trendValue,
  className
}) => {
  const statusConfig = {
    excellent: {
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      icon: 'bg-emerald-500 text-white',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    good: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      icon: 'bg-blue-500 text-white',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    warning: {
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      border: 'border-yellow-300',
      icon: 'bg-yellow-500 text-white',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    critical: {
      bg: 'bg-gradient-to-br from-red-50 to-pink-50',
      border: 'border-red-300',
      icon: 'bg-red-500 text-white',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800'
    }
  };

  const config = statusConfig[status];

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md border-2",
      config.bg,
      config.border,
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2 rounded-lg", config.icon)}>
            <Icon className="h-4 w-4" />
          </div>
          {trend && (
            <Badge variant="outline" className={config.badge}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
