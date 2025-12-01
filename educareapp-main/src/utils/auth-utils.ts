
import { UserRole } from '@/types/auth';
import type { User } from '@/types/auth';

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

export const isHigherRole = (userRole: UserRole, compareRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 10,
    manager: 8,
    coordinator: 6,
    teacher: 5,
    specialist: 4,
    psychologist: 4,
    therapist: 3,
    professional: 2,
    parent: 1,
    student: 1,
    guest: 0
  };
  
  return roleHierarchy[userRole] > roleHierarchy[compareRole];
};

export const createDemoUser = (userData: Partial<User>): User => {
  return {
    id: userData.id || Date.now().toString(),
    name: userData.name || 'Demo User',
    email: userData.email || 'demo@example.com',
    role: userData.role || 'guest',
    ...userData
  } as User;
};
