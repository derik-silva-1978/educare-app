
import { User } from '@/types/auth';
import * as licenseService from '@/services/licenseService';
import { toast } from '@/hooks/use-toast';

export function useLicenseAssignment(refreshLicenses: () => Promise<void>) {
  const handleAssignLicense = async (licenseId: string, user: User) => {
    try {
      await licenseService.assignLicense(licenseId, user);
      await refreshLicenses();
      toast({
        title: "License assigned",
        description: `The license has been assigned to ${user.name}.`,
      });
    } catch (error) {
      console.error('Error assigning license:', error);
      toast({
        title: 'Error assigning license',
        description: 'Failed to assign license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  const handleUnassignLicense = async (licenseId: string) => {
    try {
      await licenseService.unassignLicense(licenseId);
      await refreshLicenses();
      toast({
        title: "License unassigned",
        description: "The license assignment has been removed.",
      });
    } catch (error) {
      console.error('Error unassigning license:', error);
      toast({
        title: 'Error unassigning license',
        description: 'Failed to unassign license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    assignLicense: handleAssignLicense,
    unassignLicense: handleUnassignLicense
  };
}
