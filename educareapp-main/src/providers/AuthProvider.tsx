import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { AuthContextType } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS } from '@/hooks/usePermissions';
import type { Permission, UserRole, User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Supabase User to our custom User interface
const convertSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  const metadata = supabaseUser.user_metadata || {};
  
  return {
    id: supabaseUser.id,
    uid: supabaseUser.id,
    name: metadata.name || metadata.full_name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'User',
    displayName: metadata.name || metadata.full_name || `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || 'User',
    email: supabaseUser.email || '',
    photoURL: metadata.avatar || metadata.avatar_url,
    avatar: metadata.avatar || metadata.avatar_url,
    role: (metadata.role as UserRole) || 'parent',
    isEmailVerified: supabaseUser.email_confirmed_at != null,
    createdAt: supabaseUser.created_at,
    lastLoginAt: supabaseUser.last_sign_in_at,
    organizationId: metadata.organization_id,
    active: true,
    accessLevel: metadata.access_level || 'basic',
    plan: metadata.plan,
    profile: {
      title: metadata.title,
      organization: metadata.organization,
      bio: metadata.bio,
      phoneNumber: metadata.phone_number
    }
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(convertSupabaseUser(session?.user ?? null));
        setIsLoading(false);
        setIsInitialized(true);
        
        // Log successful authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User successfully signed in:', session.user.email);
          
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            console.warn('User email not confirmed:', session.user.email);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        console.log('Initial session:', session?.user?.email);
      }
      setSession(session);
      setUser(convertSupabaseUser(session?.user ?? null));
      setIsLoading(false);
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const userRole = user.role || 'parent';
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    
    return userPermissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const userRole = user.role || 'parent';
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    
    return roles === userRole;
  };

  const getRoleName = (role: UserRole): string => {
    const roleNames = {
      admin: 'Administrador',
      teacher: 'Professor',
      therapist: 'Terapeuta',
      coordinator: 'Coordenador',
      parent: 'Responsável',
      student: 'Estudante',
      guest: 'Convidado',
      specialist: 'Especialista',
      psychologist: 'Psicólogo',
      professional: 'Profissional',
      manager: 'Gerente'
    };
    return roleNames[role] || role;
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful for:', email);
    }
    
    return { data, error };
  };

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    console.log('Attempting sign up for:', email, 'with metadata:', metadata);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/educare-app/auth?action=login`
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful for:', email);
    }
    
    return { data, error };
  };

  const signOut = async (): Promise<void> => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    setShowUserDropdown(false);
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    hasPermission,
    hasRole,
    getRoleName,
    handleLogin: async (email: string, password: string, rememberMe: boolean = false) => {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      return convertSupabaseUser(data.user);
    },
    handleRegister: async (
      name: string, 
      email: string, 
      password: string, 
      role: UserRole,
      agreeTerms: boolean
    ) => {
      if (!agreeTerms) {
        throw new Error("You must agree to the terms and conditions");
      }
      
      const { data, error } = await signUp(email, password, { name, role });
      if (error) throw error;
      return convertSupabaseUser(data.user);
    },
    handleLogout: signOut,
    login: async (email: string, password: string) => {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      return convertSupabaseUser(data.user);
    },
    register: async (email: string, password: string, displayName: string) => {
      const { data, error } = await signUp(email, password, { name: displayName, role: 'parent' });
      if (error) throw error;
      return convertSupabaseUser(data.user);
    },
    logout: signOut,
    currentUser: user,
    isAuthenticated: !!user,
    showUserDropdown,
    setShowUserDropdown,
    updateProfile: async (profileData: any): Promise<boolean> => {
      try {
        const { error } = await supabase.auth.updateUser({
          data: profileData
        });
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error updating profile:', error);
        return false;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
