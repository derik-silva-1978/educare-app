
import { supabase } from '@/integrations/supabase/client';
import { safeTableQuery } from '@/utils/supabase-rpc-utils';

/**
 * Check if the current user has admin permissions
 */
export async function checkAdminPermission() {
  try {
    // Get current user from auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { 
        isAdmin: false, 
        error: "User not authenticated", 
        userId: null 
      };
    }
    
    const userId = session.user.id;
    
    // Check if user has admin role directly from user_roles table using safeTableQuery
    const userRolesQuery = safeTableQuery(supabase, 'user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
      
    const { data: userData, error: userError } = await userRolesQuery;
    
    if (userError) {
      console.error('Error checking admin role:', userError);
      return { 
        isAdmin: false, 
        error: "Error checking admin role", 
        userId 
      };
    }
    
    // User is admin if they have admin role
    const isAdmin = !!userData;
    
    return {
      isAdmin,
      userId,
      error: isAdmin ? null : "User does not have admin privileges"
    };
  } catch (error: any) {
    console.error('Error in checkAdminPermission:', error);
    return { 
      isAdmin: false, 
      error: `Unexpected error: ${error.message || 'Unknown error'}`,
      userId: null
    };
  }
}

// Interface for admin profile to match database schema
interface AdminProfile {
  user_id: string;
  allowed_imports: string[];
  last_activity: string;
}

/**
 * Ensure that the current user has an admin profile
 */
export async function ensureAdminProfile() {
  try {
    const { isAdmin, userId, error } = await checkAdminPermission();
    
    if (!isAdmin || !userId) {
      console.error("Admin permission error:", error);
      return { success: false, error };
    }
    
    // Check if admin profile exists using safeTableQuery
    const adminProfilesQuery = safeTableQuery<AdminProfile>(supabase, 'admin_profiles')
      .select()
      .eq('user_id', userId)
      .maybeSingle();
    
    const { data: adminProfileData, error: profileError } = await adminProfilesQuery;
    
    if (profileError) {
      console.error('Error checking admin profile:', profileError);
      return { success: false, error: "Error checking admin profile" };
    }
    
    // Create admin profile if it doesn't exist
    if (!adminProfileData) {
      const insertQuery = safeTableQuery(supabase, 'admin_profiles')
        .insert({
          user_id: userId,
          allowed_imports: ['quiz', 'assessment', 'content'],
          last_activity: new Date().toISOString()
        })
        .select()
        .single();
      
      const { data: newProfile, error: createError } = await insertQuery;
      
      if (createError) {
        console.error('Error creating admin profile:', createError);
        return { success: false, error: "Error creating admin profile" };
      }
      
      return { success: true, profile: newProfile };
    }
    
    return { success: true, profile: adminProfileData };
    
  } catch (error: any) {
    console.error('Error in ensureAdminProfile:', error);
    return { 
      success: false, 
      error: `Unexpected error: ${error.message || 'Unknown error'}` 
    };
  }
}

/**
 * Check if the admin user has authorization for a specific action
 */
export async function checkAdminAuthorization(action: string) {
  try {
    const { isAdmin, userId, error } = await checkAdminPermission();
    
    if (!isAdmin) {
      console.error("Admin permission error:", error);
      return { isAuthorized: false, error };
    }
    
    // In a real app, check against allowed actions for this admin
    // For now, just return true if they are admin
    
    return { isAuthorized: true, userId };
  } catch (error: any) {
    console.error('Error in checkAdminAuthorization:', error);
    return { 
      isAuthorized: false, 
      error: `Unexpected error: ${error.message || 'Unknown error'}` 
    };
  }
}

/**
 * Validate prerequisites for importing data
 */
export async function validateImportPrerequisites() {
  try {
    const { isAdmin, error: permissionError } = await checkAdminPermission();
    
    if (!isAdmin) {
      return { 
        isValid: false, 
        error: permissionError || "Admin permissions required" 
      };
    }
    
    // Check admin profile
    const { success, profile, error: profileError } = await ensureAdminProfile();
    
    if (!success || !profile) {
      return { 
        isValid: false, 
        error: profileError || "Failed to validate admin profile" 
      };
    }
    
    // Check if admin is allowed to import quizzes
    if (!profile.allowed_imports.includes('quiz')) {
      return { 
        isValid: false, 
        error: "This admin account is not authorized to import quizzes" 
      };
    }
    
    return { isValid: true };
  } catch (error: any) {
    console.error('Error validating import prerequisites:', error);
    return { 
      isValid: false, 
      error: `Unexpected error: ${error.message || 'Unknown error'}` 
    };
  }
}
