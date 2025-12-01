import { useState, useEffect, useCallback } from 'react';
import { 
  chatInviteService, 
  ChatInvite, 
  CreateChatInviteRequest,
  ChatInviteListResponse 
} from '../services/chatInviteService';

interface UseChatInvitesReturn {
  // Estados
  receivedInvites: ChatInvite[];
  sentInvites: ChatInvite[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
  
  // Ações
  createInvite: (data: CreateChatInviteRequest) => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
  refreshInvites: () => Promise<void>;
  searchUsers: (query: string) => Promise<any[]>;
  
  // Helpers
  clearError: () => void;
}

export const useChatInvites = (): UseChatInvitesReturn => {
  const [receivedInvites, setReceivedInvites] = useState<ChatInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<ChatInvite[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar convites recebidos
  const loadReceivedInvites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatInviteService.getReceivedInvites();
      
      if (response.success) {
        setReceivedInvites(response.data.invites);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar convites enviados
  const loadSentInvites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatInviteService.getSentInvites();
      
      if (response.success) {
        setSentInvites(response.data.invites);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar contador de convites pendentes
  const loadPendingCount = useCallback(async () => {
    try {
      const response = await chatInviteService.getPendingInvitesCount();
      setPendingCount(response.count);
    } catch (err: any) {
      console.error('Erro ao carregar contador de convites:', err.message);
    }
  }, []);

  // Criar convite
  const createInvite = useCallback(async (data: CreateChatInviteRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatInviteService.createInvite(data);
      
      if (response.success) {
        // Recarregar convites enviados
        await loadSentInvites();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSentInvites]);

  // Aceitar convite
  const acceptInvite = useCallback(async (inviteId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatInviteService.acceptInvite(inviteId);
      
      if (response.success) {
        // Atualizar lista de convites recebidos
        setReceivedInvites(prev => 
          prev.map(invite => 
            invite.id === inviteId 
              ? { ...invite, status: 'accepted' as const }
              : invite
          )
        );
        
        // Atualizar contador
        await loadPendingCount();
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPendingCount]);

  // Recusar convite
  const declineInvite = useCallback(async (inviteId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await chatInviteService.declineInvite(inviteId);
      
      // Atualizar lista de convites recebidos
      setReceivedInvites(prev => 
        prev.map(invite => 
          invite.id === inviteId 
            ? { ...invite, status: 'declined' as const }
            : invite
        )
      );
      
      // Atualizar contador
      await loadPendingCount();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPendingCount]);

  // Cancelar convite
  const cancelInvite = useCallback(async (inviteId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await chatInviteService.cancelInvite(inviteId);
      
      // Remover da lista de convites enviados
      setSentInvites(prev => prev.filter(invite => invite.id !== inviteId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar usuários
  const searchUsers = useCallback(async (query: string) => {
    try {
      if (!query.trim()) return [];
      
      const response = await chatInviteService.searchUsers(query);
      return response.success ? response.data : [];
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err.message);
      return [];
    }
  }, []);

  // Atualizar todos os convites
  const refreshInvites = useCallback(async () => {
    await Promise.all([
      loadReceivedInvites(),
      loadSentInvites(),
      loadPendingCount()
    ]);
  }, [loadReceivedInvites, loadSentInvites, loadPendingCount]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    refreshInvites();
  }, [refreshInvites]);

  return {
    // Estados
    receivedInvites,
    sentInvites,
    pendingCount,
    loading,
    error,
    
    // Ações
    createInvite,
    acceptInvite,
    declineInvite,
    cancelInvite,
    refreshInvites,
    searchUsers,
    
    // Helpers
    clearError
  };
};
