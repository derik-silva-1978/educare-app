
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Disabled hook since maternal_medications table doesn't exist yet
export const useMaternalMedications = (profileId?: string) => {
  const { toast } = useToast();

  // Return empty data and disabled functionality
  return {
    medications: [],
    isLoading: false,
    addMedication: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    isAdding: false,
  };
};
