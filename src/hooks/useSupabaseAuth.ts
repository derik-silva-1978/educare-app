
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, UserRole, UserPlan } from '@/types/auth';
import { getRoleName } from '@/utils/auth-utils';

export interface SupabaseAuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  handleLogin: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  handleRegister: (name: string, email: string, password: string, role: UserRole, agreeTerms: boolean) => Promise<any>;
  handleLogout: () => void;
  showUserDropdown: boolean;
  setShowUserDropdown: (show: boolean) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  getRoleName: (role: UserRole) => string;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

// Helper function to convert Supabase User to our User type
const convertSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || 'User',
    email: supabaseUser.email || '',
    role: (supabaseUser.user_metadata?.role as UserRole) || 'guest',
    avatar: supabaseUser.user_metadata?.avatar,
    accessLevel: supabaseUser.user_metadata?.accessLevel || 'basic',
    plan: supabaseUser.user_metadata?.plan as UserPlan
  };
};

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // For compatibility with existing components
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setCurrentUser(convertSupabaseUser(currentSession?.user ?? null));
        setIsAuthenticated(!!currentSession?.user);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setCurrentUser(convertSupabaseUser(currentSession?.user ?? null));
      setIsAuthenticated(!!currentSession?.user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Compatibility methods for existing components
  const handleLogin = async (email: string, password: string, rememberMe: boolean = false) => {
    const data = await signIn(email, password);
    return convertSupabaseUser(data.user);
  };

  const handleRegister = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    agreeTerms: boolean
  ) => {
    if (!agreeTerms) {
      throw new Error("You must agree to the terms and conditions");
    }
    
    const data = await signUp(email, password, { name, role });
    return convertSupabaseUser(data.user);
  };

  const handleLogout = async () => {
    await signOut();
    setShowUserDropdown(false);
  };

  // Role checking utility
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const userRole = (user.user_metadata?.role as UserRole) || 'guest';
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    
    return roles === userRole;
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUser) {
        return false;
      }
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated,
    currentUser,
    signIn,
    signUp,
    signOut,
    handleLogin,
    handleRegister,
    handleLogout,
    showUserDropdown,
    setShowUserDropdown,
    hasRole,
    getRoleName,
    updateProfile,
  };
};

export default useSupabaseAuth;
