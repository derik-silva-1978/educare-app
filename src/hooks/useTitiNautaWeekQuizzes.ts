import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth } from './useCustomAuth';
import httpClient from '@/services/api/httpClient';
import { useToast } from './use-toast';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizFeedback {
  [key: string]: string;
}

export interface QuizKnowledge {
  correct_answer: string;
  explanation: string;
}

export interface WeekQuiz {
  id: string;
  week_id: string;
  domain: string;
  domain_id: string;
  title: string;
  question: string;
  options: QuizOption[];
  feedback: QuizFeedback;
  knowledge: QuizKnowledge;
}

interface UseTitiNautaWeekQuizzesProps {
  weekNumber: number;
  minAgeMonths: number;
  maxAgeMonths: number;
  autoLoad?: boolean;
}

interface UseTitiNautaWeekQuizzesReturn {
  quizzes: WeekQuiz[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar quizzes de uma semana específica
 * baseados na faixa etária da criança
 */
export const useTitiNautaWeekQuizzes = ({
  weekNumber,
  minAgeMonths,
  maxAgeMonths,
  autoLoad = true
}: UseTitiNautaWeekQuizzesProps): UseTitiNautaWeekQuizzesReturn => {
  const { user } = useCustomAuth();
  const { toast } = useToast();
  
  const [quizzes, setQuizzes] = useState<WeekQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Buscar quizzes da API
   */
  const fetchQuizzes = useCallback(async () => {
    if (!user || weekNumber < 1) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpClient.get(
        `/journey-questions/week/${weekNumber}/quizzes?min_age_months=${minAgeMonths}&max_age_months=${maxAgeMonths}`
      );
      
      if (response.success && response.data) {
        setQuizzes(response.data);
      } else {
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar quizzes da semana:', err);
      setError(err as Error);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, weekNumber, minAgeMonths, maxAgeMonths]);
  
  /**
   * Carregar quizzes automaticamente
   */
  useEffect(() => {
    if (autoLoad && weekNumber > 0) {
      fetchQuizzes();
    }
  }, [autoLoad, fetchQuizzes, weekNumber]);
  
  return {
    quizzes,
    isLoading,
    error,
    refetch: fetchQuizzes
  };
};
