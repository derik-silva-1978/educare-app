import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useSelectedChild } from '@/contexts/SelectedChildContext';

export const useIndividualChildMetrics = () => {
  const { user } = useAuth();
  const { selectedChildId } = useSelectedChild();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['child-modules', selectedChildId, user?.id],
    queryFn: async () => {
      if (!selectedChildId || !user?.id) return null;

      // Chamar Edge Function para calcular módulos individuais
      const { data, error } = await supabase.functions.invoke('calculate-child-progress', {
        body: {
          child_id: selectedChildId,
          user_id: user.id,
          calculate_modules: true
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to calculate modules');

      return data.data;
    },
    enabled: !!selectedChildId && !!user?.id,
  });

  // Formattar dados para compatibilidade com o componente existente
  const formattedMetrics = metrics ? {
    completedModules: metrics.completed_modules || 0,
    totalModules: metrics.total_modules || 0,
    moduleProgress: metrics.completion_percentage || 0,
    currentModule: metrics.current_module ? {
      module_name: metrics.current_module.module_name,
      completion_percentage: metrics.current_module.completion_percentage || 0,
      age_min_months: metrics.current_module.age_min_months || 0,
      age_max_months: metrics.current_module.age_max_months || 0,
      total_questions: metrics.current_module.total_questions || 0,
      answered_questions: metrics.current_module.answered_questions || 0,
      isCurrentModule: true
    } : null,
    nextModule: metrics.next_module ? {
      module_name: metrics.next_module.module_name,
      age_min_months: metrics.next_module.age_min_months,
      age_max_months: metrics.next_module.age_max_months,
      isFuture: true
    } : null,
    activeSessions: 0, // Será calculado separadamente se necessário
    moduleDetails: metrics.modules || []
  } : {
    completedModules: 0,
    totalModules: 0,
    moduleProgress: 0,
    currentModule: null,
    nextModule: null,
    activeSessions: 0,
    moduleDetails: []
  };

  return {
    childMetrics: metrics,
    metrics: formattedMetrics,
    isLoading,
    error,
  };
};