
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnamneseData, AnamneseFormData } from '@/types/anamneseTypes';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';

export const useAnamneseData = (childId: string) => {
  const [anamneseData, setAnamneseData] = useState<AnamneseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (childId && user) {
      fetchAnamneseData();
    }
  }, [childId, user]);

  const fetchAnamneseData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('child_anamnese')
        .select('*')
        .eq('child_id', childId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      setAnamneseData(data);
    } catch (err: any) {
      console.error('Error fetching anamnese data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnamnese = async () => {
    if (!anamneseData) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('child_anamnese')
        .delete()
        .eq('id', anamneseData.id);

      if (error) throw error;

      setAnamneseData(null);
      toast({
        title: 'Anamnese excluída',
        description: 'Os dados foram removidos com sucesso.',
      });
    } catch (err: any) {
      console.error('Error deleting anamnese:', err);
      toast({
        title: 'Erro ao excluir',
        description: err.message || 'Não foi possível excluir os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateCompletionPercentage = (data: AnamneseFormData): number => {
    const fields = Object.values(data);
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return {
    anamneseData,
    isLoading,
    isDeleting,
    error,
    deleteAnamnese,
    calculateCompletionPercentage,
    refetch: fetchAnamneseData
  };
};
