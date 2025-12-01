import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface EnhancedProgressBarProps {
  value: number;
  className?: string;
  showPercent?: boolean;
  height?: 'sm' | 'md' | 'lg';
  colorScheme?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'gradient';
}

const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  value,
  className,
  showPercent = false,
  height = 'md',
  colorScheme = 'default',
}) => {
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[height];
  
  const getColorClass = () => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'amber':
        return 'bg-amber-500';
      case 'red':
        return 'bg-red-500';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="relative w-full">
      <Progress 
        value={value} 
        className={cn(heightClass, className)}
        indicatorClassName={getColorClass()}
      />
      
      {showPercent && (
        <div className="absolute right-0 -top-6 text-xs font-medium">
          {value}%
        </div>
      )}
    </div>
  );
};

export default EnhancedProgressBar;
