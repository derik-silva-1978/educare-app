
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'teacher' | 'therapist' | 'coordinator' | 'parent' | 'student' | 'guest' | 'specialist' | 'psychologist' | 'professional' | 'manager' | 'owner';

export interface User {
  id: string;
  uid?: string; // For compatibility with some components
  name: string;
  displayName?: string; // For compatibility with some components
  email: string;
  photoURL?: string;
  avatar?: string; // Added for compatibility with dropdown and profile components
  role: UserRole;
  isEmailVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  organizationId?: string;
  active?: boolean;
  profile?: UserProfile;
  plan?: UserPlan; // Added for showing subscription plan information
  accessLevel?: 'basic' | 'premium' | 'enterprise'; // Added for indicating access level
}

export interface UserProfile {
  avatar?: string;
  title?: string;
  organization?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface UserPlan {
  name: string;
  level: 'basic' | 'premium' | 'enterprise';
  expiresAt?: string;
  features?: string[];
  maxStudents?: number;
  maxAssessments?: number;
}

export interface AuthContextType {
  user: User | null;
  currentUser: User | null; // For backward compatibility
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loading: boolean; // For backward compatibility
  error: string | null;
  isAuthenticated: boolean;
  
  // Additional properties used in components
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  getRoleName: (role: UserRole) => string;
  handleLogin: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  handleRegister: (name: string, email: string, password: string, role: UserRole, agreeTerms: boolean) => Promise<User | null>;
  handleLogout: () => void;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  
  // Phone verification methods
  handleSendPhoneVerification: (phone: string) => Promise<boolean>;
  handleVerifyPhoneCode: (phone: string, code: string) => Promise<User | null>;
  
  // Add these methods to match with useSupabaseAuth
  signIn?: (email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  signUp?: (name: string, email: string, password: string, role?: UserRole, agreeTerms?: boolean) => Promise<User | null>;
  signOut?: () => Promise<void>;
  session?: Record<string, unknown> | null;
}

// Export Permission type from usePermissions.ts
export type { Permission } from '@/hooks/usePermissions';

// Re-export ROLE_PERMISSIONS from usePermissions instead of duplicating it
export { ROLE_PERMISSIONS } from '@/hooks/usePermissions';
