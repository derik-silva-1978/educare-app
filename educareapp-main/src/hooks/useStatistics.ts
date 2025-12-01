import { useState, useEffect, useCallback } from 'react';
import { statisticsService, DashboardStats, ChildrenRegistrationStats, QuizCompletionStats } from '@/services/statisticsService';

export const useStatistics = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [childrenStats, setChildrenStats] = useState<ChildrenRegistrationStats[]>([]);
  const [quizStats, setQuizStats] = useState<QuizCompletionStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await statisticsService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      setError('Erro ao carregar estatísticas do dashboard');
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchChildrenRegistrationStats = useCallback(async (months: number = 12) => {
    try {
      const stats = await statisticsService.getChildrenRegistrationStats(months);
      setChildrenStats(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas de crianças:', err);
    }
  }, []);

  const fetchQuizCompletionStats = useCallback(async (days: number = 30) => {
    try {
      const stats = await statisticsService.getQuizCompletionStats(days);
      setQuizStats(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas de quizzes:', err);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchChildrenRegistrationStats(),
      fetchQuizCompletionStats()
    ]);
  }, [fetchDashboardStats, fetchChildrenRegistrationStats, fetchQuizCompletionStats]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    dashboardStats,
    childrenStats,
    quizStats,
    isLoading,
    error,
    refreshStats,
    fetchChildrenRegistrationStats,
    fetchQuizCompletionStats
  };
};
