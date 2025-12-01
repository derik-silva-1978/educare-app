import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  activityService, 
  Activity, 
  CreateActivityData, 
  UpdateActivityData, 
  ActivityFilters 
} from '../services/activityService';

interface UseActivityManagementReturn {
  // Estados
  activities: Activity[];
  loading: boolean;
  error: string | null;
  stats: Record<string, unknown> | null;
  
  // Paginação
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Filtros
  filters: ActivityFilters;
  
  // Ações
  loadActivities: () => Promise<void>;
  loadStats: () => Promise<void>;
  createActivity: (data: CreateActivityData) => Promise<boolean>;
  updateActivity: (id: string, data: UpdateActivityData) => Promise<boolean>;
  deleteActivity: (id: string) => Promise<boolean>;
  toggleActivityStatus: (id: string) => Promise<boolean>;
  setPage: (page: number) => void;
  setFilters: (filters: ActivityFilters) => void;
  clearFilters: () => void;
  refreshData: () => Promise<void>;
}

export const useActivityManagement = (
  initialPage = 1,
  itemsPerPage = 10
): UseActivityManagementReturn => {
  // Estados principais
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Estados de filtros
  const [filters, setFiltersState] = useState<ActivityFilters>({});

  // Carregar atividades
  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await activityService.getActivities(
        currentPage,
        itemsPerPage,
        filters
      );
      
      if (response.success) {
        setActivities(response.data.activities);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Falha ao carregar atividades');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar atividades: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await activityService.getActivityStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Criar atividade
  const createActivity = useCallback(async (data: CreateActivityData): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await activityService.createActivity(data);
      
      if (response.success) {
        toast.success('Atividade criada com sucesso!');
        await loadActivities();
        await loadStats();
        return true;
      } else {
        throw new Error('Falha ao criar atividade');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao criar atividade: ' + errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadActivities, loadStats]);

  // Atualizar atividade
  const updateActivity = useCallback(async (
    id: string, 
    data: UpdateActivityData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await activityService.updateActivity(id, data);
      
      if (response.success) {
        toast.success('Atividade atualizada com sucesso!');
        await loadActivities();
        await loadStats();
        return true;
      } else {
        throw new Error('Falha ao atualizar atividade');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao atualizar atividade: ' + errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadActivities, loadStats]);

  // Deletar atividade
  const deleteActivity = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await activityService.deleteActivity(id);
      
      if (response.success) {
        toast.success('Atividade removida com sucesso!');
        await loadActivities();
        await loadStats();
        return true;
      } else {
        throw new Error('Falha ao remover atividade');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao remover atividade: ' + errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadActivities, loadStats]);

  // Alternar status da atividade
  const toggleActivityStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await activityService.toggleActivityStatus(id);
      
      if (response.success) {
        toast.success('Status da atividade atualizado!');
        await loadActivities();
        await loadStats();
        return true;
      } else {
        throw new Error('Falha ao alterar status da atividade');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao alterar status: ' + errorMessage);
      return false;
    }
  }, [loadActivities, loadStats]);

  // Definir página
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Definir filtros
  const setFilters = useCallback((newFilters: ActivityFilters) => {
    setFiltersState(newFilters);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
  }, []);

  // Atualizar dados
  const refreshData = useCallback(async () => {
    await Promise.all([loadActivities(), loadStats()]);
  }, [loadActivities, loadStats]);

  // Carregar dados iniciais
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // Estados
    activities,
    loading,
    error,
    stats,
    
    // Paginação
    currentPage,
    totalPages,
    totalItems,
    
    // Filtros
    filters,
    
    // Ações
    loadActivities,
    loadStats,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityStatus,
    setPage,
    setFilters,
    clearFilters,
    refreshData,
  };
};
