
import { supabase } from '@/integrations/supabase/client';
import { AppEnvironment } from '@/types/role-system';
import { Role } from '@/types/role-system';

/**
 * Check if a user can access a specific environment
 */
export async function checkEnvironmentAccess(
  userId: string, 
  envSlug: AppEnvironment,
  hasUserRole: (role: Role | Role[]) => boolean
): Promise<boolean> {
  if (!userId) return false;
  
  // Super admins can access everything
  if (hasUserRole('super_admin')) return true;
  
  try {
    // Get the current session token
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    
    if (!accessToken) {
      throw new Error('No active session found');
    }
    
    // Call the edge function to check access
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/check-environment-access`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId,
          environmentSlug: envSlug
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error checking environment access: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return result.hasAccess === true;
  } catch (error) {
    console.error('Error checking environment access:', error);
    
    // Fallback checks based on role hierarchy
    if (envSlug === 'public') return true;
    if (envSlug === 'parent' && hasUserRole(['parent', 'teacher', 'therapist', 'professional', 'admin'])) return true;
    if (envSlug === 'professional' && hasUserRole(['teacher', 'therapist', 'professional', 'admin'])) return true;
    if (envSlug === 'admin' && hasUserRole('admin')) return true;
    return false;
  }
}
