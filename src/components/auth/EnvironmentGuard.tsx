
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { AppEnvironment, useRoleSystem } from '@/hooks/useRoleSystem';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface EnvironmentGuardProps {
  children: React.ReactNode;
  environment: AppEnvironment;
  fallbackPath?: string;
}

/**
 * Component that restricts access to specific app environments based on user roles
 */
const EnvironmentGuard: React.FC<EnvironmentGuardProps> = ({
  children,
  environment,
  fallbackPath = '/access-denied',
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canAccessEnvironment } = useRoleSystem();
  const location = useLocation();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const hasAccess = await canAccessEnvironment(environment);
        setIsAuthorized(hasAccess);
      } catch (error) {
        console.error('Error checking environment access:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      checkAccess();
    }
  }, [isAuthenticated, environment, authLoading, canAccessEnvironment]);
  
  // Show loading state while checking
  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Checking access permissions...</span>
      </div>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after successful login
    const currentPath = encodeURIComponent(location.pathname + location.search);
    const redirectPath = `/auth/login?redirect=${currentPath}`;
    return <Navigate to={redirectPath} replace />;
  }
  
  // Not authorized
  if (isAuthorized === false) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Authorized
  return <>{children}</>;
};

export default EnvironmentGuard;
