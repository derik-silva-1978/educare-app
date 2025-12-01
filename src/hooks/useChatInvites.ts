import { useState, useEffect, useCallback } from 'react';
import { chatInviteService, ChatInvite } from '@/services/chatInviteService';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { toast } from 'sonner';

interface ChatInvitesState {
  receivedInvites: ChatInvite[];
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useChatInvites = () => {
  const { user } = useCustomAuth();
  const [state, setState] = useState<ChatInvitesState>({
    receivedInvites: [],
    pendingCount: 0,
    isLoading: true,
    error: null
  });

  // Carregar convites recebidos
  const loadReceivedInvites = useCallback(async () => {
    if (!user) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await chatInviteService.getReceivedInvites();
      const invites = response.data?.invites || [];
      
      setState(prev => ({
        ...prev,
        receivedInvites: invites,
        pendingCount: invites.filter(invite => invite.status === 'pending').length,
        isLoading: false
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar convites';
      console.error('Erro ao carregar convites recebidos:', error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [user]);

  // Aceitar convite
  const acceptInvite = async (inviteId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await chatInviteService.acceptInvite(inviteId);
      
      if (response.success) {
        toast.success('Convite aceito com sucesso!');
        
        // Atualizar lista de convites
        await loadReceivedInvites();
        
        // Retornar dados da equipe para possível redirecionamento
        return response.data;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aceitar convite';
      console.error('Erro ao aceitar convite:', error);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Recusar convite
  const declineInvite = async (inviteId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await chatInviteService.declineInvite(inviteId);
      toast.success('Convite recusado');
      
      // Atualizar lista de convites
      await loadReceivedInvites();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao recusar convite';
      console.error('Erro ao recusar convite:', error);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadReceivedInvites();
    }
  }, [user, loadReceivedInvites]);

  // Recarregar dados
  const refresh = () => {
    if (user) {
      loadReceivedInvites();
    }
  };

  return {
    // Estado
    receivedInvites: state.receivedInvites,
    pendingCount: state.pendingCount,
    isLoading: state.isLoading,
    error: state.error,
    
    // Ações
    acceptInvite,
    declineInvite,
    refresh,
    
    // Dados computados
    hasPendingInvites: state.pendingCount > 0,
    totalReceivedInvites: state.receivedInvites.length
  };
};
