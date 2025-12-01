import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  userActivitiesService, 
  UserWithChildren, 
  UserActivitiesFilters 
} from '../services/userActivitiesService';
import { Activity } from '../services/activityService';

interface UseUserActivitiesManagementReturn {
  // Estados principais
  users: UserWithChildren[];
  selectedUser: UserWithChildren | null;
  userActivities: Activity[];
  loading: boolean;
  error: string | null;
  stats: Record<string, unknown> | null;
  
  // Paginação
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Filtros
  filters: UserActivitiesFilters;
  
  // Ações
  loadUsers: () => Promise<void>;
  loadUserActivities: (userId: string) => Promise<void>;
  loadStats: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: UserActivitiesFilters) => void;
  clearFilters: () => void;
  selectUser: (user: UserWithChildren | null) => void;
  refreshData: () => Promise<void>;
}

export const useUserActivitiesManagement = (
  initialPage = 1,
  itemsPerPage = 10
): UseUserActivitiesManagementReturn => {
  // Estados principais
  const [users, setUsers] = useState<UserWithChildren[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithChildren | null>(null);
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Estados de filtros
  const [filters, setFiltersState] = useState<UserActivitiesFilters>({});

  // Carregar usuários com crianças
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userActivitiesService.getAllUsersWithActivities(
        currentPage,
        itemsPerPage,
        filters
      );
      
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        throw new Error('Falha ao carregar usuários');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar usuários: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

  // Carregar atividades de um usuário específico
  const loadUserActivities = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userActivitiesService.getUserActivities(userId);
      
      if (response.success) {
        setUserActivities(response.data.activities);
        setSelectedUser(response.data.user);
      } else {
        throw new Error('Falha ao carregar atividades do usuário');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar atividades: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await userActivitiesService.getUserActivitiesStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  // Definir página
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Definir filtros
  const setFilters = useCallback((newFilters: UserActivitiesFilters) => {
    setFiltersState(newFilters);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
  }, []);

  // Selecionar usuário
  const selectUser = useCallback((user: UserWithChildren | null) => {
    setSelectedUser(user);
    if (!user) {
      setUserActivities([]);
    }
  }, []);

  // Atualizar dados
  const refreshData = useCallback(async () => {
    await Promise.all([loadUsers(), loadStats()]);
  }, [loadUsers, loadStats]);

  // Carregar dados iniciais
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // Estados
    users,
    selectedUser,
    userActivities,
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
    loadUsers,
    loadUserActivities,
    loadStats,
    setPage,
    setFilters,
    clearFilters,
    selectUser,
    refreshData,
  };
};
