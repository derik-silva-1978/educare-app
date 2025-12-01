
/**
 * Role system type definitions for the application
 */

// Basic role types
export type Role = 'super_admin' | 'admin' | 'professional' | 'parent' | 'teacher' | 'therapist' | 'guest';
export type AppEnvironment = 'super-admin' | 'admin' | 'professional' | 'parent' | 'public';

// Role information interface
export interface RoleInfo {
  id: string;
  name: string;
  description: string | null;
  rank: number;
  isSystemRole: boolean;
}

// Environment information interface
export interface EnvironmentInfo {
  id: string;
  name: string;
  description: string | null;
  slug: AppEnvironment;
  accessLevel: number;
}

// Role assignment response interface
export interface RoleAssignmentResponse {
  success: boolean;
  error?: string;
}
