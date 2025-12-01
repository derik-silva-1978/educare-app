
import { License } from '@/types/license';
import { isSupabaseConfigured } from '../supabase';
import { createDemoLicenses, ensureTeamsHaveCorrectTypes } from './license-helpers';

// Mock database of licenses
let licenses: License[] = [];

// Load licenses from localStorage (or eventually from Supabase)
export const loadLicenses = async (): Promise<License[]> => {
  try {
    if (isSupabaseConfigured()) {
      // TODO: Implement Supabase integration
      // This would fetch licenses from Supabase instead of localStorage
      console.log('Supabase is configured, but integration is not yet implemented for loadLicenses');
    }
    
    const storedLicenses = localStorage.getItem('smartPeiLicenses');
    if (storedLicenses) {
      licenses = JSON.parse(storedLicenses);
      
      // Ensure teams have proper types
      licenses = ensureTeamsHaveCorrectTypes(licenses);
    } else {
      // If no licenses are found, create demo licenses
      licenses = createDemoLicenses();
      localStorage.setItem('smartPeiLicenses', JSON.stringify(licenses));
    }
    
    return licenses;
  } catch (error) {
    console.error('Error loading licenses:', error);
    return [];
  }
};

// Save licenses to localStorage (or eventually to Supabase)
export const saveLicenses = async (updatedLicenses: License[]): Promise<void> => {
  try {
    if (isSupabaseConfigured()) {
      // TODO: Implement Supabase integration
      console.log('Supabase is configured, but integration is not yet implemented for saveLicenses');
    }
    
    // Save to localStorage
    localStorage.setItem('smartPeiLicenses', JSON.stringify(updatedLicenses));
    licenses = updatedLicenses;
  } catch (error) {
    console.error('Error saving licenses:', error);
    throw error;
  }
};
