import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import type { UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  redirectTo?: string;
  appType?: 'smart-pei' | 'educare-app';
  allowProfessional?: boolean;
}

/**
 * A wrapper component that protects routes from unauthorized access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo,
  appType = 'smart-pei',
  allowProfessional = false,
}) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();
  
  // Determine the correct redirect based on app type
  const getRedirectPath = () => {
    if (redirectTo) {
      return redirectTo;
    } else if (appType === 'educare-app') {
      return '/educare-app/auth?action=login';
    } else {
      return '/auth/login';
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Verificando autenticação...</span>
      </div>
    );
  }
  
  // If not authenticated, redirect to login - BUT PREVENT REDIRECT LOOPS
  if (!isAuthenticated) {
    // CRITICAL: Never add redirect parameters when already on auth page
    if (location.pathname.includes('/auth')) {
      return <>{children}</>;
    }
    
    // CRITICAL: Build redirect URL safely to prevent encoding loops
    const currentPath = location.pathname + location.search;
    
    // Only add redirect parameter for non-auth pages and keep it simple
    if (!currentPath.includes('/auth') && currentPath.length < 50) {
      const redirectPath = `${getRedirectPath()}?redirect=${encodeURIComponent(currentPath)}`;
      return <Navigate to={redirectPath} replace />;
    } else {
      // For problematic URLs, redirect to clean auth page
      return <Navigate to={getRedirectPath()} replace />;
    }
  }
  
  // If specific roles are required, check if the user has any of them
  if (requiredRoles && user) {
    // For Educare app admin check
    if (appType === 'educare-app' && 
        (requiredRoles === 'admin' || (Array.isArray(requiredRoles) && requiredRoles.includes('admin')))) {
      const isAdmin = user.role === 'admin';
      if (!isAdmin) {
        // Redirect to admin settings page for users trying to access admin areas
        return <Navigate to="/educare-app/settings" replace />;
      }
    }
    
    // Check for professional role restrictions
    const isProfessional = hasRole('professional');
    const isQuizRelatedRoute = location.pathname.includes('/quiz') || location.pathname.includes('/journey');
    
    // Redirect professionals away from quiz routes unless explicitly allowed
    if (isProfessional && isQuizRelatedRoute && !allowProfessional) {
      return <Navigate to="/educare-app/professional/dashboard" replace />;
    }
    
    // General role check
    if (Array.isArray(requiredRoles)) {
      if (!hasRole(requiredRoles)) {
        return <Navigate to="/access-denied" replace />;
      }
    } else {
      if (!hasRole(requiredRoles)) {
        return <Navigate to="/access-denied" replace />;
      }
    }
  }
  
  // User is authenticated and has required roles (if any)
  return <>{children}</>;
};

export default ProtectedRoute;
