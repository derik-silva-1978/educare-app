import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { chatService, ChatGroup, AllChatsResponse } from '@/services/chatService';
import { toast } from '@/hooks/use-toast';

export interface ChatRBACHook {
  // Estados
  groups: ChatGroup[];
  allChatsData: AllChatsResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Permissões
  canViewAllChats: boolean;
  canAccessChat: (groupId: string) => boolean;
  
  // Ações
  loadUserChats: () => Promise<void>;
  loadAllChats: () => Promise<void>;
  refreshChats: () => Promise<void>;
}

export function useChatRBAC(): ChatRBACHook {
  const { user, isAuthenticated } = useCustomAuth();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [allChatsData, setAllChatsData] = useState<AllChatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário pode ver todos os chats (owner e admin)
  const canViewAllChats = user?.role === 'owner' || user?.role === 'admin';

  // Verificar se o usuário pode acessar um chat específico
  const canAccessChat = useCallback((groupId: string): boolean => {
    if (!user || !isAuthenticated) return false;
    
    // Owner e Admin podem acessar qualquer chat
    if (user.role === 'owner' || user.role === 'admin') return true;
    
    // Outros usuários só podem acessar chats dos quais participam
    return groups.some(group => group.id === groupId);
  }, [user, isAuthenticated, groups]);

  // Carregar chats do usuário (baseado em suas equipes)
  const loadUserChats = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const userGroups = await chatService.getChatGroups();
      setGroups(userGroups);
      
      console.log(`✅ Carregados ${userGroups.length} grupos de chat para o usuário`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar chats do usuário';
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar chats",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar todos os chats do sistema (para owner e admin)
  const loadAllChats = useCallback(async () => {
    if (!isAuthenticated || !user || (user.role !== 'owner' && user.role !== 'admin')) {
      setError('Acesso negado. Apenas proprietários e administradores podem visualizar todos os chats.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allChats = await chatService.getAllChatsForOwner();
      setAllChatsData(allChats);
      
      console.log(`✅ Carregados ${allChats.groups.length} grupos de chat globais`);
      console.log('📊 Resumo:', allChats.summary);
      
      toast({
        title: "Chats carregados",
        description: `${allChats.summary.totalGroups} grupos com ${allChats.summary.totalMessages} mensagens`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar todos os chats';
      setError(errorMessage);
      
      toast({
        title: "Erro ao carregar chats globais",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Atualizar chats (baseado no role do usuário)
  const refreshChats = useCallback(async () => {
    if (canViewAllChats) {
      await loadAllChats();
    } else {
      await loadUserChats();
    }
  }, [canViewAllChats, loadAllChats, loadUserChats]);

  // Carregar chats automaticamente quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserChats();
    }
  }, [isAuthenticated, user, loadUserChats]);

  return {
    // Estados
    groups,
    allChatsData,
    isLoading,
    error,
    
    // Permissões
    canViewAllChats,
    canAccessChat,
    
    // Ações
    loadUserChats,
    loadAllChats,
    refreshChats,
  };
}
