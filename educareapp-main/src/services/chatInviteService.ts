import apiClient from './api/httpClient';

// Interfaces para convites de chat
export interface ChatInvite {
  id: string;
  team_id: string;
  invited_user_id?: string;
  invited_by_id?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  created_at: string;
  updated_at: string;
  
  // Campos formatados que vêm do backend
  team_name: string;
  invited_by_name: string;
  
  // Dados relacionados (opcionais)
  inviter?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  
  team?: {
    id: string;
    name: string;
    description?: string;
    type: 'professional' | 'family' | 'mixed';
  };
}

export interface ChatInviteResponse {
  success: boolean;
  data: ChatInvite;
  message?: string;
}

export interface ChatInviteListResponse {
  success: boolean;
  data: {
    invites: ChatInvite[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

// Serviço de convites de chat
class ChatInviteService {
  private baseUrl = '/api/chat-invites';

  // Listar convites recebidos (para aceitar)
  async getReceivedInvites(page = 1, limit = 10): Promise<ChatInviteListResponse> {
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
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar convites recebidos';
      throw new Error(errorMessage);
    }
  }

  // Aceitar convite
  async acceptInvite(inviteId: string): Promise<ChatInviteResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/accept`, {});
      return {
        success: response.success,
        data: response.data as ChatInvite,
        message: response.message
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aceitar convite';
      throw new Error(errorMessage);
    }
  }

  // Recusar convite
  async declineInvite(inviteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/decline`, {});
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao recusar convite';
      throw new Error(errorMessage);
    }
  }

  // Verificar se há convites pendentes
  async getPendingInvitesCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/pending/count`);
      return {
        count: response.data?.count || 0
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar convites pendentes';
      throw new Error(errorMessage);
    }
  }
}

export const chatInviteService = new ChatInviteService();
