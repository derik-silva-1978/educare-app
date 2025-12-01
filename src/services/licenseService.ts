
import { License, ValidationResult } from '@/types/license';
import { User } from '@/types/auth';

// Re-export functions from the license-storage module
import { loadLicenses } from './license/license-storage';

// Re-export functions from the license-crud module
import { 
  addLicense, 
  updateLicense, 
  deleteLicense, 
  createLicense, 
  generateEnterpriseLicense,
  generateLicenseKey
} from './license/license-crud';

// Re-export functions from the license-assignment module
import { assignLicense, unassignLicense } from './license/license-assignment';

// Re-export functions from the license-validation module
import { performLicenseValidation } from './license/license-validation';

// Export all license service functions
export {
  loadLicenses,
  addLicense,
  updateLicense,
  deleteLicense,
  assignLicense,
  unassignLicense,
  performLicenseValidation,
  createLicense,
  generateEnterpriseLicense,
  generateLicenseKey
};
