
import { License } from '@/types/license';
import { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { loadLicenses, saveLicenses } from './license-storage';
import { logAuditEvent } from '@/hooks/license/license-audit';
import { encryptLicenseKey, decryptLicenseKey } from '@/hooks/license/license-encryption';
import { uuid } from '@/utils/uuid';

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

export function createLicense(
  type: License['type'],
  model: License['model'],
  expirationDate: Date | string = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
): License {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    key: generateLicenseKey(),
    status: 'active',
    type: type,
    model: model,
    expiresAt: typeof expirationDate === 'string' ? expirationDate : expirationDate.toISOString(),
    maxUsers: 5,
    features: [],
    isActive: true,
    assignedTo: null,
    lastValidated: null,
    usedCount: 0,
    totalCount: 5,
    createdAt: now,
    teams: []
  };
}

export function generateEnterpriseLicense(seats: number = 10): License {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    key: generateLicenseKey(),
    status: 'active',
    type: 'enterprise',
    model: 'enterprise',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    maxUsers: seats,
    features: ['all'],
    isActive: true,
    assignedTo: null,
    lastValidated: null,
    usedCount: 0,
    totalCount: seats,
    createdAt: now,
    teams: []
  };
}

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 4 groups of 4 characters separated by hyphens
  for (let g = 0; g < 4; g++) {
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (g < 3) {
      result += '-';
    }
  }
  
  return result;
}

// Add the missing CRUD functions
export async function addLicense(licenseData: License): Promise<License> {
  try {
    const licenses = await loadLicenses();
    const currentUser = getCurrentUser();
    
    // Encrypt sensitive license information
    const licenseWithEncryptedKey = {
      ...licenseData,
      key: encryptLicenseKey(licenseData.key)
    };
    
    // In a real application, you would send data to an API
    const updatedLicenses = [...licenses, licenseWithEncryptedKey];
    await saveLicenses(updatedLicenses);
    
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
  } catch (error) {
    console.error('Error adding license:', error);
    throw error;
  }
}

export async function updateLicense(licenseData: License): Promise<License> {
  try {
    const licenses = await loadLicenses();
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
    
    await saveLicenses(updatedLicenses);
    
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
  } catch (error) {
    console.error('Error updating license:', error);
    throw error;
  }
}

export async function deleteLicense(licenseId: string): Promise<void> {
  try {
    const licenses = await loadLicenses();
    const currentUser = getCurrentUser();
    
    // In a real application, you would send a delete request to an API
    const licenseToDelete = licenses.find(license => license.id === licenseId);
    const updatedLicenses = licenses.filter(license => license.id !== licenseId);
    
    await saveLicenses(updatedLicenses);
    
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
  } catch (error) {
    console.error('Error deleting license:', error);
    throw error;
  }
}
