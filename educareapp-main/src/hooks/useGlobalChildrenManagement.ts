import { useState, useEffect, useCallback } from 'react';
import { 
  globalChildrenService, 
  GlobalChild, 
  GlobalChildrenFilters, 
  GlobalChildrenStats 
} from '@/services/globalChildrenService';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { toast } from 'sonner';

export function useGlobalChildrenManagement() {
  const { user } = useCustomAuth();
  const [children, setChildren] = useState<GlobalChild[]>([]);
  const [stats, setStats] = useState<GlobalChildrenStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChildren, setTotalChildren] = useState(0);
  const [filters, setFilters] = useState<GlobalChildrenFilters>({});

  // Carregar crianças baseado no papel do usuário
  const loadChildren = useCallback(async (
    page: number = 1,
    limit: number = 20,
    appliedFilters: GlobalChildrenFilters = {}
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔄 Carregando crianças - Role: ${user?.role}, Página: ${page}`);

      let response;

      // Determinar qual método usar baseado no papel do usuário
      if (user?.role === 'professional') {
        // Profissional vê apenas crianças dos grupos que participa
        console.log('📋 Chamando getChildrenByProfessional...');
        response = await globalChildrenService.getChildrenByProfessional(
          user.id,
          appliedFilters,
          page,
          limit
        );
      } else if (user?.role === 'admin' || user?.role === 'owner') {
        // Admin/Owner vê todas as crianças
        console.log('👑 Chamando getAllChildren...');
        response = await globalChildrenService.getAllChildren(
          appliedFilters,
          page,
          limit
        );
      } else {
        // Outros roles não têm acesso
        console.error('🚫 Acesso não autorizado para role:', user?.role);
        setError('Acesso não autorizado');
        return;
      }

      console.log('📦 Resposta recebida:', response);

      if (response && response.success && response.data) {
        console.log('✅ Resposta válida, processando dados...');
        console.log('📊 Dados recebidos:', {
          children: response.data.children?.length || 0,
          pagination: response.data.pagination
        });
        
        setChildren(response.data.children || []);
        setTotalChildren(response.data.pagination?.totalItems || 0);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setFilters(appliedFilters); // Usar os filtros aplicados localmente
        
        console.log(`✅ Carregadas ${response.data.children?.length || 0} crianças (página ${response.data.pagination?.currentPage || 1})`);
      } else {
        console.error('❌ Resposta inválida ou sem sucesso:', {
          hasResponse: !!response,
          success: response?.success,
          hasData: !!response?.data,
          error: response?.error
        });
        setError(response?.error || 'Erro ao carregar crianças');
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao carregar crianças';
      setError(errorMessage);
      console.error('💥 Erro inesperado:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Carregar estatísticas globais (apenas para admin/owner)
  const loadStats = useCallback(async () => {
    if (user?.role !== 'admin' && user?.role !== 'owner') {
      return; // Profissionais não veem estatísticas globais
    }

    try {
      const response = await globalChildrenService.getGlobalStats();
      
      if (response.success && response.data) {
        setStats(response.data);
        console.log('✅ Estatísticas globais carregadas');
      } else {
        console.error('❌ Erro ao carregar estatísticas:', response.error);
      }
    } catch (err) {
      console.error('💥 Erro ao carregar estatísticas:', err);
    }
  }, [user]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: GlobalChildrenFilters) => {
    setCurrentPage(1); // Reset para primeira página
    loadChildren(1, 20, newFilters);
  }, [loadChildren]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    const emptyFilters: GlobalChildrenFilters = {};
    setFilters(emptyFilters);
    setCurrentPage(1);
    loadChildren(1, 20, emptyFilters);
  }, [loadChildren]);

  // Navegar para página específica
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadChildren(page, 20, filters);
    }
  }, [loadChildren, totalPages, filters]);

  // Buscar detalhes de uma criança específica
  const getChildDetails = useCallback(async (childId: string) => {
    try {
      const response = await globalChildrenService.getChildDetails(childId);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        toast.error(response.error || 'Erro ao buscar detalhes da criança');
        return null;
      }
    } catch (err) {
      toast.error('Erro inesperado ao buscar detalhes da criança');
      return null;
    }
  }, []);

  // Atualizar criança (apenas admin/owner)
  const updateChild = useCallback(async (
    childId: string,
    updates: Partial<{
      first_name: string;
      last_name: string;
      birthdate: string;
      journey_progress: number;
    }>
  ) => {
    if (user?.role !== 'admin' && user?.role !== 'owner') {
      toast.error('Acesso não autorizado para edição');
      return false;
    }

    try {
      const response = await globalChildrenService.updateChild(childId, updates);
      
      if (response.success) {
        toast.success('Criança atualizada com sucesso');
        
        // Atualizar a lista local
        setChildren(prev => prev.map(child => 
          child.id === childId 
            ? { ...child, ...updates }
            : child
        ));
        
        return true;
      } else {
        toast.error(response.error || 'Erro ao atualizar criança');
        return false;
      }
    } catch (err) {
      toast.error('Erro inesperado ao atualizar criança');
      return false;
    }
  }, [user]);

  // Refresh completo dos dados
  const refreshData = useCallback(() => {
    loadChildren(currentPage, 20, filters);
    loadStats();
  }, [loadChildren, loadStats, currentPage, filters]);

  // Carregar dados na inicialização
  useEffect(() => {
    if (user?.id) {
      loadChildren();
      loadStats();
    }
  }, [user?.id, loadChildren, loadStats]);

  // Função para obter permissões baseadas no papel
  const permissions = {
    canViewAll: user?.role === 'admin' || user?.role === 'owner',
    canEdit: user?.role === 'admin' || user?.role === 'owner',
    canViewStats: user?.role === 'admin' || user?.role === 'owner',
    canViewTeams: true, // Todos podem ver informações de equipes
    isProfessional: user?.role === 'professional'
  };

  return {
    // Dados
    children,
    stats,
    totalChildren,
    currentPage,
    totalPages,
    filters,
    
    // Estados
    isLoading,
    error,
    permissions,
    
    // Ações
    loadChildren,
    applyFilters,
    clearFilters,
    goToPage,
    getChildDetails,
    updateChild,
    refreshData
  };
}
