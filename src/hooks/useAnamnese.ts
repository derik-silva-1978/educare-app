
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { AnamneseFormData } from '@/types/anamneseTypes';

export const useAnamnese = (childId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutate: createAnamnese, isPending: isLoading } = useMutation({
    mutationFn: async (data: AnamneseFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase
        .from('child_anamnese')
        .insert({
          ...data,
          child_id: childId,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Anamnese criada',
        description: 'Os dados foram salvos com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['child_anamnese', childId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar os dados.',
        variant: 'destructive',
      });
    }
  });
  
  const { mutate: updateAnamnese } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnamneseFormData }) => {
      const { data: result, error } = await supabase
        .from('child_anamnese')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Anamnese atualizada',
        description: 'Os dados foram salvos com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['child_anamnese', childId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Não foi possível atualizar os dados.',
        variant: 'destructive',
      });
    }
  });
  
  return {
    createAnamnese,
    updateAnamnese,
    isLoading
  };
};
