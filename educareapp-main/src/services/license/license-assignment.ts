
import { User } from '@/types/auth';
import { isSupabaseConfigured } from '../supabase';
import { loadLicenses, saveLicenses } from './license-storage';

// Assign a license to a user
export const assignLicense = async (licenseId: string, user: User): Promise<void> => {
  try {
    // Find and update the license in the local array
    const licenses = await loadLicenses();
    const updatedLicenses = licenses.map(license => 
      license.id === licenseId 
        ? { ...license, assignedTo: user.email, usedCount: (license.usedCount || 0) + 1 } 
        : license
    );
    
    // Save to localStorage
    await saveLicenses(updatedLicenses);
    
    if (isSupabaseConfigured()) {
      // TODO: Implement Supabase integration
      console.log('Supabase is configured, but integration is not yet implemented for assignLicense');
    }
  } catch (error) {
    console.error('Error assigning license:', error);
    throw error;
  }
};

// Unassign a license from a user
export const unassignLicense = async (licenseId: string): Promise<void> => {
  try {
    // Find and update the license in the local array
    const licenses = await loadLicenses();
    const updatedLicenses = licenses.map(license => 
      license.id === licenseId 
        ? { ...license, assignedTo: null } 
        : license
    );
    
    // Save to localStorage
    await saveLicenses(updatedLicenses);
    
    if (isSupabaseConfigured()) {
      // TODO: Implement Supabase integration
      console.log('Supabase is configured, but integration is not yet implemented for unassignLicense');
    }
  } catch (error) {
    console.error('Error unassigning license:', error);
    throw error;
  }
};
