
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuthorization, checkSuperAdminAuthorization } from './admin-authorization';

/**
 * Add a user to admin authorization
 */
export async function authorizeAdmin(userId: string, authorizedBy?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if the current user is an admin
    if (!authorizedBy) {
      const { data } = await supabase.auth.getSession();
      authorizedBy = data.session?.user.id;
    }
    
    if (!authorizedBy) {
      return {
        success: false,
        error: 'You must be logged in to authorize admins'
      };
    }
    
    // Check if the current user is an admin
    const isAdmin = await checkAdminAuthorization(authorizedBy);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Only existing admins can authorize new admins'
      };
    }
    
    // For simplified scope, update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: 'admin' } }
    );
    
    if (updateError) {
      console.warn('Could not update user metadata:', updateError);
    }
    
    // Also update profile table
    const { error: profileError } = await supabase
      .from('educare_profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
    
    if (profileError) {
      console.warn('Could not update profile role:', profileError);
    }
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error authorizing admin:', error);
    return {
      success: false,
      error: error.message || 'An error occurred authorizing admin'
    };
  }
}

/**
 * Add a user to super admin authorization
 */
export async function authorizeSuperAdmin(userId: string, authorizedBy?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if the current user is a super admin
    if (!authorizedBy) {
      const { data } = await supabase.auth.getSession();
      authorizedBy = data.session?.user.id;
    }
    
    if (!authorizedBy) {
      return {
        success: false,
        error: 'You must be logged in to authorize super admins'
      };
    }
    
    // Check if the current user is a super admin
    const isSuperAdmin = await checkSuperAdminAuthorization(authorizedBy);
    if (!isSuperAdmin) {
      return {
        success: false,
        error: 'Only existing super admins can authorize new super admins'
      };
    }
    
    // For simplified scope, update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: 'super_admin' } }
    );
    
    if (updateError) {
      console.warn('Could not update user metadata:', updateError);
    }
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error authorizing super admin:', error);
    return {
      success: false,
      error: error.message || 'An error occurred authorizing super admin'
    };
  }
}
