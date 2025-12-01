
import { License } from '@/types/license';
import { User } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { loadLicenses, saveLicenses } from '../license-storage';
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

export function assignLicense(licenseId: string, user: User): void {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  // In a real application, you would send data to an API
  const updatedLicenses = licenses.map(license => 
    license.id === licenseId 
      ? { ...license, assignedTo: `${user.name} (${user.email})` } 
      : license
  );
  
  saveLicenses(updatedLicenses);
  
  const licenseToAssign = licenses.find(license => license.id === licenseId);
  
  // Log the audit event
  if (licenseToAssign) {
    logAuditEvent(
      'license_assigned',
      currentUser,
      licenseId,
      'license',
      `License ${licenseToAssign.key.substring(0, 8)}... was assigned to ${user.name}`,
      { 
        licenseType: licenseToAssign.type, 
        licenseModel: licenseToAssign.model,
        assignedTo: user.id
      }
    );
  }
  
  toast({
    title: "Licença atribuída",
    description: licenseToAssign 
      ? `Licença ${licenseToAssign.key.substring(0, 8)}... foi atribuída a ${user.name}.` 
      : `Licença atribuída a ${user.name}.`,
  });
}

export function unassignLicense(licenseId: string): void {
  const licenses = loadLicenses();
  const currentUser = getCurrentUser();
  
  // In a real application, you would send data to an API
  const licenseToUnassign = licenses.find(license => license.id === licenseId);
  const currentAssignee = licenseToUnassign?.assignedTo;
  
  const updatedLicenses = licenses.map(license => 
    license.id === licenseId 
      ? { ...license, assignedTo: null } 
      : license
  );
  
  saveLicenses(updatedLicenses);
  
  // Log the audit event
  if (licenseToUnassign) {
    logAuditEvent(
      'license_unassigned',
      currentUser,
      licenseId,
      'license',
      `License ${licenseToUnassign.key.substring(0, 8)}... was unassigned from ${currentAssignee || 'unknown user'}`,
      { 
        licenseType: licenseToUnassign.type, 
        licenseModel: licenseToUnassign.model
      }
    );
  }
  
  toast({
    title: "Atribuição removida",
    description: licenseToUnassign && currentAssignee
      ? `Licença ${licenseToUnassign.key.substring(0, 8)}... não está mais atribuída a ${currentAssignee}.` 
      : "Atribuição de licença removida com sucesso.",
  });
}
