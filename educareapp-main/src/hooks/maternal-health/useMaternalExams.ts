
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Disabled hook since maternal_exams table doesn't exist yet
export const useMaternalExams = (profileId?: string) => {
  const { toast } = useToast();

  // Return empty data and disabled functionality
  return {
    exams: [],
    isLoading: false,
    addExam: async () => {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'Esta funcionalidade será implementada em breve.',
        variant: 'default',
      });
    },
    isAdding: false,
  };
};
