import { useQuery } from '@tanstack/react-query';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { dashboardService, type DashboardMetrics, type DashboardRawData } from '@/services/api/dashboardService';

export const useDashboardMetrics = () => {
  const { user } = useAuth();
  const isParent = user?.role === 'parent';
  const isProfessional = user?.role === 'professional';

  // Fetch comprehensive dashboard data from backend customizado
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics', user?.id, user?.role],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        // Buscar métricas do dashboard do backend customizado
        const response = await dashboardService.getUserDashboardMetrics();
        return response;
      } catch (error) {
        console.error('Erro ao buscar métricas do dashboard:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30, // Cache por 30 segundos
    gcTime: 1000 * 60 * 5, // Keep cache for 5 minutes
  });

  // Os dados já vêm processados do backend, não precisamos calcular aqui
  // O backend já faz todos os cálculos de progresso baseado na idade

  // Os dados já vêm processados do backend customizado
  const getProcessedData = () => {
    if (!dashboardData) {
      return {
        metrics: {
          totalChildren: 0,
          childrenInProgress: 0,
          completedJourneys: 0,
          totalSessions: 0,
          activeSessions: 0,
          completedSessions: 0,
          totalReports: 0,
          averageProgress: 0,
          childrenWithProgress: []
        },
        rawData: {
          children: [],
          sessions: [],
          responses: [],
          reports: [],
          professionalRelations: []
        }
      };
    }

    return {
      metrics: dashboardData.metrics,
      rawData: dashboardData.rawData
    };
  };

  const { metrics, rawData } = getProcessedData();

  return {
    metrics,
    rawData,
    isLoading,
    error
  };
};