
import React, { Suspense, ComponentType, PropsWithRef, PropsWithoutRef, RefAttributes } from 'react';
import { Spinner } from '@/components/ui/loading';

interface LazyLoadWrapperProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

// Legacy loader spinner component for backward compatibility
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center items-center p-8 ${className}`}>
    <Spinner size="md" />
  </div>
);

// Skeleton loader for content placeholders
export const SkeletonLoader: React.FC<{ 
  height?: string; 
  width?: string;
  className?: string;
}> = ({ 
  height = 'h-16', 
  width = 'w-full',
  className = '' 
}) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} skeleton-pulse ${className}`}></div>
);

// Default fallback component
const DefaultFallback = () => (
  <Spinner size="md" />
);

// LazyLoadWrapper for suspense boundaries
export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  fallback = <DefaultFallback />,
  children 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Helper function to create lazy loaded components
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent: React.ReactNode = <Spinner size="md" />
) {
  const LazyComponent = React.lazy(importFn);
  
  // Fixed the TypeScript error by using a proper type assertion
  return (props: P) => (
    <Suspense fallback={LoadingComponent}>
      <LazyComponent {...props as any} />
    </Suspense>
  );
}

export default LazyLoadWrapper;
