
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Disabled hook since maternal_health_records table doesn't exist yet
export const useMaternalHealthRecords = (profileId?: string) => {
  const { toast } = useToast();

  // Return empty data and disabled functionality
  return {
    healthRecords: [],
    isLoading: false,
    addHealthRecord: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    isAdding: false,
  };
};
