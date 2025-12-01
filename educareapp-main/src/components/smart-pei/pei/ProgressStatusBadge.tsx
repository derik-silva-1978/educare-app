
import React from 'react';
import { PEIProgress } from '@/hooks/usePEI';
import { cn } from '@/lib/utils';
import { getStatusColor, getStatusIcon, getStatusLabel } from './timeline/timelineUtils';

interface ProgressStatusBadgeProps {
  status: PEIProgress['status'];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export const ProgressStatusBadge: React.FC<ProgressStatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  className = '',
  animated = false
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm'
  };
  
  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5'
  };
  
  const getIcon = () => {
    const Icon = getStatusIcon(status);
    return React.cloneElement(Icon as React.ReactElement, {
      className: `${iconSizes[size]} ${animated ? 'animate-pulse' : ''}`
    });
  };
  
  // Determine color class for the badge based on status
  const getStatusClasses = () => {
    switch (status) {
      case 'regression':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'no_change':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'minor_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'significant_progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'achieved':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  
  return (
    <div
      className={cn(
        `inline-flex items-center gap-1 rounded-full font-medium transition-all duration-300
        ${sizeClasses[size]} ${getStatusClasses()} border
        ${animated && status === 'significant_progress' ? 'shadow-sm shadow-primary/20' : ''}
        ${animated ? 'hover:scale-105' : ''}`,
        className
      )}
      role="status"
      aria-label={`Progresso: ${getStatusLabel(status)}`}
    >
      {getIcon()}
      {showLabel && (
        <span 
          className={`${animated ? 'animate-fade-in' : ''} transition-all duration-300`}
        >
          {getStatusLabel(status)}
        </span>
      )}
    </div>
  );
};

export default ProgressStatusBadge;
