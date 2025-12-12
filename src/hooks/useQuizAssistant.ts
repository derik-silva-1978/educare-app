import { useState } from 'react';
import { httpClient } from '@/services/api';
import type { DevelopmentDomain, DevelopmentQuestion } from '@/types/assessment';

interface QuizAssistanceResponse {
  answer: string;
  suggestions: string[];
  resources: { title: string; url: string }[];
}

/**
 * Hook for generating personalized quiz assistance based on domain and questions
 * Migrated from Supabase Edge Function to backend endpoint POST /api/journey/quiz-assistant
 */
export function useQuizAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<QuizAssistanceResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get assistance for a specific domain and set of questions
   * @param domain The development domain
   * @param questions Questions related to the domain
   * @param studentContext Additional context about the student (optional)
   * @param customPrompt A custom prompt to override the default (optional)
   * @returns The generated assistance data
   */
  const getAssistance = async (
    domain: DevelopmentDomain,
    questions?: DevelopmentQuestion[],
    studentContext?: string,
    customPrompt?: string
  ): Promise<QuizAssistanceResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const prompt = customPrompt || `Preciso de sugestões de atividades para o domínio ${domain}`;
      
      const payload = {
        domain,
        questions,
        studentContext,
        prompt
      };

      const response = await httpClient.post<QuizAssistanceResponse>(
        '/journey/quiz-assistant',
        payload
      );

      if (!response.success) {
        throw new Error(response.error || 'Erro ao chamar quiz-assistant');
      }

      if (!response.data) {
        throw new Error('Nenhum dado recebido do quiz-assistant');
      }

      setData(response.data);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('Quiz assistance error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAssistance,
    isLoading,
    data,
    error,
    reset: () => {
      setData(null);
      setError(null);
    }
  };
}
