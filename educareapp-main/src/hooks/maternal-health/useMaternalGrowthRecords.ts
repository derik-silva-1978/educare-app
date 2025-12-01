
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Disabled hook since maternal_growth_records table doesn't exist yet
export const useMaternalGrowthRecords = (profileId?: string) => {
  const { toast } = useToast();

  // Return empty data and disabled functionality
  return {
    growthRecords: [],
    isLoading: false,
    addGrowthRecord: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    isAdding: false,
  };
};
