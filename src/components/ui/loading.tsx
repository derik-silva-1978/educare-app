
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    'xs': 'h-3 w-3',
    'sm': 'h-4 w-4',
    'md': 'h-6 w-6',
    'lg': 'h-8 w-8'
  };

  return (
    <div className="flex items-center">
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          className
        )}
      />
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
};

// Add the Loading component for backwards compatibility
export const Loading: React.FC<SpinnerProps> = (props) => {
  return <Spinner {...props} />;
};

// Add the FullPageLoading component which was referenced
export const FullPageLoading: React.FC<{ message?: string }> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};
