
import { useState, useCallback, useEffect } from 'react';
import * as licenseService from '@/services/licenseService';
import { License } from '@/types/license';
import { toast } from '@/hooks/use-toast';

export function useRefreshLicenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Memoized refresh function to prevent unnecessary rerenders
  const refreshLicenses = useCallback(async (showToast = true) => {
    try {
      setIsLoading(true);
      const data = await licenseService.loadLicenses();
      setLicenses(data);
      setLastRefreshed(new Date());
      
      if (showToast) {
        toast({
          title: "Licenses refreshed",
          description: "The license list has been updated.",
        });
      }
    } catch (error) {
      console.error('Error refreshing licenses:', error);
      toast({
        title: 'Error refreshing licenses',
        description: 'Failed to refresh licenses. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with no toast
  useEffect(() => {
    refreshLicenses(false);
  }, [refreshLicenses]);

  return {
    licenses,
    isLoading,
    setLicenses,
    refreshLicenses,
    lastRefreshed
  };
}
