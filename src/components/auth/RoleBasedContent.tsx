
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import type { UserRole } from '@/types/auth';

interface RoleBasedContentProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that only renders its children if the current user has the required role(s)
 */
const RoleBasedContent: React.FC<RoleBasedContentProps> = ({ 
  roles, 
  children, 
  fallback = null
}) => {
  const { hasRole, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (hasRole(roles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default RoleBasedContent;
