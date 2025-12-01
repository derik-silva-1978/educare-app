
import { License, ValidationResult } from '@/types/license';
import { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { loadLicenses, saveLicenses } from '../license-storage';
import { logAuditEvent } from '../license-audit';
import { encryptLicenseKey, decryptLicenseKey } from '../license-encryption';

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

// Helper function to get changes between old and new license
export function getChanges(oldLicense?: License, newLicense?: License): Record<string, any> {
  if (!oldLicense || !newLicense) return {};
  
  const changes: Record<string, any> = {};
  
  // Compare simple properties
  const propertiesToCompare = [
    'type', 'expiresAt', 'maxUsers', 'isActive'
  ];
  
  propertiesToCompare.forEach(prop => {
    if (oldLicense[prop as keyof License] !== newLicense[prop as keyof License]) {
      changes[prop] = {
        old: oldLicense[prop as keyof License],
        new: newLicense[prop as keyof License]
      };
    }
  });
  
  // Compare features array
  if (JSON.stringify(oldLicense.features) !== JSON.stringify(newLicense.features)) {
    changes.features = {
      old: oldLicense.features,
      new: newLicense.features
    };
  }
  
  return changes;
}

export function addLicense(licenseData: License): License {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  // Encrypt sensitive license information
  const licenseWithEncryptedKey = {
    ...licenseData,
    key: encryptLicenseKey(licenseData.key)
  };
  
  // In a real application, you would send data to an API
  const updatedLicenses = [...licenses, licenseWithEncryptedKey];
  saveLicenses(updatedLicenses);
  
  // Log the audit event
  logAuditEvent(
    'license_created',
    currentUser,
    licenseData.id,
    'license',
    `License ${licenseData.key.substring(0, 8)}... was created`,
    { 
      licenseType: licenseData.type, 
      licenseModel: licenseData.model 
    }
  );
  
  toast({
    title: "Licença adicionada",
    description: `Licença ${licenseData.key.substring(0, 8)}... foi adicionada com sucesso.`,
  });
  
  return licenseData;
}

export function updateLicense(licenseData: License): License {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  // Find the existing license to compare changes
  const existingLicense = licenses.find(license => license.id === licenseData.id);
  
  // Preserve the encrypted key if it hasn't changed
  const updatedLicense = {
    ...licenseData,
    // Only encrypt the key if it has changed
    key: existingLicense && existingLicense.key === licenseData.key 
      ? licenseData.key
      : encryptLicenseKey(licenseData.key)
  };
  
  // In a real application, you would send data to an API
  const updatedLicenses = licenses.map(license => 
    license.id === licenseData.id ? updatedLicense : license
  );
  
  saveLicenses(updatedLicenses);
  
  // Log the audit event
  logAuditEvent(
    'license_updated',
    currentUser,
    licenseData.id,
    'license',
    `License ${licenseData.key.substring(0, 8)}... was updated`,
    { 
      licenseType: licenseData.type, 
      licenseModel: licenseData.model,
      changes: getChanges(existingLicense, licenseData)
    }
  );
  
  toast({
    title: "Licença atualizada",
    description: `Licença ${licenseData.key.substring(0, 8)}... foi atualizada com sucesso.`,
  });
  
  return licenseData;
}

export function deleteLicense(licenseId: string): void {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  // In a real application, you would send a delete request to an API
  const licenseToDelete = licenses.find(license => license.id === licenseId);
  const updatedLicenses = licenses.filter(license => license.id !== licenseId);
  
  saveLicenses(updatedLicenses);
  
  // Log the audit event
  if (licenseToDelete) {
    logAuditEvent(
      'license_deleted',
      currentUser,
      licenseId,
      'license',
      `License ${licenseToDelete.key.substring(0, 8)}... was deleted`,
      { 
        licenseType: licenseToDelete.type, 
        licenseModel: licenseToDelete.model
      }
    );
  }
  
  toast({
    title: "Licença excluída",
    description: licenseToDelete 
      ? `Licença ${licenseToDelete.key.substring(0, 8)}... foi excluída com sucesso.` 
      : "Licença excluída com sucesso.",
  });
}
