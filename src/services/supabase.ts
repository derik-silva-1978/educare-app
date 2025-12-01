
import { config } from '@/config/supabase-config';
import type { Database } from '@/types/supabase-schema';
import { safeTableQuery } from '@/utils/supabase-rpc-utils';

/**
 * Check if Supabase is configured in the environment
 */
export const isSupabaseConfigured = (): boolean => {
  try {
    // Check if the Supabase URL and Anon Key are present in the application
    // We use a simple existence check rather than importing the client directly
    // to avoid circular dependencies
    const hasValidUrl = !!config.url && !config.url.includes('your-project-id');
    const hasValidKey = !!config.anonKey && !config.anonKey.includes('your-anon-key');
    
    return hasValidUrl && hasValidKey;
  } catch (error) {
    console.warn('Error checking Supabase configuration:', error);
    return false;
  }
};

/**
 * Get Supabase configuration
 */
export const getSupabaseConfig = () => {
  return {
    url: config.url,
    anonKey: config.anonKey,
    isConfigured: isSupabaseConfigured()
  };
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    // Only import supabase client here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    // Only import supabase client here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get the user profile
 */
export const getUserProfile = async (userId: string) => {
  try {
    // Only import supabase client here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Use our safe query utility
    const query = safeTableQuery(supabase, 'profiles');
    const { data, error } = await query
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Re-export the supabase client dynamically to avoid circular dependencies
export const getSupabaseClient = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    return supabase;
  } catch (error) {
    console.error('Error importing Supabase client:', error);
    return null;
  }
};
