
import { useState, useCallback } from 'react';
import { ValidationResult } from '@/types/license';
import * as licenseService from '@/services/licenseService';
import { toast } from '@/hooks/use-toast';

export function useLicenseValidation(refreshLicenses: () => Promise<void>) {
  const [validatingLicenseId, setValidatingLicenseId] = useState<string | null>(null);
  
  const validateLicense = useCallback(async (licenseId: string): Promise<ValidationResult> => {
    try {
      setValidatingLicenseId(licenseId);
      const result = await licenseService.performLicenseValidation(licenseId);
      
      // Only refresh the licenses list if validation was successful
      if (result.isValid) {
        await refreshLicenses();
      }
      
      return result;
    } catch (error) {
      console.error('Error validating license:', error);
      toast({
        title: 'Error validating license',
        description: 'Failed to validate license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setValidatingLicenseId(null);
    }
  }, [refreshLicenses]);

  return {
    validateLicense,
    validatingLicenseId,
    isValidating: !!validatingLicenseId
  };
}
