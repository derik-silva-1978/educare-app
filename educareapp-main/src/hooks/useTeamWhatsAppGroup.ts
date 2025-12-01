import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface TeamWhatsAppGroup {
  id: string;
  child_id: string;
  group_name: string;
  admin_user_id: string;
  invite_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupParticipant {
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
}

export interface GroupMessage {
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

export function useTeamWhatsAppGroup(childId?: string) {
  const navigate = useNavigate();
  const [group, setGroup] = useState<TeamWhatsAppGroup | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Verificar autenticação
  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setIsAuthenticated(false);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const loadGroup = async () => {
    if (!childId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Carregar grupo da criança usando query direta
      const { data: groupData, error: groupError } = await supabase
        .from('team_whatsapp_groups' as any)
        .select('*')
        .eq('child_id', childId)
        .maybeSingle();

      if (groupError) {
        throw groupError;
      }

      setGroup(groupData as unknown as TeamWhatsAppGroup);

      if (groupData) {
        // Carregar participantes
        await loadParticipants((groupData as any).id);
        // Carregar mensagens
        await loadMessages((groupData as any).id);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar grupo",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipants = async (groupId: string) => {
    try {
      // Carregar participantes com perfis
      const { data, error } = await supabase
        .from('team_group_participants' as any)
        .select(`
          *,
          profile:educare_profiles(first_name, last_name, email, role)
        `)
        .eq('group_id', groupId)
        .eq('is_active', true);

      if (error) throw error;
      setParticipants((data || []) as unknown as GroupParticipant[]);
    } catch (err: any) {
      console.error('Erro ao carregar participantes:', err);
    }
  };

  const loadMessages = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_group_messages' as any)
        .select('*')
        .eq('group_id', groupId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as unknown as GroupMessage[]);
    } catch (err: any) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  const createGroup = async (groupName: string) => {
    if (!childId) {
      toast({
        title: "Erro",
        description: "ID da criança não fornecido",
        variant: "destructive",
      });
      return null;
    }

    const authenticated = await checkAuth();
    if (!authenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para criar um grupo.",
        variant: "destructive",
      });
      navigate('/auth');
      return null;
    }

    setIsLoading(true);

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user.user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('createGroup: Usuário autenticado', { userId: user.user.id });

      // Verificar se o usuário é dono da criança
      const { data: childData, error: childError } = await supabase
        .from('educare_children')
        .select('id, user_id, name')
        .eq('id', childId)
        .maybeSingle();

      if (childError) {
        console.error('createGroup: Erro ao verificar criança', childError);
        throw new Error('Erro ao verificar dados da criança');
      }

      if (!childData) {
        console.error('createGroup: Criança não encontrada');
        throw new Error('Criança não encontrada');
      }

      if (childData.user_id !== user.user.id) {
        console.error('createGroup: Usuário não é dono da criança', {
          childUserId: childData.user_id,
          currentUserId: user.user.id
        });
        throw new Error('Você não tem permissão para criar um grupo para esta criança');
      }

      // Verificar se já existe um grupo para esta criança
      const { data: existingGroup } = await supabase
        .from('team_whatsapp_groups' as any)
        .select('id')
        .eq('child_id', childId)
        .maybeSingle();

      if (existingGroup) {
        console.log('createGroup: Grupo já existe para esta criança');
        throw new Error('Já existe um grupo para esta criança');
      }

      // Criar grupo
      console.log('createGroup: Inserindo novo grupo');
      const { data: groupData, error: groupError } = await supabase
        .from('team_whatsapp_groups' as any)
        .insert({
          child_id: childId,
          group_name: groupName,
          admin_user_id: user.user.id,
        })
        .select()
        .single();

      if (groupError) {
        console.error('createGroup: Erro ao criar grupo', groupError);
        throw new Error(`Erro ao criar grupo: ${groupError.message}`);
      }

      console.log('createGroup: Grupo criado com sucesso', groupData);

      // Adicionar criador como participante admin
      console.log('createGroup: Adicionando criador como participante admin');
      const { error: participantError } = await supabase
        .from('team_group_participants' as any)
        .insert({
          group_id: (groupData as any).id,
          user_id: user.user.id,
          role: 'admin',
        });

      if (participantError) {
        console.error('createGroup: Erro ao adicionar participante', participantError);
        throw new Error(`Erro ao adicionar participante: ${participantError.message}`);
      }

      console.log('createGroup: Participante admin adicionado com sucesso');

      setGroup(groupData as unknown as TeamWhatsAppGroup);
      await loadParticipants((groupData as any).id);

      toast({
        title: "Grupo criado",
        description: `Grupo "${groupName}" criado com sucesso!`,
      });

      return groupData;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao criar grupo",
        description: err.message || 'Erro desconhecido ao criar grupo',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, messageType: 'text' | 'ai_summary' = 'text') => {
    if (!group) return null;

    const authenticated = await checkAuth();
    if (!authenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para enviar mensagens.",
        variant: "destructive",
      });
      navigate('/auth');
      return null;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      // Buscar nome do usuário
      const { data: profile } = await supabase
        .from('educare_profiles')
        .select('first_name, last_name, role')
        .eq('id', user.user.id)
        .single();

      const senderName = profile 
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : 'Usuário';

      const senderRole = messageType === 'ai_summary' ? 'ai_assistant' : 
                        (profile?.role === 'parent' ? 'parent' : 'professional');

      const { data, error } = await supabase
        .from('team_group_messages' as any)
        .insert({
          group_id: group.id,
          sender_id: user.user.id,
          sender_name: senderName,
          sender_role: senderRole,
          message_content: content,
          message_type: messageType,
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista de mensagens
      setMessages(prev => [...prev, data as unknown as GroupMessage]);

      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const inviteParticipant = async (email: string) => {
    if (!group) return false;

    const authenticated = await checkAuth();
    if (!authenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para convidar participantes.",
        variant: "destructive",
      });
      navigate('/auth');
      return false;
    }

    try {
      // Buscar usuário pelo email
      const { data: profile, error: profileError } = await supabase
        .from('educare_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) {
        toast({
          title: "Usuário não encontrado",
          description: "Este email não está cadastrado no sistema.",
          variant: "destructive",
        });
        return false;
      }

      // Verificar se já é participante
      const { data: existing } = await supabase
        .from('team_group_participants' as any)
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Usuário já é participante",
          description: "Este usuário já faz parte do grupo.",
          variant: "destructive",
        });
        return false;
      }

      // Adicionar como participante
      const { error } = await supabase
        .from('team_group_participants' as any)
        .insert({
          group_id: group.id,
          user_id: profile.id,
          role: 'member',
        });

      if (error) throw error;

      await loadParticipants(group.id);

      toast({
        title: "Participante adicionado",
        description: "Usuário adicionado ao grupo com sucesso!",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao convidar participante",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const removeParticipant = async (participantId: string) => {
    if (!group) return false;

    const authenticated = await checkAuth();
    if (!authenticated) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para remover participantes.",
        variant: "destructive",
      });
      navigate('/auth');
      return false;
    }

    try {
      const { error } = await supabase
        .from('team_group_participants' as any)
        .update({ is_active: false })
        .eq('id', participantId);

      if (error) throw error;

      await loadParticipants(group!.id);

      toast({
        title: "Participante removido",
        description: "Participante removido do grupo.",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao remover participante",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    checkAuth().then((authenticated) => {
      if (authenticated && childId) {
        loadGroup();
      }
    });
  }, [childId]);

  // Real-time subscription para mensagens
  useEffect(() => {
    if (!group) return;

    const channel = supabase
      .channel('team-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_group_messages',
          filter: `group_id=eq.${group.id}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as GroupMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [group]);

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