import { httpClient } from '@/services/api/httpClient';

// Interfaces para tipos de dados do backend
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  createdAt?: string;
}

interface Child {
  id: string;
  name: string;
  age?: number;
  created_at?: string;
  createdAt?: string;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  status: string;
  user?: User;
}

interface Team {
  id: string;
  name: string;
  created_at?: string;
  createdAt?: string;
  members?: TeamMember[];
}

interface ChatMessage {
  content: string;
  sender: string;
  sentAt: string;
}

interface ChatGroup {
  id: string;
  name: string;
  stats?: {
    lastMessage?: ChatMessage;
  };
}

interface ApiResponse<T> {
  data?: T;
  users?: User[];
  children?: Child[];
  teams?: Team[];
  groups?: ChatGroup[];
}

export interface ActivityItem {
  id: string;
  type: 'user_registration' | 'quiz_update' | 'team_connection' | 'chat_message' | 'profile_update' | 'child_registration';
  title: string;
  description: string;
  user_name?: string;
  user_role?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  icon_type: 'user' | 'quiz' | 'team' | 'chat' | 'profile' | 'child';
}

export interface ActivityResponse {
  activities: ActivityItem[];
  total: number;
  page: number;
  totalPages: number;
}

class ActivityService {
  private baseUrl = '/api/activities';

  // Buscar atividades recentes do sistema
  async getRecentActivities(limit: number = 10): Promise<ActivityItem[]> {
    try {
      // Como não temos um endpoint específico de atividades ainda,
      // vamos buscar dados de diferentes endpoints e consolidar
      const activities: ActivityItem[] = [];

      // 1. Buscar usuários recentes (últimos registros)
      try {
        const usersResponse = await httpClient.get('/api/users?limit=5&sort=created_at&order=desc');
        const responseData = usersResponse.data as ApiResponse<User[]>;
        const recentUsers = responseData?.users || responseData?.data || [];
        
        recentUsers.forEach((user: User) => {
          const createdAt = new Date(user.created_at || user.createdAt);
          const isRecent = (Date.now() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000); // Últimos 7 dias
          
          if (isRecent) {
            activities.push({
              id: `user_${user.id}`,
              type: 'user_registration',
              title: 'Novo usuário cadastrado',
              description: `${user.name} registrou-se como ${this.translateRole(user.role)}`,
              user_name: user.name,
              user_role: user.role,
              created_at: user.created_at || user.createdAt,
              icon_type: 'user'
            });
          }
        });
      } catch (error) {
        console.warn('Erro ao buscar usuários recentes:', error);
      }

      // 2. Buscar crianças recentes
      try {
        const childrenResponse = await httpClient.get('/api/children?limit=5&sort=created_at&order=desc');
        const responseData = childrenResponse.data as ApiResponse<Child[]>;
        const recentChildren = responseData?.children || responseData?.data || [];
        
        recentChildren.forEach((child: Child) => {
          const createdAt = new Date(child.created_at || child.createdAt);
          const isRecent = (Date.now() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000);
          
          if (isRecent) {
            activities.push({
              id: `child_${child.id}`,
              type: 'child_registration',
              title: 'Nova criança cadastrada',
              description: `${child.name} foi adicionada ao sistema`,
              metadata: { child_name: child.name, age: child.age },
              created_at: child.created_at || child.createdAt,
              icon_type: 'child'
            });
          }
        });
      } catch (error) {
        console.warn('Erro ao buscar crianças recentes:', error);
      }

      // 3. Buscar equipes recentes (conexões de profissionais)
      try {
        const teamsResponse = await httpClient.get('/api/teams?limit=5&sort=created_at&order=desc');
        const responseData = teamsResponse.data as ApiResponse<Team[]>;
        const recentTeams = responseData?.teams || responseData?.data || [];
        
        recentTeams.forEach((team: Team) => {
          const createdAt = new Date(team.created_at || team.createdAt);
          const isRecent = (Date.now() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000);
          
          if (isRecent && team.members && team.members.length > 0) {
            const professionals = team.members.filter((m: TeamMember) => m.user?.role === 'professional');
            if (professionals.length > 0) {
              activities.push({
                id: `team_${team.id}`,
                type: 'team_connection',
                title: 'Conexão de profissionais',
                description: `${professionals[0].user.name} conectou-se à equipe ${team.name}`,
                user_name: professionals[0].user.name,
                user_role: 'professional',
                metadata: { team_name: team.name, members_count: team.members.length },
                created_at: team.created_at || team.createdAt,
                icon_type: 'team'
              });
            }
          }
        });
      } catch (error) {
        console.warn('Erro ao buscar equipes recentes:', error);
      }

      // 4. Buscar mensagens de chat recentes (se disponível)
      try {
        const chatResponse = await httpClient.get('/api/chat/admin/all-chats');
        const chatData = chatResponse.data as ApiResponse<ChatGroup[]> & { groups?: ChatGroup[] };
        
        if (chatData?.groups) {
          chatData.groups.forEach((group: ChatGroup) => {
            if (group.stats?.lastMessage) {
              const messageDate = new Date(group.stats.lastMessage.sentAt);
              const isRecent = (Date.now() - messageDate.getTime()) < (24 * 60 * 60 * 1000); // Últimas 24h
              
              if (isRecent) {
                activities.push({
                  id: `chat_${group.id}_${Date.now()}`,
                  type: 'chat_message',
                  title: 'Nova mensagem no chat',
                  description: `${group.stats.lastMessage.sender} enviou mensagem em "${group.name}"`,
                  user_name: group.stats.lastMessage.sender,
                  metadata: { 
                    group_name: group.name, 
                    message_preview: group.stats.lastMessage.content.substring(0, 50) + '...' 
                  },
                  created_at: group.stats.lastMessage.sentAt,
                  icon_type: 'chat'
                });
              }
            }
          });
        }
      } catch (error) {
        console.warn('Erro ao buscar atividades de chat:', error);
      }

      // Ordenar por data (mais recente primeiro) e limitar
      const sortedActivities = activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      return sortedActivities;
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return [];
    }
  }

  private translateRole(role: string): string {
    const roleMap: Record<string, string> = {
      'parent': 'pai/responsável',
      'user': 'pai/responsável',
      'professional': 'profissional',
      'admin': 'administrador',
      'owner': 'proprietário'
    };
    return roleMap[role] || role;
  }

  // Buscar estatísticas de atividades
  async getActivityStats(): Promise<{
    totalUsers: number;
    newUsersThisWeek: number;
    totalChildren: number;
    newChildrenThisWeek: number;
    totalTeams: number;
    activeChats: number;
  }> {
    try {
      const stats = {
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalChildren: 0,
        newChildrenThisWeek: 0,
        totalTeams: 0,
        activeChats: 0
      };

      // Buscar estatísticas de usuários
      try {
        const usersResponse = await httpClient.get('/api/users');
        const responseData = usersResponse.data as ApiResponse<User[]>;
        const users = responseData?.users || responseData?.data || [];
        stats.totalUsers = users.length;
        
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        stats.newUsersThisWeek = users.filter((u: User) => 
          new Date(u.created_at || u.createdAt || '') > oneWeekAgo
        ).length;
      } catch (error) {
        console.warn('Erro ao buscar estatísticas de usuários:', error);
      }

      // Buscar estatísticas de crianças
      try {
        const childrenResponse = await httpClient.get('/api/children');
        const responseData = childrenResponse.data as ApiResponse<Child[]>;
        const children = responseData?.children || responseData?.data || [];
        stats.totalChildren = children.length;
        
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        stats.newChildrenThisWeek = children.filter((c: Child) => 
          new Date(c.created_at || c.createdAt || '') > oneWeekAgo
        ).length;
      } catch (error) {
        console.warn('Erro ao buscar estatísticas de crianças:', error);
      }

      // Buscar estatísticas de equipes
      try {
        const teamsResponse = await httpClient.get('/api/teams');
        const teams = teamsResponse.data?.teams || teamsResponse.data || [];
        stats.totalTeams = teams.length;
      } catch (error) {
        console.warn('Erro ao buscar estatísticas de equipes:', error);
      }

      // Buscar estatísticas de chats
      try {
        const chatResponse = await httpClient.get('/api/chat/admin/all-chats');
        const chatData = chatResponse.data;
        stats.activeChats = chatData?.summary?.totalGroups || 0;
      } catch (error) {
        console.warn('Erro ao buscar estatísticas de chat:', error);
      }

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de atividades:', error);
      return {
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalChildren: 0,
        newChildrenThisWeek: 0,
        totalTeams: 0,
        activeChats: 0
      };
    }
  }
}

export const activityService = new ActivityService();
