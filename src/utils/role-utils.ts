
import { UserRole } from '@/types/auth';

/**
 * Get the display name for a user role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch(role) {
    case 'teacher': return 'Professor';
    case 'admin': return 'Administrador';
    case 'therapist': return 'Terapeuta';
    case 'parent': return 'Responsável';
    case 'professional': return 'Profissional';
    case 'student': return 'Estudante';
    case 'guest': return 'Convidado';
    default: return 'Usuário';
  }
};

/**
 * Check if user has any of the specified roles
 */
export const hasUserRole = (userRole: UserRole | undefined | null, roles: UserRole | UserRole[]): boolean => {
  if (!userRole) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }
  
  return userRole === roles;
};
