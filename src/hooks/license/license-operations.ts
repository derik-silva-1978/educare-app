
// This file is now a barrel file exporting from separate modules
import { addLicense, updateLicense, deleteLicense, getChanges } from './operations/license-crud';
import { assignLicense, unassignLicense } from './operations/license-assignment';
import { performLicenseValidation } from './operations/license-validation';

export {
  addLicense,
  updateLicense,
  deleteLicense,
  assignLicense,
  unassignLicense,
  performLicenseValidation,
  getChanges
};
