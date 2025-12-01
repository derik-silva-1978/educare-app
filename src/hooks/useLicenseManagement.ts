
import { useEffect } from 'react';
import { LicenseMetrics, calculateLicenseMetrics } from './license/license-metrics';
import { useRefreshLicenses } from './license/hooks/useRefreshLicenses';
import { useLicenseOperations } from './license/hooks/useLicenseOperations';
import { useLicenseAssignment } from './license/hooks/useLicenseAssignment';
import { useLicenseValidation } from './license/hooks/useLicenseValidation';
import { useState } from 'react';

export function useLicenseManagement() {
  const { licenses, isLoading, setLicenses, refreshLicenses } = useRefreshLicenses();
  const { addLicense, updateLicense, deleteLicense } = useLicenseOperations(refreshLicenses);
  const { assignLicense, unassignLicense } = useLicenseAssignment(refreshLicenses);
  const { validateLicense } = useLicenseValidation(refreshLicenses);
  
  const [licenseMetrics, setLicenseMetrics] = useState<LicenseMetrics>({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
    assigned: 0,
    unassigned: 0,
    expiringIn30Days: 0,
    byType: {},
    byModel: {
      enterprise: 0,
      individual: 0
    },
    expirationByMonth: [],
    teamsTotal: 0,
    averageTeamSize: 0,
    enterpriseUtilization: 0
  });
  
  useEffect(() => {
    refreshLicenses();
  }, []);
  
  useEffect(() => {
    const metrics = calculateLicenseMetrics(licenses);
    setLicenseMetrics(metrics);
  }, [licenses]);

  return {
    licenses,
    isLoading,
    licenseMetrics,
    refreshLicenses,
    addLicense,
    updateLicense,
    deleteLicense,
    assignLicense,
    unassignLicense,
    validateLicense
  };
}

export default useLicenseManagement;
