
import { isSupabaseConfigured } from './supabase';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase-schema';
import { safeTableQuery, safeTableInsert } from '@/utils/supabase-rpc-utils';

// Type aliases for easier reference
type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser | null;
  error?: string;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    // Fetch the user's role (if any)
    let role: string | undefined;

    if (data.user) {
      try {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'user_roles');
        const { data: roleData, error: roleError } = await query
          .select('role, is_admin')
          .eq('user_id', data.user.id)
          .single();

        if (!roleError && roleData) {
          role = roleData.role;
        }
      } catch (err) {
        console.warn('Error fetching user role:', err);
      }
    }

    return {
      success: true,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name as string,
        role
      } : null
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  name: string,
  role: string = 'teacher'
): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      throw error;
    }

    // Create user role if signup was successful
    if (data.user) {
      try {
        // Use our safe insert utility
        const { error: roleError } = await safeTableInsert(
          supabase,
          'user_roles',
          {
            user_id: data.user.id,
            role,
            is_admin: role === 'admin',
            created_at: new Date().toISOString()
          }
        );

        if (roleError) {
          console.error('Error creating user role:', roleError);
        }
      } catch (err) {
        console.warn('Error creating user role:', err);
      }
    }

    return {
      success: true,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name as string,
        role
      } : null
    };
  } catch (error) {
    console.error('Error signing up:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    // Fetch the user's role (if any)
    let role: string | undefined;

    if (data.user) {
      try {
        // Use our safe query utility
        const query = safeTableQuery(supabase, 'user_roles');
        const { data: roleData, error: roleError } = await query
          .select('role, is_admin')
          .eq('user_id', data.user.id)
          .single();

        if (!roleError && roleData) {
          role = roleData.role;
        }
      } catch (err) {
        console.warn('Error fetching user role:', err);
      }
    }

    return {
      success: true,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name as string,
        role
      } : null
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Reset password (sends a password reset email)
 */
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
    });

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      data: profileData
    });

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (
  token: string, 
  email: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured'
    };
  }

  try {
    const { error } = await supabase.auth.verifyOtp({
      token,
      type: 'email',
      email
    });

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
