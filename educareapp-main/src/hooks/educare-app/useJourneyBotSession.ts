
import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { JourneyBotSession, JourneyBotQuestion } from '@/types/journey-bot';
import { JourneyBotSessionService } from './journey-bot/sessionService';
import { UseJourneyBotSessionProps, UseJourneyBotSessionReturn } from './journey-bot/types';

export const useJourneyBotSession = ({ childId, childAge }: UseJourneyBotSessionProps): UseJourneyBotSessionReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentSession, setCurrentSession] = useState<JourneyBotSession | null>(null);
  const [questions, setQuestions] = useState<JourneyBotQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert age to months for comparison - using ceil for rounding up
  const childAgeInMonths = Math.ceil(childAge * 12);

  const fetchQuestions = useCallback(async () => {
    try {
      console.log('Fetching questions for age:', childAgeInMonths, 'months (', childAge, 'years)');
      
      const questions = await JourneyBotSessionService.fetchQuestions(childAgeInMonths);
      setQuestions(questions);
      return questions;
      
    } catch (err: any) {
      console.error('Exception fetching questions:', err);
      setError(err.message);
      return [];
    }
  }, [childAgeInMonths, childAge]);

  const fetchOrCreateSession = useCallback(async (availableQuestions: JourneyBotQuestion[]) => {
    if (!user || !childId) {
      return null;
    }

    try {
      setIsCreatingSession(true);
      
      const session = await JourneyBotSessionService.fetchOrCreateSession(
        user.id,
        childId,
        availableQuestions
      );
      
      setCurrentSession(session);
      return session;
      
    } catch (err: any) {
      console.error('Exception in fetchOrCreateSession:', err);
      setError(err.message);
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, [user, childId]);

  const initializeSession = useCallback(async () => {
    if (!user || !childId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Initializing session for child:', childId, 'age:', childAge, 'months:', childAgeInMonths);
      
      // First fetch questions
      const availableQuestions = await fetchQuestions();
      
      if (availableQuestions.length === 0) {
        setError(`Não encontramos perguntas adequadas para a idade de ${childAge} anos (${childAgeInMonths} meses). As perguntas foram carregadas no sistema, tente novamente em alguns instantes.`);
        setIsLoading(false);
        return;
      }

      // Then create or fetch session
      await fetchOrCreateSession(availableQuestions);
      
    } catch (err: any) {
      console.error('Error initializing session:', err);
      setError(`Erro ao inicializar sessão: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, childId, childAge, childAgeInMonths, fetchQuestions, fetchOrCreateSession]);

  // Initialize on mount and when dependencies change
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const refreshSession = useCallback(() => {
    initializeSession();
  }, [initializeSession]);

  return {
    currentSession,
    questions,
    isLoading,
    isCreatingSession,
    error,
    refreshSession
  };
};
