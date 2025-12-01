
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ProgressMeterProps {
  title?: string;
  value: number;
  total?: number;
  percentage?: number;
  showValue?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'default' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({
  title = 'Progresso',
  value = 0,
  total = 100,
  percentage,
  showValue = true,
  isLoading = false,
  size = 'md',
  colorScheme = 'default',
  icon
}) => {
  // Calculate percentage if not provided
  const progressPercentage = percentage !== undefined 
    ? percentage 
    : total > 0 ? Math.round((value / total) * 100) : 0;
  
  // Determine height based on size
  const progressHeight = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2';
  
  // Determine color based on colorScheme
  const getProgressColor = () => {
    switch (colorScheme) {
      case 'success': return 'bg-green-600';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  };
  
  const progressColor = getProgressColor();
  
  // Default icon based on colorScheme
  const getDefaultIcon = () => {
    switch (colorScheme) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning': return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'info': return <BarChart className="h-5 w-5 text-blue-500" />;
      default: return <BarChart className="h-5 w-5 text-primary" />;
    }
  };
  
  const displayIcon = icon || getDefaultIcon();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {displayIcon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-2 w-full bg-slate-200 rounded"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {showValue && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">
                  {value} de {total}
                </span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
            )}
            
            <Progress 
              value={progressPercentage}
              className={`${progressHeight} bg-slate-200`}
              indicatorClassName={progressColor}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressMeter;
