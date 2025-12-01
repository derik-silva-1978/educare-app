
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Disabled hook since maternal_health_profile table doesn't exist yet
export const useMaternalHealthProfile = (userId?: string) => {
  const { toast } = useToast();

  // Return empty data and disabled functionality
  return {
    profile: null,
    isLoading: false,
    createProfile: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    updateProfile: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    isCreating: false,
    isUpdating: false,
  };
};
