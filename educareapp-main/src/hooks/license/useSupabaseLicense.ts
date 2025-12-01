
import { supabase } from '@/integrations/supabase/client';
import { safeRpcCall, safeTableQuery } from '@/utils/supabase-rpc-utils';
import type { Database } from '@/types/supabase-schema';

// Define interfaces for our license operations since they're not in the Supabase types
interface LicenseValidation {
  license_id: string;
  is_valid: boolean;
  message?: string;
  error_code?: string;
  validated_at?: string;
}

export function useSupabaseLicense() {
  /**
   * Log license validation to Supabase
   */
  const logLicenseValidation = async (
    licenseId: string,
    isValid: boolean,
    message: string,
    errorCode?: string
  ) => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized, skipping validation logging');
        return;
      }
      
      // Using our safe RPC call utility function
      const { error } = await safeRpcCall(
        supabase,
        'insert_license_validation',
        {
          p_license_id: licenseId,
          p_is_valid: isValid,
          p_message: message,
          p_error_code: errorCode,
          p_validated_at: new Date().toISOString()
        }
      );
      
      if (error) {
        console.error('Error logging license validation:', error);
      }
    } catch (err) {
      console.error('Failed to log license validation:', err);
    }
  };
  
  /**
   * Get validation history for a license
   */
  const getLicenseValidationHistory = async (licenseId: string) => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized, cannot get validation history');
        return { data: [], error: new Error('Supabase client not initialized') };
      }
      
      // Using our safe RPC call utility
      return await safeRpcCall(
        supabase,
        'get_license_validation_history',
        {
          p_license_id: licenseId
        }
      );
    } catch (err) {
      console.error('Failed to get license validation history:', err);
      return { data: null, error: err };
    }
  };
  
  /**
   * Check if a license key exists in Supabase
   */
  const checkLicenseExists = async (licenseKey: string) => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized, cannot check license existence');
        return { exists: false, error: new Error('Supabase client not initialized') };
      }
      
      // Using our safe RPC call utility
      const { data, error } = await safeRpcCall(
        supabase,
        'check_license_exists',
        {
          p_license_key: licenseKey
        }
      );
      
      // Check if data exists and has length property
      return { 
        exists: !!data && Array.isArray(data) && data.length > 0 && data[0]?.exists === true,
        error 
      };
    } catch (err) {
      console.error('Failed to check license existence:', err);
      return { exists: false, error: err };
    }
  };
  
  return {
    logLicenseValidation,
    getLicenseValidationHistory,
    checkLicenseExists
  };
}
