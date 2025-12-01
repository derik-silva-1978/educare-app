
import { License } from '@/types/license';
import { demoLicenses } from './demo-licenses';

export function loadLicenses(): License[] {
  const storedLicenses = localStorage.getItem('smartPeiLicenses');
  if (storedLicenses) {
    return JSON.parse(storedLicenses);
  } else {
    // Initialize with demo licenses
    saveLicenses(demoLicenses);
    return demoLicenses;
  }
}

export function saveLicenses(licenses: License[]): void {
  localStorage.setItem('smartPeiLicenses', JSON.stringify(licenses));
}
