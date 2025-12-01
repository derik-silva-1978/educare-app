import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { 
  chatService, 
  ChatGroup, 
  ChatMessage as ServiceChatMessage, 
  ChatParticipant as ServiceChatParticipant 
} from '@/services/chatService';
import { teamService } from '@/services/teamService';

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

export function useCustomTeamChat(childId?: string) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCustomAuth();
  const [group, setGroup] = useState<TeamChatGroup | null>(null);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simular dados do grupo para demonstração
  const loadGroup = useCallback(async () => {
    if (!childId || !isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Simular carregamento de grupo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados simulados do grupo
      const mockGroup: TeamChatGroup = {
        id: `group-${childId}`,
        child_id: childId,
        group_name: `Equipe Terapêutica - Criança`,
        admin_user_id: user?.id || '',
        invite_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setGroup(mockGroup);

      // Carregar participantes simulados
      const mockParticipants: ChatParticipant[] = [
        {
          id: '1',
          group_id: mockGroup.id,
          user_id: user?.id || '',
          role: 'admin',
          joined_at: new Date().toISOString(),
          is_active: true,
          profile: {
            first_name: user?.name?.split(' ')[0] || 'Usuário',
            last_name: user?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || '',
            role: user?.role || 'parent'
          },
          first_name: user?.name?.split(' ')[0] || 'Usuário',
          last_name: user?.name?.split(' ').slice(1).join(' ') || '',
          email: user?.email || ''
        },
        {
          id: '2',
          group_id: mockGroup.id,
          user_id: 'prof-1',
          role: 'member',
          joined_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          profile: {
            first_name: 'Dra. Ana',
            last_name: 'Silva',
            email: 'ana.silva@educare.com',
            role: 'professional'
          }
        },
        {
          id: '3',
          group_id: mockGroup.id,
          user_id: 'prof-2',
          role: 'member',
          joined_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          profile: {
            first_name: 'Dr. Carlos',
            last_name: 'Santos',
            email: 'carlos.santos@educare.com',
            role: 'professional'
          }
        }
      ];

      setParticipants(mockParticipants);

      // Carregar mensagens simuladas
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          group_id: mockGroup.id,
          sender_id: 'prof-1',
          sender_name: 'Dra. Ana Silva',
          sender_role: 'professional',
          message_content: 'Olá! Bem-vindos ao grupo de acompanhamento. Estou aqui para ajudar no desenvolvimento da criança.',
          message_type: 'text',
          sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_ai_processed: false
        },
        {
          id: '2',
          group_id: mockGroup.id,
          sender_id: user?.id || '',
          sender_name: user?.name || 'Responsável',
          sender_role: 'parent',
          message_content: 'Obrigado, Dra. Ana! Estamos ansiosos para começar o acompanhamento.',
          message_type: 'text',
          sent_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          is_ai_processed: false
        },
        {
          id: '3',
          group_id: mockGroup.id,
          sender_id: 'prof-2',
          sender_name: 'Dr. Carlos Santos',
          sender_role: 'professional',
          message_content: 'Ótimo! Vou acompanhar o progresso e compartilhar algumas atividades recomendadas.',
          message_type: 'text',
          sent_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_ai_processed: false
        }
      ];

      setMessages(mockMessages);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar grupo",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [childId, isAuthenticated, user]);

  const createGroup = useCallback(async (groupName: string) => {
    if (!childId) {
      toast({
        title: "Erro",
        description: "ID da criança não fornecido",
        variant: "destructive",
      });
      return null;
    }

    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para criar um grupo.",
        variant: "destructive",
      });
      navigate('/auth');
      return null;
    }

    try {
      // Simular criação de grupo
      await new Promise(resolve => setTimeout(resolve, 500));

      const newGroup: TeamChatGroup = {
        id: `group-${childId}-${Date.now()}`,
        child_id: childId,
        group_name: groupName,
        admin_user_id: user?.id || '',
        invite_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setGroup(newGroup);

      // Adicionar usuário atual como admin
      const adminParticipant: ChatParticipant = {
        id: '1',
        group_id: newGroup.id,
        user_id: user?.id || '',
        role: 'admin',
        joined_at: new Date().toISOString(),
        is_active: true,
        profile: {
          first_name: user?.name?.split(' ')[0] || 'Usuário',
          last_name: user?.name?.split(' ').slice(1).join(' ') || '',
          email: user?.email || '',
          role: user?.role || 'parent'
        }
      };

      setParticipants([adminParticipant]);
      setMessages([]);

      toast({
        title: "Grupo criado",
        description: "Grupo de comunicação criado com sucesso!",
      });

      return newGroup;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar grupo';
      toast({
        title: "Erro ao criar grupo",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [childId, isAuthenticated, user, navigate]);

  const sendMessage = useCallback(async (content: string, messageType: 'text' | 'ai_summary' = 'text') => {
    if (!group || !isAuthenticated) return false;

    try {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        group_id: group.id,
        sender_id: user?.id || '',
        sender_name: user?.name || 'Usuário',
        sender_role: messageType === 'ai_summary' ? 'ai_assistant' : (user?.role === 'professional' ? 'professional' : 'parent'),
        message_content: content,
        message_type: messageType,
        sent_at: new Date().toISOString(),
        is_ai_processed: false
      };

      setMessages(prev => [...prev, newMessage]);

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso!",
      });

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      toast({
        title: "Erro ao enviar mensagem",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [group, isAuthenticated, user]);

  const inviteParticipant = useCallback(async (email: string) => {
    if (!group) return false;

    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para convidar participantes.",
        variant: "destructive",
      });
      navigate('/auth');
      return false;
    }

    try {
      // Simular convite
      await new Promise(resolve => setTimeout(resolve, 500));

      const newParticipant: ChatParticipant = {
        id: `participant-${Date.now()}`,
        group_id: group.id,
        user_id: `user-${Date.now()}`,
        role: 'member',
        joined_at: new Date().toISOString(),
        is_active: true,
        profile: {
          first_name: email.split('@')[0],
          last_name: '',
          email: email,
          role: 'professional'
        }
      };

      setParticipants(prev => [...prev, newParticipant]);

      toast({
        title: "Participante adicionado",
        description: "Usuário adicionado ao grupo com sucesso!",
      });

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao convidar participante';
      toast({
        title: "Erro ao convidar participante",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [group, isAuthenticated, navigate]);

  const removeParticipant = useCallback(async (participantId: string) => {
    if (!group) return false;

    if (!isAuthenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para remover participantes.",
        variant: "destructive",
      });
      navigate('/auth');
      return false;
    }

    try {
      setParticipants(prev => prev.filter(p => p.id !== participantId));

      toast({
        title: "Participante removido",
        description: "Participante removido do grupo.",
      });

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover participante';
      toast({
        title: "Erro ao remover participante",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [group, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && childId) {
      loadGroup();
    }
  }, [childId, isAuthenticated, loadGroup]);

  return {
    group,
    participants,
    messages,
    isLoading,
    error,
    isAuthenticated,
    createGroup,
    sendMessage,
    inviteParticipant,
    removeParticipant,
    refreshGroup: loadGroup,
  };
}
