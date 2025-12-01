import { apiClient } from './api';

// Interfaces para teams/grupos
export interface Team {
  id: string;
  name: string;
  description?: string;
  type: 'professional' | 'family' | 'mixed';
  status: 'active' | 'inactive' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Dados relacionados
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  
  members?: TeamMember[];
  members_count?: number;
  chat_url?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'moderator';
  status: 'active' | 'invited' | 'inactive';
  joined_at?: string;
  invited_at?: string;
  
  // Dados do usuário
  user?: {
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
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  type: 'professional' | 'family' | 'mixed';
  member_emails?: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  type?: 'professional' | 'family' | 'mixed';
  status?: 'active' | 'inactive' | 'archived';
}

export interface AddMemberRequest {
  user_email: string;
  role?: 'admin' | 'member' | 'moderator';
}

export interface TeamResponse {
  success: boolean;
  data: Team;
  message?: string;
}

export interface TeamListResponse {
  success: boolean;
  data: {
    teams: Team[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface TeamMembersResponse {
  success: boolean;
  data: {
    members: TeamMember[];
    total: number;
  };
  message?: string;
}

// Serviço de gestão de teams
class TeamService {
  private baseUrl = '/api/teams';

  // Listar teams (admin)
  async getTeams(page = 1, limit = 10, filters: {
    type?: string;
    status?: string;
    search?: string;
  } = {}): Promise<TeamListResponse> {
    try {
      const response = await apiClient.get(this.baseUrl, {
        params: { page, limit, ...filters }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar teams');
    }
  }

  // Obter team por ID
  async getTeam(teamId: string): Promise<TeamResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${teamId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar team');
    }
  }

  // Criar team
  async createTeam(data: CreateTeamRequest): Promise<TeamResponse> {
    try {
      const response = await apiClient.post(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar team');
    }
  }

  // Atualizar team
  async updateTeam(teamId: string, data: UpdateTeamRequest): Promise<TeamResponse> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${teamId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar team');
    }
  }

  // Deletar team
  async deleteTeam(teamId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${teamId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar team');
    }
  }

  // Obter membros do team
  async getTeamMembers(teamId: string): Promise<TeamMembersResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${teamId}/members`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar membros');
    }
  }

  // Adicionar membro ao team
  async addMember(teamId: string, data: AddMemberRequest): Promise<{
    success: boolean;
    data: TeamMember;
    message?: string;
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${teamId}/members`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao adicionar membro');
    }
  }

  // Remover membro do team
  async removeMember(teamId: string, memberId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${teamId}/members/${memberId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao remover membro');
    }
  }

  // Atualizar role do membro
  async updateMemberRole(teamId: string, memberId: string, role: 'admin' | 'member' | 'moderator'): Promise<{
    success: boolean;
    data: TeamMember;
    message?: string;
  }> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${teamId}/members/${memberId}`, { role });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar role');
    }
  }

  // Obter estatísticas de teams
  async getTeamStats(): Promise<{
    success: boolean;
    data: {
      total_teams: number;
      active_teams: number;
      inactive_teams: number;
      total_members: number;
      teams_by_type: Array<{
        type: string;
        count: number;
      }>;
    };
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao carregar estatísticas');
    }
  }

  // Buscar usuários para adicionar ao team
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

export const teamService = new TeamService();
