
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnamneseData } from './anamnese/useAnamneseData';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { AnamneseFormData } from '@/types/anamneseTypes';

export const useChildAnamnese = (childId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    anamneseData, 
    isLoading, 
    error, 
    isDeleting, 
    deleteAnamnese,
    calculateCompletionPercentage 
  } = useAnamneseData(childId);
  
  // Save or update anamnese data
  const { mutate: saveAnamnese, isPending: isSaving } = useMutation({
    mutationFn: async ({ formData }: { formData: AnamneseFormData }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      try {
        // Calculate completion percentage (simplified)
        const completionPercentage = 100; // Simplified for now
        const isCompleted = true;
        
        // Check if record exists
        if (anamneseData) {
          // Update existing record
          const { error } = await supabase
            .from('child_anamnese')
            .update({
              ...formData,
              completion_percentage: completionPercentage,
              completed: isCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('id', anamneseData.id);
            
          if (error) throw error;
          return { ...anamneseData, ...formData };
        } else {
          // Insert new record
          const { data, error } = await supabase
            .from('child_anamnese')
            .insert({
              ...formData,
              child_id: childId,
              user_id: user.id,
              completion_percentage: completionPercentage,
              completed: isCompleted
            })
            .select()
            .single();
            
          if (error) throw error;
          return data;
        }
      } catch (err: any) {
        console.error('Error saving anamnese data:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['child_anamnese', childId], data);
      toast({
        title: 'Dados salvos',
        description: 'As informações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      console.error('Error in mutation:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'destructive',
      });
    }
  });
  
  return {
    anamneseData,
    isLoading,
    isSaving,
    isDeleting,
    error,
    saveAnamnese,
    deleteAnamnese
  };
};
