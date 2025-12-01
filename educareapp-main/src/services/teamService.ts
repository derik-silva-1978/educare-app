import { httpClient } from '@/services/api/httpClient';

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  type: 'professional' | 'educational' | 'family' | 'other';
  logoUrl?: string;
  isActive: boolean;
  memberCount: number;
  activeMemberCount: number;
  pendingInvites: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      profession?: string;
      city?: string;
      state?: string;
    };
  };
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer' | 'professional';
  status: 'invited' | 'active' | 'inactive' | 'removed';
  invitedAt: string;
  joinedAt?: string;
  permissions: Record<string, unknown>;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    profile?: {
      profession?: string;
      specialization?: string;
      city?: string;
      state?: string;
    };
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  type?: 'professional' | 'educational' | 'family' | 'other';
  logoUrl?: string;
  settings?: Record<string, any>;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  type?: 'professional' | 'educational' | 'family' | 'other';
  logoUrl?: string;
  isActive?: boolean;
  settings?: Record<string, any>;
}

export interface InviteMemberData {
  userId: string;
  role?: 'admin' | 'member' | 'viewer' | 'professional';
  permissions?: Record<string, unknown>;
}

export interface UpdateMemberData {
  role?: 'admin' | 'member' | 'viewer' | 'professional';
  status?: 'invited' | 'active' | 'inactive' | 'removed';
  permissions?: Record<string, unknown>;
}

export interface SearchUsersParams {
  search?: string;
  role?: 'professional' | 'user' | 'all';
}

export interface UserForInvite {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    profession?: string;
    specialization?: string;
    city?: string;
    state?: string;
  };
}

class TeamService {
  // Listar todas as equipes
  async listTeams() {
    const response = await httpClient.get('/teams');
    return response;
  }

  // Obter detalhes de uma equipe
  async getTeam(id: string) {
    const response = await httpClient.get(`/teams/${id}`);
    return response;
  }

  // Criar nova equipe
  async createTeam(data: CreateTeamData) {
    const response = await httpClient.post('/teams', data);
    return response;
  }

  // Atualizar equipe
  async updateTeam(id: string, data: UpdateTeamData) {
    const response = await httpClient.put(`/teams/${id}`, data);
    return response;
  }

  // Deletar equipe
  async deleteTeam(id: string) {
    const response = await httpClient.delete(`/teams/${id}`);
    return response;
  }

  // Listar membros de uma equipe
  async listMembers(teamId: string) {
    const response = await httpClient.get(`/teams/${teamId}/members`);
    return response;
  }

  // Convidar membro para equipe
  async inviteMember(teamId: string, data: InviteMemberData) {
    const response = await httpClient.post(`/teams/${teamId}/invite`, data);
    return response;
  }

  // Atualizar membro da equipe
  async updateMember(teamId: string, memberId: string, data: UpdateMemberData) {
    const response = await httpClient.put(`/teams/${teamId}/members/${memberId}`, data);
    return response;
  }

  // Remover membro da equipe
  async removeMember(teamId: string, memberId: string) {
    const response = await httpClient.delete(`/teams/${teamId}/members/${memberId}`);
    return response;
  }

  // Buscar usuários para convite
  async searchUsersForInvite(teamId: string, params: SearchUsersParams = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.role) {
      queryParams.append('role', params.role);
    }

    const url = `/teams/${teamId}/search-users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await httpClient.get(url);
    return response;
  }
}

export const teamService = new TeamService();
