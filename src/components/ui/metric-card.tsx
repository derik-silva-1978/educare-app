
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
  progress?: number;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = 'good',
  progress,
  description,
  onClick,
  className
}) => {
  const statusConfig = {
    excellent: {
      bg: 'from-green-500 to-emerald-600',
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-700 border-green-200'
    },
    good: {
      bg: 'from-blue-500 to-purple-600',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    warning: {
      bg: 'from-yellow-500 to-orange-600',
      text: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    critical: {
      bg: 'from-red-500 to-pink-600',
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg cursor-pointer group overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      <div className={`h-1 bg-gradient-to-r ${statusConfig[status].bg}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${statusConfig[status].bg} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <TrendIcon className={cn("h-3 w-3", statusConfig[status].text)} />
              <span className={cn("text-xs font-medium", statusConfig[status].text)}>
                {trendValue}
              </span>
            </div>
          )}
          
          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Progresso: {Math.round(progress)}%
              </p>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
