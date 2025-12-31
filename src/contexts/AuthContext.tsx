
import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { UserRole, User } from '@/types/auth';
import type { PhoneLoginResult } from '@/services/api/authService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  signUp: (name: string, email: string, password: string, role?: UserRole, agreeTerms?: boolean) => Promise<User | null>;
  signOut: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  getRoleName: (role: UserRole) => string;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<User | null>;
  logout: () => Promise<void>;
  handleLogin: (email: string, password: string, rememberMe?: boolean) => Promise<User | null>;
  handleRegister: (name: string, email: string, password: string, role: UserRole, agreeTerms: boolean, phone?: string, plan_id?: string) => Promise<User | null>;
  handleLogout: () => Promise<void>;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  handleSendPhoneVerification: (phone: string) => Promise<boolean>;
  handleVerifyPhoneCode: (phone: string, code: string) => Promise<User | null>;
  handleLoginByPhone: (phone: string) => Promise<PhoneLoginResult>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
