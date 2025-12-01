import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth } from './useCustomAuth';
import { journeyQuestionsService, JourneyQuestion } from '@/services/journeyQuestionsService';
import { useToast } from './use-toast';

interface UseTitiNautaJourneyQuestionsProps {
  childAgeInMonths: number;
  autoLoad?: boolean;
}

interface UseTitiNautaJourneyQuestionsReturn {
  questions: JourneyQuestion[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getQuestionsByWeek: (week: number) => JourneyQuestion[];
  getQuestionsByMonth: (month: number) => JourneyQuestion[];
}

/**
 * Hook para buscar perguntas da jornada do TitiNauta 2.0
 * baseadas na faixa etária da criança
 */
export const useTitiNautaJourneyQuestions = ({
  childAgeInMonths,
  autoLoad = true
}: UseTitiNautaJourneyQuestionsProps): UseTitiNautaJourneyQuestionsReturn => {
  const { user } = useCustomAuth();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<JourneyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Buscar perguntas da API baseadas na idade da criança
   */
  const fetchQuestions = useCallback(async () => {
    if (!user || childAgeInMonths < 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar perguntas que se aplicam à faixa etária da criança
      // Incluindo um buffer de ±1 mês para garantir conteúdo relevante
      const minAge = Math.max(0, childAgeInMonths - 1);
      const maxAge = childAgeInMonths + 2;
      
      const response = await journeyQuestionsService.listQuestions({
        min_age_months: minAge,
        max_age_months: maxAge,
        is_active: true
      });
      
      if (response.success && response.data) {
        // Ordenar por order_index
        const sortedQuestions = response.data.sort((a, b) => a.order_index - b.order_index);
        setQuestions(sortedQuestions);
      } else {
        throw new Error(response.error || 'Erro ao buscar perguntas');
      }
    } catch (err) {
      console.error('Erro ao buscar perguntas da jornada:', err);
      setError(err as Error);
      toast({
        title: 'Erro ao carregar conteúdo',
        description: 'Não foi possível carregar as perguntas da jornada. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, childAgeInMonths, toast]);
  
  /**
   * Filtrar perguntas por semana
   */
  const getQuestionsByWeek = useCallback((week: number): JourneyQuestion[] => {
    return questions.filter(q => q.week === week);
  }, [questions]);
  
  /**
   * Filtrar perguntas por mês (baseado em meta_min_months e meta_max_months)
   */
  const getQuestionsByMonth = useCallback((month: number): JourneyQuestion[] => {
    return questions.filter(q => 
      q.meta_min_months <= month && q.meta_max_months >= month
    );
  }, [questions]);
  
  /**
   * Carregar perguntas automaticamente quando o componente monta
   */
  useEffect(() => {
    if (autoLoad) {
      fetchQuestions();
    }
  }, [autoLoad, fetchQuestions]);
  
  return {
    questions,
    isLoading,
    error,
    refetch: fetchQuestions,
    getQuestionsByWeek,
    getQuestionsByMonth
  };
};
