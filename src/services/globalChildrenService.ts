import { httpClient } from '@/services/api/httpClient';

// Interfaces para o módulo de gestão global de crianças
export interface GlobalChild {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  age_months?: number;
  age_display?: string;
  user_id: string;
  journey_progress?: number;
  created_at: string;
  updated_at: string;
  
  // Informações do responsável/parent
  parent?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  
  // Informações de grupos/equipes
  teams?: Array<{
    id: string;
    name: string;
    description?: string;
    status: string;
    role: string; // papel da criança no grupo
    joined_at: string;
    members_count?: number;
  }>;
  
  // Estatísticas de quizzes
  quiz_stats?: {
    total_completed: number;
    total_available: number;
    completion_percentage: number;
    last_quiz_date?: string;
    average_score?: number;
  };
  
  // Informações de desenvolvimento
  development_info?: {
    milestones_completed: number;
    milestones_total: number;
    current_phase?: string;
    next_milestone?: string;
  };
}

export interface GlobalChildrenFilters {
  search?: string;
  age_range?: {
    min_months?: number;
    max_months?: number;
  };
  has_teams?: boolean;
  team_id?: string;
  professional_id?: string;
  progress_range?: {
    min?: number;
    max?: number;
  };
  parent_id?: string;
  status?: 'active' | 'inactive' | 'all';
}

export interface GlobalChildrenResponse {
  success: boolean;
  data?: {
    children: GlobalChild[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    total: number;
    page: number;
    totalPages: number;
    filters_applied: GlobalChildrenFilters;
  };
  error?: string;
}

export interface GlobalChildrenStats {
  total_children: number;
  children_with_teams: number;
  children_without_teams: number;
  average_progress: number;
  age_distribution: {
    '0-12_months': number;
    '13-24_months': number;
    '25-36_months': number;
    '37-48_months': number;
    '49_plus_months': number;
  };
  quiz_completion_stats: {
    high_performers: number; // >80%
    medium_performers: number; // 40-80%
    low_performers: number; // <40%
    no_quizzes: number;
  };
}

class GlobalChildrenService {
  private baseUrl = '/api/admin/children';

  // Buscar todas as crianças com filtros (para admin/owner)
  async getAllChildren(
    filters: GlobalChildrenFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<GlobalChildrenResponse> {
    try {
      console.log('🔥 CACHE REFRESH TEST - VERSÃO NOVA DO SERVIÇO! 🔥');
      console.log('🚀 GlobalChildrenService.getAllChildren - Iniciando requisição');
      console.log('📋 Parâmetros:', { filters, page, limit });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value)
          ])
        )
      });

      const url = `${this.baseUrl}?${params}`;
      console.log('🌐 URL da requisição:', url);
      
      const response = await httpClient.get(url);
      console.log('📦 Resposta HTTP recebida:', {
        hasData: !!response?.data,
        dataKeys: response?.data ? Object.keys(response.data) : []
      });
      
      // Verificar se a resposta existe e tem a estrutura esperada
      if (response && response.data) {
        console.log('✅ Resposta válida, verificando estrutura...');
        console.log('📊 Dados da resposta:', response.data);
        
        // CORREÇÃO: Se a resposta tem success explícito, usa a estrutura padrão
        if (response.data.success !== undefined) {
          console.log('🎉 Resposta com success explícito!');
          return {
            success: response.data.success,
            data: response.data.data,
            error: response.data.error
          };
        }
        
        // CORREÇÃO: Se a resposta tem children e pagination diretamente (problema atual)
        if (response.data.children && response.data.pagination) {
          console.log('🔧 Resposta com children/pagination diretos, adaptando...');
          return {
            success: true,
            data: {
              children: response.data.children,
              pagination: response.data.pagination,
              total: response.data.pagination.totalItems || 0,
              page: response.data.pagination.currentPage || 1,
              totalPages: response.data.pagination.totalPages || 1,
              filters_applied: filters
            }
          };
        }
        
        // Fallback para outras estruturas
        console.error('❌ Estrutura de resposta não reconhecida:', response.data);
        return {
          success: false,
          error: 'Estrutura de resposta não reconhecida'
        };
      } else {
        console.error('❌ Resposta inválida ou vazia:', response);
        return {
          success: false,
          error: 'Resposta inválida do servidor'
        };
      }
    } catch (error: unknown) {
      console.error('Erro ao buscar crianças globalmente:', error);
      
      // Melhor tratamento de diferentes tipos de erro
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
        const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || 'Erro de rede';
        return {
          success: false,
          error: errorMessage
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro inesperado ao buscar crianças'
      };
    }
  }

  // Buscar crianças de um profissional específico (baseado nos grupos)
  async getChildrenByProfessional(
    professionalId: string,
    filters: Omit<GlobalChildrenFilters, 'professional_id'> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<GlobalChildrenResponse> {
    try {
      const allFilters = { ...filters, professional_id: professionalId };
      return await this.getAllChildren(allFilters, page, limit);
    } catch (error) {
      console.error('Erro ao buscar crianças do profissional:', error);
      return {
        success: false,
        error: 'Erro ao buscar crianças do profissional'
      };
    }
  }

  // Buscar detalhes completos de uma criança específica
  async getChildDetails(childId: string): Promise<{
    success: boolean;
    data?: GlobalChild;
    error?: string;
  }> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/${childId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Erro ao buscar detalhes da criança'
        };
      }
    } catch (error: unknown) {
      console.error('Erro ao buscar detalhes da criança:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro inesperado'
      };
    }
  }

  // Buscar estatísticas globais das crianças
  async getGlobalStats(): Promise<{
    success: boolean;
    data?: GlobalChildrenStats;
    error?: string;
  }> {
    try {
      const response = await httpClient.get(`${this.baseUrl}/stats`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Erro ao buscar estatísticas'
        };
      }
    } catch (error: unknown) {
      console.error('Erro ao buscar estatísticas globais:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro inesperado'
      };
    }
  }

  // Buscar crianças de uma equipe específica
  async getChildrenByTeam(teamId: string): Promise<GlobalChildrenResponse> {
    try {
      const filters: GlobalChildrenFilters = { team_id: teamId };
      return await this.getAllChildren(filters);
    } catch (error) {
      console.error('Erro ao buscar crianças da equipe:', error);
      return {
        success: false,
        error: 'Erro ao buscar crianças da equipe'
      };
    }
  }

  // Atualizar informações básicas de uma criança (admin only)
  async deleteChild(childId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await httpClient.delete(`${this.baseUrl}/${childId}`);
      if (response.data?.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data?.message || 'Erro ao excluir criança' };
    } catch (error: unknown) {
      console.error('Erro ao excluir criança:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro inesperado' };
    }
  }

  async updateChild(
    childId: string,
    updates: Partial<{
      first_name: string;
      last_name: string;
      birthdate: string;
      journey_progress: number;
    }>
  ): Promise<{
    success: boolean;
    data?: GlobalChild;
    error?: string;
  }> {
    try {
      const response = await httpClient.put(`${this.baseUrl}/${childId}`, updates);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Erro ao atualizar criança'
        };
      }
    } catch (error: unknown) {
      console.error('Erro ao atualizar criança:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro inesperado'
      };
    }
  }
}

export const globalChildrenService = new GlobalChildrenService();
