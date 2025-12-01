
import { License, ValidationResult } from '@/types/license';
import { User } from '@/types/auth';
import { loadLicenses, saveLicenses } from '../license-storage';
import { validateLicense } from '../license-validation';
import { logAuditEvent } from '../license-audit';

// Get the current user for audit logs
const getCurrentUser = (): User => {
  // In a real application, you would get this from a context or store
  // For now, use a placeholder since we can't use hooks in a non-component function
  return { 
    id: 'system', 
    name: 'System', 
    email: 'system@smartpei.com', 
    role: 'admin' 
  };
};

export async function performLicenseValidation(licenseId: string): Promise<ValidationResult> {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  const licenseToValidate = licenses.find(license => license.id === licenseId);
  
  if (!licenseToValidate) {
    return {
      isValid: false,
      message: "Licença não encontrada."
    };
  }
  
  // Get validation result
  const validationResult = await validateLicense(licenseToValidate);
  
  // Update the license with validation timestamp
  const updatedLicenses = licenses.map(license => 
    license.id === licenseId 
      ? { ...license, lastValidated: new Date().toISOString() } 
      : license
  );
  
  saveLicenses(updatedLicenses);
  
  // Log the audit event
  logAuditEvent(
    'license_validated',
    currentUser,
    licenseId,
    'license',
    `License ${licenseToValidate.key.substring(0, 8)}... was validated (${validationResult.isValid ? 'valid' : 'invalid'})`,
    { 
      licenseType: licenseToValidate.type, 
      licenseModel: licenseToValidate.model,
      validationResult
    }
  );
  
  return validationResult;
}
