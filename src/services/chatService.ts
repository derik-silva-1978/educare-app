import { httpClient } from '@/services/api/httpClient';

export interface ChatGroup {
  id: string;
  team_id: string;
  child_id?: string;
  name: string;
  description?: string;
  invite_code: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  team?: {
    id: string;
    name: string;
    members?: Array<{
      id: string;
      teamId: string;
      userId: string;
      role: string;
      status: string;
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }>;
  };
}

export interface ChatMessage {
  id: string;
  chat_group_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'parent' | 'professional' | 'ai_assistant';
  message_content: string;
  message_type: 'text' | 'file' | 'image' | 'ai_summary' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  is_edited: boolean;
  edited_at?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  is_ai_processed: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ChatParticipant {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profiles: Array<{
      name: string;
      type: string;
      professional_specialty?: string;
      phone?: string;
    }>;
  };
}

export interface CreateChatGroupRequest {
  team_id: string;
  child_id?: string;
  name: string;
  description?: string;
}

export interface SendMessageRequest {
  message_content: string;
  message_type?: 'text' | 'file' | 'image' | 'ai_summary' | 'system';
  reply_to_id?: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ChatGroupWithStats extends ChatGroup {
  stats: {
    messageCount: number;
    participantCount: number;
    lastMessage: {
      content: string;
      sender: string;
      sentAt: string;
    } | null;
  };
}

export interface AllChatsResponse {
  groups: ChatGroupWithStats[];
  total: number;
  summary: {
    totalGroups: number;
    totalMessages: number;
    totalParticipants: number;
  };
  meta: {
    userRole: string;
    hasGlobalAccess: boolean;
  };
}

class ChatService {
  private baseUrl = '/api/chat';

  // Criar grupo de chat
  async createChatGroup(data: CreateChatGroupRequest): Promise<ChatGroup> {
    const response = await httpClient.post(`${this.baseUrl}/groups`, data);
    // Backend retorna dados diretamente em response.data, não em response.data.data
    return response.data;
  }

  // Listar grupos de chat do usuário
  async getChatGroups(): Promise<ChatGroup[]> {
    const response = await httpClient.get(`${this.baseUrl}/groups`);
    console.log('📊 Resposta completa do backend:', response.data);
    
    // Backend retorna { success: true, data: [...] }
    // Extrair apenas o array de dados
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // Fallback: se vier diretamente como array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Se não for nenhum dos casos, retornar array vazio
    console.log('⚠️ Formato inesperado de resposta, retornando array vazio');
    return [];
  }

  // Buscar grupo de chat por ID
  async getChatGroupById(groupId: string): Promise<ChatGroup> {
    const response = await httpClient.get(`${this.baseUrl}/groups/${groupId}`);
    return response.data;
  }

  // Buscar mensagens do grupo
  async getChatMessages(
    groupId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<ChatMessagesResponse> {
    const response = await httpClient.get(
      `${this.baseUrl}/groups/${groupId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Enviar mensagem
  async sendMessage(groupId: string, data: SendMessageRequest): Promise<ChatMessage> {
    const response = await httpClient.post(
      `${this.baseUrl}/groups/${groupId}/messages`, 
      data
    );
    return response.data;
  }

  // Buscar participantes do grupo
  async getChatParticipants(groupId: string): Promise<ChatParticipant[]> {
    const response = await httpClient.get(`${this.baseUrl}/groups/${groupId}/participants`);
    return response.data;
  }

  // Buscar team_id do usuário atual
  async getUserTeamId(): Promise<string> {
    try {
      console.log('🔍 Buscando equipes do usuário atual...');
      
      // Buscar equipes do usuário via novo endpoint específico
      const response = await httpClient.get('/api/teams/my');
      console.log('📊 Resposta do endpoint /api/teams/my:', response.data);
      
      const teams = response.data?.data?.teams || response.data?.teams || [];
      
      if (teams.length > 0) {
        console.log('✅ Team encontrada:', teams[0].id);
        return teams[0].id; // Usar primeira equipe
      }
      
      console.log('⚠️ Nenhuma equipe encontrada para o usuário');
      throw new Error('Usuário não pertence a nenhuma equipe ativa');
    } catch (error) {
      console.error('❌ Erro ao buscar team do usuário:', error);
      throw error; // Propagar erro em vez de usar fallback
    }
  }

  // Buscar ou criar grupo de chat para uma criança diretamente
  async getOrCreateChildChatGroup(childId: string): Promise<ChatGroup> {
    try {
      console.log('🔍 Buscando grupo de chat para criança:', childId);
      
      // Primeiro, tentar buscar grupos existentes para esta criança
      const groups = await this.getChatGroups();
      console.log('📊 Grupos recebidos:', groups);
      
      // Verificar se groups é um array válido
      if (!Array.isArray(groups)) {
        console.log('⚠️ Groups não é um array, tentando criar novo grupo');
      } else {
        const existingGroup = groups.find(group => group.child_id === childId);
        
        if (existingGroup) {
          console.log('✅ Grupo existente encontrado:', existingGroup);
          return existingGroup;
        }
      }

      console.log('📝 Criando novo grupo para criança:', childId);
      
      try {
        // Buscar team_id do usuário dinamicamente
        const teamId = await this.getUserTeamId();
        const groupName = `Chat - Criança ${childId}`;

        return await this.createChatGroup({
          team_id: teamId,
          child_id: childId,
          name: groupName,
          description: `Grupo de comunicação para acompanhamento da criança`
        });
      } catch (teamError) {
        console.error('❌ Erro ao obter teamId ou criar grupo:', teamError);
        
        // Se falhar ao obter teamId, tentar usar o primeiro team disponível das equipes do usuário
        try {
          const teamsResponse = await httpClient.get('/api/teams/my');
          const teams = teamsResponse.data?.data?.teams || [];
          
          if (teams.length > 0) {
            const teamId = teams[0].id;
            console.log('🔄 Usando primeiro team disponível:', teamId);
            
            const groupName = `Chat - Criança ${childId}`;
            return await this.createChatGroup({
              team_id: teamId,
              child_id: childId,
              name: groupName,
              description: `Grupo de comunicação para acompanhamento da criança`
            });
          } else {
            throw new Error('Usuário não pertence a nenhuma equipe ativa. Não é possível criar grupo de chat.');
          }
        } catch (fallbackError) {
          console.error('❌ Erro no fallback:', fallbackError);
          throw new Error('Não foi possível criar grupo de chat. Verifique se você pertence a uma equipe ativa.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar/criar grupo de chat para criança:', error);
      throw error;
    }
  }

  // Buscar ou criar grupo de chat para uma equipe
  async getOrCreateTeamChatGroup(teamId: string, childName?: string): Promise<ChatGroup> {
    try {
      // Primeiro, tentar buscar grupos existentes
      const groups = await this.getChatGroups();
      const existingGroup = groups.find(group => group.team_id === teamId);
      
      if (existingGroup) {
        return existingGroup;
      }

      // Se não encontrar, criar um novo grupo
      const groupName = childName 
        ? `Chat - Equipe Terapêutica (${childName})`
        : 'Chat - Equipe Terapêutica';

      return await this.createChatGroup({
        team_id: teamId,
        name: groupName,
        description: `Grupo de comunicação da equipe terapêutica${childName ? ` para ${childName}` : ''}`
      });
    } catch (error) {
      console.error('Erro ao buscar/criar grupo de chat:', error);
      throw error;
    }
  }

  // Listar todos os chats do sistema (apenas para owner)
  async getAllChatsForOwner(): Promise<AllChatsResponse> {
    const response = await httpClient.get(`${this.baseUrl}/admin/all-chats`);
    return response.data;
  }
}

export const chatService = new ChatService();
