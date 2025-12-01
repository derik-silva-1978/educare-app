import apiClient from './api/httpClient';

// Interfaces para convites de equipe baseado em team_members
export interface TeamInvite {
  id: string;
  team_id: string;
  team_name: string;
  team_description: string;
  team_type: 'professional' | 'family' | 'mixed';
  invited_by_id: string;
  invited_by_name: string;
  role: 'admin' | 'member' | 'professional';
  status: 'invited' | 'active';
  invited_at: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamInviteResponse {
  success: boolean;
  data: TeamInvite;
  message?: string;
}

export interface TeamInviteListResponse {
  success: boolean;
  data: {
    invites: TeamInvite[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

// Serviço de convites de equipe
class TeamInviteService {
  private baseUrl = '/api/team-invites';

  // Listar convites de equipe recebidos (para aceitar)
  async getReceivedInvites(page = 1, limit = 10): Promise<TeamInviteListResponse> {
    try {
      const url = `${this.baseUrl}/received?page=${page}&limit=${limit}`;
      const response = await apiClient.get(url);
      return {
        success: response.success,
        data: {
          invites: response.data?.invites || [],
          total: response.data?.total || 0,
          page: page,
          limit: limit
        },
        message: response.message
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar convites de equipe recebidos';
      throw new Error(errorMessage);
    }
  }

  // Aceitar convite de equipe
  async acceptInvite(inviteId: string): Promise<TeamInviteResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/accept`, {});
      return {
        success: response.success,
        data: response.data as TeamInvite,
        message: response.message
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aceitar convite de equipe';
      throw new Error(errorMessage);
    }
  }

  // Recusar convite de equipe
  async declineInvite(inviteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/decline`, {});
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao recusar convite de equipe';
      throw new Error(errorMessage);
    }
  }

  // Verificar se há convites de equipe pendentes
  async getPendingInvitesCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/pending/count`);
      return {
        count: response.data?.count || 0
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar convites de equipe pendentes';
      throw new Error(errorMessage);
    }
  }
}

export const teamInviteService = new TeamInviteService();
