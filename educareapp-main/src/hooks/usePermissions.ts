
import { UserRole } from '@/types/auth';

export type Permission = 
  | 'read_assessments'
  | 'write_assessments'
  | 'delete_assessments'
  | 'manage_students'
  | 'view_reports'
  | 'manage_users'
  | 'system_admin'
  | 'license.view'
  | 'license.create'
  | 'license.edit'
  | 'license.delete'
  | 'license.assign'
  | 'license.validate'
  | 'team.view'
  | 'team.create'
  | 'team.edit'
  | 'team.delete'
  | 'user.view'
  | 'user.create'
  | 'user.edit'
  | 'user.delete'
  | 'report.view'
  | 'report.generate'
  | 'student.view'
  | 'student.create'
  | 'student.edit'
  | 'student.delete'
  | 'assessment.view'
  | 'assessment.create'
  | 'assessment.edit'
  | 'assessment.delete';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'read_assessments',
    'write_assessments', 
    'delete_assessments',
    'manage_students',
    'view_reports',
    'manage_users',
    'system_admin',
    'license.view',
    'license.create',
    'license.edit',
    'license.delete',
    'license.assign',
    'license.validate',
    'team.view',
    'team.create',
    'team.edit',
    'team.delete',
    'user.view',
    'user.create',
    'user.edit',
    'user.delete',
    'report.view',
    'report.generate',
    'student.view',
    'student.create',
    'student.edit',
    'student.delete',
    'assessment.view',
    'assessment.create',
    'assessment.edit',
    'assessment.delete'
  ],
  manager: [
    'read_assessments',
    'write_assessments',
    'manage_students',
    'view_reports',
    'team.view',
    'team.create',
    'team.edit',
    'user.view',
    'report.view',
    'report.generate',
    'student.view',
    'student.create',
    'student.edit',
    'assessment.view',
    'assessment.create',
    'assessment.edit'
  ],
  coordinator: [
    'read_assessments',
    'write_assessments',
    'manage_students',
    'view_reports',
    'team.view',
    'student.view',
    'student.create',
    'student.edit',
    'assessment.view',
    'assessment.create',
    'assessment.edit'
  ],
  teacher: [
    'read_assessments',
    'write_assessments',
    'manage_students',
    'view_reports',
    'student.view',
    'student.create',
    'student.edit',
    'assessment.view',
    'assessment.create'
  ],
  specialist: [
    'read_assessments',
    'write_assessments',
    'view_reports',
    'student.view',
    'assessment.view',
    'assessment.create'
  ],
  psychologist: [
    'read_assessments',
    'write_assessments',
    'view_reports',
    'student.view',
    'assessment.view',
    'assessment.create'
  ],
  therapist: [
    'read_assessments',
    'write_assessments',
    'view_reports',
    'student.view',
    'assessment.view'
  ],
  professional: [
    'read_assessments',
    'write_assessments',
    'view_reports',
    'student.view',
    'assessment.view'
  ],
  parent: [
    'read_assessments',
    'student.view'
  ],
  student: [
    'read_assessments'
  ],
  guest: []
};

export const hasRole = (userRole: UserRole | null, requiredRoles: UserRole | UserRole[]): boolean => {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    coordinator: 'Coordenador',
    teacher: 'Professor',
    specialist: 'Especialista',
    psychologist: 'Psicólogo',
    therapist: 'Terapeuta',
    professional: 'Profissional',
    parent: 'Responsável',
    student: 'Estudante',
    guest: 'Visitante'
  };
  
  return roleNames[role] || 'Usuário';
};

export const usePermissions = () => {
  const hasPermission = (permission: Permission): boolean => {
    // This would typically get the current user from context
    // For now, return true as a placeholder
    return true;
  };

  return {
    hasPermission,
    ROLE_PERMISSIONS,
    hasRole,
    getRoleName
  };
};

export default usePermissions;
