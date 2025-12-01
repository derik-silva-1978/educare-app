
import { License } from '@/types/license';
import { User } from '@/types/auth';
import * as licenseService from '@/services/licenseService';
import { toast } from '@/hooks/use-toast';

export function useLicenseOperations(refreshLicenses: () => Promise<void>) {
  const handleAddLicense = async (licenseData: License) => {
    try {
      const result = await licenseService.addLicense(licenseData);
      await refreshLicenses();
      toast({
        title: "License added",
        description: "The license has been created successfully.",
      });
      return result;
    } catch (error) {
      console.error('Error adding license:', error);
      toast({
        title: 'Error adding license',
        description: 'Failed to add license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleUpdateLicense = async (licenseData: License) => {
    try {
      const result = await licenseService.updateLicense(licenseData);
      await refreshLicenses();
      toast({
        title: "License updated",
        description: "The license has been updated successfully.",
      });
      return result;
    } catch (error) {
      console.error('Error updating license:', error);
      toast({
        title: 'Error updating license',
        description: 'Failed to update license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleDeleteLicense = async (licenseId: string) => {
    try {
      await licenseService.deleteLicense(licenseId);
      await refreshLicenses();
      toast({
        title: "License deleted",
        description: "The license has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting license:', error);
      toast({
        title: 'Error deleting license',
        description: 'Failed to delete license. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    addLicense: handleAddLicense,
    updateLicense: handleUpdateLicense,
    deleteLicense: handleDeleteLicense
  };
}
