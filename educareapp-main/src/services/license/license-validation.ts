
import { License, ValidationResult } from '@/types/license';
import { isSupabaseConfigured } from '../supabase';
import { loadLicenses, saveLicenses } from './license-storage';
import { validateLicense } from '@/hooks/license/license-validation';

// Cache validation results to avoid unnecessary validation calls
const validationCache = new Map<string, { result: ValidationResult, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Perform license validation with caching
export const performLicenseValidation = async (licenseId: string): Promise<ValidationResult> => {
  try {
    // Check cache first
    const now = Date.now();
    const cachedData = validationCache.get(licenseId);
    
    if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
      console.log('Using cached validation result for license:', licenseId);
      return cachedData.result;
    }
    
    // Find the license
    const licenses = await loadLicenses();
    const license = licenses.find(lic => lic.id === licenseId);
    
    if (!license) {
      const result = {
        isValid: false,
        message: 'Licença não encontrada.',
        errorCode: 'LICENSE_NOT_FOUND'
      };
      validationCache.set(licenseId, { result, timestamp: now });
      return result;
    }
    
    // Update lastValidated timestamp
    const updatedLicenses = licenses.map(lic => 
      lic.id === licenseId 
        ? { ...lic, lastValidated: new Date().toISOString() } 
        : lic
    );
    
    // Save to localStorage
    await saveLicenses(updatedLicenses);
    
    // Perform actual validation
    const result = await validateLicense(license);
    
    // Cache the result
    validationCache.set(licenseId, { result, timestamp: now });
    
    if (isSupabaseConfigured()) {
      // TODO: Implement Supabase integration for logging validation
      console.log('Supabase is configured, but integration is not yet implemented for performLicenseValidation');
    }
    
    return result;
  } catch (error) {
    console.error('Error validating license:', error);
    throw error;
  }
};

// Clear validation cache for a specific license or all licenses
export const clearValidationCache = (licenseId?: string) => {
  if (licenseId) {
    validationCache.delete(licenseId);
  } else {
    validationCache.clear();
  }
};
