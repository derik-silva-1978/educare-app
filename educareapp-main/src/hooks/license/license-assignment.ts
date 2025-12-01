
import { User } from '@/types/auth';
import { License } from '@/types/license';
import { toast } from '@/hooks/use-toast';
import { logAuditEvent } from './license-audit';

// Get the current user for audit logs
const getCurrentUser = (): User => {
  // In a real application, you would get this from a context or store
  return { 
    id: 'system', 
    name: 'System', 
    email: 'system@smartpei.com', 
    role: 'admin' 
  };
};

export const assignLicense = async (licenseId: string, user: User): Promise<void> => {
  try {
    const { loadLicenses, saveLicenses } = await import('./license-storage');
    const licenses = await loadLicenses();
    const currentUser = getCurrentUser();
    
    // Find and update the license in the local array
    const updatedLicenses = licenses.map(license => 
      license.id === licenseId 
        ? { ...license, assignedTo: user.email, usedCount: (license.usedCount || 0) + 1 } 
        : license
    );
    
    // Save to localStorage
    await saveLicenses(updatedLicenses);
    
    // Log audit event
    const licenseToAssign = licenses.find(license => license.id === licenseId);
    if (licenseToAssign) {
      logAuditEvent(
        'license_assigned',
        currentUser,
        licenseId,
        'license',
        `License ${licenseToAssign.key.substring(0, 8)}... was assigned to ${user.name}`,
        { 
          licenseType: licenseToAssign.type, 
          licenseModel: licenseToAssign.model || 'standard',
          assignedTo: user.id
        }
      );
    }
  } catch (error) {
    console.error('Error assigning license:', error);
    throw error;
  }
};

export const unassignLicense = async (licenseId: string): Promise<void> => {
  try {
    const { loadLicenses, saveLicenses } = await import('./license-storage');
    const licenses = await loadLicenses();
    const currentUser = getCurrentUser();
    
    // Find the license before updating to get the current assignee
    const licenseToUnassign = licenses.find(license => license.id === licenseId);
    const currentAssignee = licenseToUnassign?.assignedTo;
    
    // Find and update the license in the local array
    const updatedLicenses = licenses.map(license => 
      license.id === licenseId 
        ? { ...license, assignedTo: null } 
        : license
    );
    
    // Save to localStorage
    await saveLicenses(updatedLicenses);
    
    // Log audit event
    if (licenseToUnassign) {
      logAuditEvent(
        'license_unassigned',
        currentUser,
        licenseId,
        'license',
        `License ${licenseToUnassign.key.substring(0, 8)}... was unassigned from ${currentAssignee || 'unknown user'}`,
        { 
          licenseType: licenseToUnassign.type, 
          licenseModel: licenseToUnassign.model || 'standard'
        }
      );
    }
  } catch (error) {
    console.error('Error unassigning license:', error);
    throw error;
  }
};
