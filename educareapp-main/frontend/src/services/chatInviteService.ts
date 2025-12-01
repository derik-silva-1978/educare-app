import { apiClient } from './api';

// Interfaces para convites de chat
export interface ChatInvite {
  id: string;
  team_id: string;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  
  // Dados relacionados
  inviter?: {
    id: string;
    name: string;
    email: string;
    role: string;
    profile?: {
      first_name: string;
      last_name: string;
      specialty?: string;
    };
  };
  
  team?: {
    id: string;
    name: string;
    description?: string;
    type: 'professional' | 'family' | 'mixed';
  };
}

export interface CreateChatInviteRequest {
  invitee_email: string;
  team_name: string;
  team_description?: string;
  message?: string;
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

export interface AcceptInviteRequest {
  invite_id: string;
}

export interface AcceptInviteResponse {
  success: boolean;
  data: {
    invite: ChatInvite;
    team: {
      id: string;
      name: string;
      chat_url?: string;
    };
  };
  message?: string;
}

// Serviço de convites de chat
class ChatInviteService {
  private baseUrl = '/api/chat-invites';

  // Criar convite para grupo de chat
  async createInvite(data: CreateChatInviteRequest): Promise<ChatInviteResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar convite');
    }
  }

  // Listar convites recebidos (para aceitar)
  async getReceivedInvites(page = 1, limit = 10): Promise<ChatInviteListResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/received`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar convites recebidos');
    }
  }

  // Listar convites enviados
  async getSentInvites(page = 1, limit = 10): Promise<ChatInviteListResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sent`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar convites enviados');
    }
  }

  // Aceitar convite
  async acceptInvite(inviteId: string): Promise<AcceptInviteResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/accept`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao aceitar convite');
    }
  }

  // Recusar convite
  async declineInvite(inviteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${inviteId}/decline`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao recusar convite');
    }
  }

  // Cancelar convite enviado
  async cancelInvite(inviteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${inviteId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao cancelar convite');
    }
  }

  // Verificar se há convites pendentes
  async getPendingInvitesCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/pending/count`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao verificar convites pendentes');
    }
  }

  // Buscar usuários para convite (por email ou nome)
  async searchUsers(query: string): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      profile?: {
        first_name: string;
        last_name: string;
        specialty?: string;
      };
    }>;
  }> {
    try {
      const response = await apiClient.get(`/api/users/search`, {
        params: { q: query, limit: 10 }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuários');
    }
  }
}

export const chatInviteService = new ChatInviteService();
