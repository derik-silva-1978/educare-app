import { supabase } from '@/integrations/supabase/client';
import { safeRpcCall } from '@/utils/supabase-rpc-utils';

/**
 * Migrate license data to Supabase
 */
export const migrateLicenseToSupabase = async (license: any): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return false;
  }
  
  try {
    console.log('Migrating license to Supabase:', license.id);
    
    // Format the expire date
    const expiresAt = license.expires_at || new Date().toISOString();
    
    // Insert the license using our safe RPC call
    const { error } = await safeRpcCall(
      supabase,
      'insert_license',
      {
        p_id: license.id,
        p_key: license.key,
        p_type: license.type || 'standard',
        p_model: license.model || 'subscription',
        p_expires_at: expiresAt,
        p_max_users: license.max_users || 1,
        p_total_count: license.total_count || 0,
        p_used_count: license.used_count || 0,
        p_features: license.features || [],
        p_is_active: license.is_active || true,
        p_assigned_to_name: license.assigned_to_name || '',
        p_last_validated: license.last_validated || null
      }
    );
    
    if (error) {
      console.error('Error migrating license to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to migrate license to Supabase:', error);
    return false;
  }
};

/**
 * Migrate team data to Supabase
 */
export const migrateTeamToSupabase = async (team: any): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return false;
  }
  
  try {
    console.log('Migrating team to Supabase:', team.id);
    
    // Insert the team using our safe RPC call
    const { error } = await safeRpcCall(
      supabase,
      'insert_team',
      {
        p_id: team.id,
        p_license_id: team.license_id,
        p_name: team.name,
        p_student_id: team.student_id,
        p_student_name: team.student_name,
        p_created_at: team.created_at || new Date().toISOString(),
        p_updated_at: team.updated_at || new Date().toISOString()
      }
    );
    
    if (error) {
      console.error('Error migrating team to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to migrate team to Supabase:', error);
    return false;
  }
};

/**
 * Migrate team member data to Supabase
 */
export const migrateTeamMemberToSupabase = async (member: any): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return false;
  }
  
  try {
    console.log('Migrating team member to Supabase:', member.user_id);
    
    // Insert the team member using our safe RPC call
    const { error } = await safeRpcCall(
      supabase,
      'insert_team_member',
      {
        p_team_id: member.team_id,
        p_user_id: member.user_id,
        p_name: member.name,
        p_email: member.email,
        p_role: member.role || 'member'
      }
    );
    
    if (error) {
      console.error('Error migrating team member to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to migrate team member to Supabase:', error);
    return false;
  }
};

/**
 * Migrate all licenses from localStorage to Supabase
 */
export const migrateLocalStorageLicenses = async (): Promise<{
  success: boolean;
  migrated: number;
  errors: number;
}> => {
  try {
    // Get all licenses from localStorage
    const licenses: any[] = [];
    let migratedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('license_')) {
        try {
          const licenseData = JSON.parse(localStorage.getItem(key) || '{}');
          licenses.push(licenseData);
        } catch (error) {
          console.error(`Error parsing license data for key ${key}:`, error);
        }
      }
    }
    
    console.log(`Found ${licenses.length} licenses to migrate`);
    
    // Migrate each license
    for (const license of licenses) {
      try {
        const result = await migrateLicenseToSupabase(license);
        if (result) {
          migratedCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error migrating license ${license.id}:`, error);
        errorCount++;
      }
    }
    
    return {
      success: errorCount === 0,
      migrated: migratedCount,
      errors: errorCount
    };
  } catch (error) {
    console.error('Failed to migrate licenses:', error);
    return {
      success: false,
      migrated: 0,
      errors: 1
    };
  }
};

export default {
  migrateLicenseToSupabase,
  migrateTeamToSupabase,
  migrateTeamMemberToSupabase,
  migrateLocalStorageLicenses
};
