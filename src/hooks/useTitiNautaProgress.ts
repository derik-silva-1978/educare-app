import { useState, useCallback } from 'react';
import * as titiNautaService from '@/services/api/titiNautaService';
import { useToast } from '@/hooks/use-toast';
import { QuizAnswer } from '@/types/titinauta';

interface UseTitiNautaProgressReturn {
  saveProgress: (childId: string, journeyId: string, currentStep: number, completedSteps: string[]) => Promise<boolean>;
  saveAnswer: (childId: string, questionId: string, selectedOptionId: string) => Promise<boolean>;
  isSaving: boolean;
  error: string | null;
}

export const useTitiNautaProgress = (): UseTitiNautaProgressReturn => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Salva o progresso da jornada
   */
  const saveProgress = useCallback(async (
    childId: string,
    journeyId: string,
    currentStep: number,
    completedSteps: string[]
  ): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log('Salvando progresso:', { childId, journeyId, currentStep, completedSteps });
      
      const response = await titiNautaService.saveProgress(childId, {
        journeyId,
        currentStep,
        completedSteps
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Erro ao salvar progresso');
      }
      
      console.log('Progresso salvo com sucesso:', response.data);
      
      // Mostrar toast de sucesso
      toast({
        title: 'Progresso salvo',
        description: `Progresso: ${Math.round(response.data.progress)}%`,
        variant: 'default'
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar progresso';
      setError(errorMessage);
      
      // Mostrar toast de erro
      toast({
        title: 'Erro ao salvar progresso',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  /**
   * Salva uma resposta de quiz
   */
  const saveAnswer = useCallback(async (
    childId: string,
    questionId: string,
    selectedOptionId: string
  ): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log('Salvando resposta:', { childId, questionId, selectedOptionId });
      
      const response = await titiNautaService.saveAnswer(childId, {
        questionId,
        selectedOptionId
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Erro ao salvar resposta');
      }
      
      console.log('Resposta salva com sucesso:', response.data);
      return true;
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar resposta';
      setError(errorMessage);
      
      // Mostrar toast de erro
      toast({
        title: 'Erro ao salvar resposta',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return {
    saveProgress,
    saveAnswer,
    isSaving,
    error
  };
};
