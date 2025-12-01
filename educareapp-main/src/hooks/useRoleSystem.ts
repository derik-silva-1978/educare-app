
import { useState, useEffect } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import type { Role, AppEnvironment, RoleInfo, EnvironmentInfo } from '@/types/role-system';

// Use export type for re-exporting types
export type { Role, AppEnvironment, RoleInfo, EnvironmentInfo };

export const useRoleSystem = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [userRoles, setUserRoles] = useState<RoleInfo[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For simplified scope, return default/placeholder data
  useEffect(() => {
    setIsLoading(false);
    
    // Set default roles based on user metadata for backward compatibility
    if (user?.role) {
      const defaultRole: RoleInfo = {
        id: '1',
        name: user.role as Role,
        description: `User with ${user.role} role`,
        rank: 1,
        isSystemRole: false
      };
      setRoles([defaultRole]);
      setUserRoles([defaultRole]);
    }
  }, [user]);

  // Check if user has specific role
  const hasRole = (roleName: Role | Role[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role;
    if (!userRole) return false;
    
    if (Array.isArray(roleName)) {
      return roleName.includes(userRole as Role);
    } else {
      return userRole === roleName;
    }
  };

  // Check if user can access a specific environment
  const canAccessEnvironment = async (envSlug: AppEnvironment): Promise<boolean> => {
    if (!user?.id) return false;
    return true; // For simplified scope, allow access
  };

  // Placeholder functions for role assignment
  const assignRole = async (userId: string, roleName: Role) => {
    return { success: false, error: 'Role assignment not implemented in simplified scope' };
  };

  const removeRole = async (userId: string, roleName: Role) => {
    return { success: false, error: 'Role removal not implemented in simplified scope' };
  };

  return {
    roles,
    userRoles,
    environments,
    isLoading,
    error,
    hasRole,
    canAccessEnvironment,
    assignRole,
    removeRole
  };
};

export default useRoleSystem;
