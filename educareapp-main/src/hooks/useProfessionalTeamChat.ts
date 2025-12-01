import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { 
  chatService, 
  ChatGroup, 
  ChatMessage as ServiceChatMessage, 
  ChatParticipant as ServiceChatParticipant 
} from '@/services/chatService';

// Interfaces compatíveis com o componente de chat existente
export interface TeamChatGroup {
  id: string;
  child_id: string;
  group_name: string;
  admin_user_id: string;
  invite_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  is_active: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  first_name: string;
  last_name: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  group_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'parent' | 'professional' | 'ai_assistant';
  message_content: string;
  message_type: 'text' | 'file' | 'image' | 'ai_summary';
  file_url?: string;
  sent_at: string;
  is_ai_processed: boolean;
}

// Funções de conversão entre tipos do serviço e tipos do componente
const convertChatGroupToTeamGroup = (group: ChatGroup): TeamChatGroup => ({
  id: group.id,
  child_id: group.child_id || '',
  group_name: group.name,
  admin_user_id: '', // Será definido baseado nos participantes
  invite_code: group.invite_code,
  is_active: group.is_active,
  created_at: group.created_at,
  updated_at: group.updated_at
});

const convertServiceParticipantToLocal = (participant: ServiceChatParticipant): ChatParticipant => ({
  id: participant.id,
  group_id: participant.team_id, // Usar team_id como group_id
  user_id: participant.user_id,
  role: participant.role === 'admin' ? 'admin' : 'member',
  joined_at: participant.joined_at,
  is_active: participant.status === 'active',
  profile: {
    first_name: participant.user.name.split(' ')[0] || '',
    last_name: participant.user.name.split(' ').slice(1).join(' ') || '',
    email: participant.user.email,
    role: participant.user.role
  },
  first_name: participant.user.name.split(' ')[0] || '',
  last_name: participant.user.name.split(' ').slice(1).join(' ') || '',
  email: participant.user.email
});

const convertServiceMessageToLocal = (message: ServiceChatMessage): ChatMessage => ({
  id: message.id,
  group_id: message.chat_group_id,
  sender_id: message.sender_id,
  sender_name: message.sender_name,
  sender_role: message.sender_role,
  message_content: message.message_content,
  message_type: message.message_type as 'text' | 'file' | 'image' | 'ai_summary',
  file_url: message.file_url,
  sent_at: message.created_at,
  is_ai_processed: message.is_ai_processed
});

export function useProfessionalTeamChat(teamId: string, childId?: string) {
  const { user, isAuthenticated } = useCustomAuth();
  const [group, setGroup] = useState<TeamChatGroup | null>(null);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar chat da equipe existente
  const loadTeamChat = useCallback(async () => {
    if (!teamId || !isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Carregando chat da equipe:', teamId);
      
      // Buscar grupo de chat da equipe
      const chatGroups = await chatService.getChatGroups();
      const teamChatGroup = chatGroups.find(group => 
        group.team_id === teamId || group.child_id === childId
      );

      if (!teamChatGroup) {
        // Se não encontrar, tentar criar usando o childId se disponível
        if (childId) {
          console.log('🔄 Criando grupo de chat para a criança:', childId);
          const newChatGroup = await chatService.getOrCreateChildChatGroup(childId);
          const teamGroup = convertChatGroupToTeamGroup(newChatGroup);
          setGroup(teamGroup);

          // Carregar participantes
          const serviceParticipants = await chatService.getChatParticipants(newChatGroup.id);
          const localParticipants = serviceParticipants.map(convertServiceParticipantToLocal);
          setParticipants(localParticipants);

          // Carregar mensagens
          const messagesResponse = await chatService.getChatMessages(newChatGroup.id, 1, 50);
          const localMessages = messagesResponse.messages.map(convertServiceMessageToLocal);
          setMessages(localMessages);
        } else {
          throw new Error('Grupo de chat não encontrado para esta equipe');
        }
      } else {
        console.log('✅ Grupo de chat encontrado:', teamChatGroup);
        
        const teamGroup = convertChatGroupToTeamGroup(teamChatGroup);
        setGroup(teamGroup);

        // Carregar participantes
        const serviceParticipants = await chatService.getChatParticipants(teamChatGroup.id);
        const localParticipants = serviceParticipants.map(convertServiceParticipantToLocal);
        setParticipants(localParticipants);

        // Carregar mensagens
        const messagesResponse = await chatService.getChatMessages(teamChatGroup.id, 1, 50);
        const localMessages = messagesResponse.messages.map(convertServiceMessageToLocal);
        setMessages(localMessages);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar chat da equipe';
      console.error('❌ Erro ao carregar chat da equipe:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar chat",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [teamId, childId, isAuthenticated]);

  // Enviar mensagem
  const sendMessage = useCallback(async (content: string) => {
    if (!group || !isAuthenticated || !user) {
      return false;
    }

    try {
      console.log('📤 Enviando mensagem:', { groupId: group.id, content });
      
      const newMessage = await chatService.sendMessage(group.id, {
        message_content: content,
        message_type: 'text'
      });

      const localMessage = convertServiceMessageToLocal(newMessage);
      setMessages(prev => [...prev, localMessage]);
      
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      console.error('❌ Erro ao enviar mensagem:', errorMessage);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [group, isAuthenticated, user]);

  // Carregar dados quando o hook é inicializado
  useEffect(() => {
    loadTeamChat();
  }, [loadTeamChat]);

  return {
    group,
    participants,
    messages,
    isLoading,
    error,
    sendMessage,
    refresh: loadTeamChat
  };
}
