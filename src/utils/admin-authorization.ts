
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is authorized as an admin
 */
export async function checkAdminAuthorization(userId?: string): Promise<boolean> {
  if (!userId) {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id;
  }
  
  if (!userId) return false;
  
  // For simplified scope, check user metadata for admin role
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError && userData.user?.user_metadata?.role === 'admin') {
      return true;
    }
    
    // Also check profile table
    const { data: profileData } = await supabase
      .from('educare_profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    return profileData?.role === 'admin';
  } catch (error) {
    console.error('Error in admin authorization check:', error);
    return false;
  }
}

/**
 * Check if a user is authorized as a super admin
 */
export async function checkSuperAdminAuthorization(userId?: string): Promise<boolean> {
  if (!userId) {
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id;
  }
  
  if (!userId) return false;
  
  // For simplified scope, check user metadata for super_admin role
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError && userData.user?.user_metadata?.role === 'super_admin') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in super admin authorization check:', error);
    return false;
  }
}
