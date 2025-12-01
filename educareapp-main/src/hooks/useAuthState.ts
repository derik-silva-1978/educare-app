
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserPlan } from '@/types/auth';
import type { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const mapSupabaseUser = useCallback((session: Session | null): User | null => {
    if (!session?.user) return null;
    
    const user = session.user;
    const role = (user.user_metadata?.role as UserRole) || 'guest';
    
    return {
      id: user.id,
      uid: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      displayName: user.user_metadata?.name,
      email: user.email || '',
      photoURL: user.user_metadata?.avatar_url,
      avatar: user.user_metadata?.avatar_url,
      role: role,
      isEmailVerified: user.email_confirmed_at !== null,
      createdAt: user.created_at,
      lastLoginAt: undefined,
      organizationId: undefined,
      active: undefined,
      profile: {
        avatar: user.user_metadata?.avatar_url,
        title: undefined,
        organization: undefined,
        bio: undefined,
        phoneNumber: undefined
      },
      accessLevel: user.user_metadata?.access_level || 'basic',
      plan: user.user_metadata?.plan as UserPlan || {
        name: 'Smart PEI Básico',
        level: 'basic',
        features: ['Basic features']
      }
    };
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized,
    error,
    setError,
    showUserDropdown,
    setShowUserDropdown,
    currentUser,
    setCurrentUser,
    session,
    setSession,
    mapSupabaseUser
  };
};
