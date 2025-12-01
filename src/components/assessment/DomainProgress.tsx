
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { DomainProgress as DomainProgressType, DomainLabels, DevelopmentDomain } from '@/types/assessment';

interface DomainProgressProps {
  progress: DomainProgressType;
}

export const DomainProgress: React.FC<DomainProgressProps> = ({ progress }) => {
  // Helper function to get color for domain
  const getDomainColor = (domain: DevelopmentDomain): string => {
    const colors: Record<string, string> = {
      motor: 'text-orange-500',
      cognitive: 'text-purple-500',
      language: 'text-red-500',
      social: 'text-indigo-500',
      adaptive: 'text-yellow-500',
      emotional: 'text-pink-500',
      communication: 'text-blue-500',
      social_emotional: 'text-pink-500',
      self_care: 'text-green-500',
      maternal_health: 'text-cyan-500',
      sensory: 'text-lime-500'
    };
    
    return colors[domain] || 'text-gray-500';
  };
  
  const isComplete = progress.completed !== undefined 
    ? progress.completed === progress.total
    : progress.progress === 100;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getDomainColor(progress.domain)}`}>
          {DomainLabels[progress.domain]}
        </span>
        <span className="text-xs text-muted-foreground">
          {progress.score}% score
          {progress.completed !== undefined && (
            <span className="ml-1">({progress.completed}/{progress.total})</span>
          )}
        </span>
      </div>
      <Progress 
        value={progress.progress} 
        className={`h-1.5 ${isComplete ? 'bg-muted/50' : 'bg-muted/20'}`}
      />
    </div>
  );
};

export default DomainProgress;
