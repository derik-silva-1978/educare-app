import { useState, useEffect, useCallback } from 'react';
import { activityService, ActivityItem } from '@/services/activityService';

export interface ActivityStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalChildren: number;
  newChildrenThisWeek: number;
  totalTeams: number;
  activeChats: number;
}

export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalUsers: 0,
    newUsersThisWeek: 0,
    totalChildren: 0,
    newChildrenThisWeek: 0,
    totalTeams: 0,
    activeChats: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar atividades recentes
  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [activitiesData, statsData] = await Promise.all([
        activityService.getRecentActivities(10),
        activityService.getActivityStats()
      ]);
      
      setActivities(activitiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades do sistema');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar atividades na inicialização
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Função para atualizar atividades
  const refreshActivities = useCallback(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    stats,
    isLoading,
    error,
    refreshActivities
  };
}
