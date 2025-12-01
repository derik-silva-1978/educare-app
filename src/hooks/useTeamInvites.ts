import { useState, useEffect, useCallback } from 'react';
import { teamInviteService, TeamInvite } from '@/services/teamInviteService';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { toast } from 'sonner';

interface TeamInvitesState {
  receivedInvites: TeamInvite[];
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useTeamInvites = () => {
  const { user } = useCustomAuth();
  const [state, setState] = useState<TeamInvitesState>({
    receivedInvites: [],
    pendingCount: 0,
    isLoading: true,
    error: null
  });

  // Carregar convites de equipe recebidos
  const loadReceivedInvites = useCallback(async () => {
    if (!user) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await teamInviteService.getReceivedInvites();
      const invites = response.data?.invites || [];
      
      setState(prev => ({
        ...prev,
        receivedInvites: invites,
        pendingCount: invites.filter(invite => invite.status === 'invited').length,
        isLoading: false
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar convites de equipe';
      console.error('Erro ao carregar convites de equipe recebidos:', error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [user]);

  // Aceitar convite de equipe
  const acceptInvite = async (inviteId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await teamInviteService.acceptInvite(inviteId);
      
      if (response.success) {
        toast.success('Convite de equipe aceito com sucesso!');
        
        // Atualizar lista de convites
        await loadReceivedInvites();
        
        // Retornar dados da equipe para possível redirecionamento
        return response.data;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aceitar convite de equipe';
      console.error('Erro ao aceitar convite de equipe:', error);
      toast.error(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Recusar convite de equipe
  const declineInvite = async (inviteId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await teamInviteService.declineInvite(inviteId);
      toast.success('Convite de equipe recusado');
      
      // Atualizar lista de convites
      await loadReceivedInvites();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao recusar convite de equipe';
      console.error('Erro ao recusar convite de equipe:', error);
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
    totalReceivedInvites: state.receivedInvites.length,
    
    // Filtros por status
    pendingInvites: state.receivedInvites.filter(invite => invite.status === 'invited'),
    acceptedInvites: state.receivedInvites.filter(invite => invite.status === 'active')
  };
};
