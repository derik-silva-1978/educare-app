/**
 * Hook para gerenciamento de assinaturas
 * Versão completa com estatísticas e funcionalidades administrativas
 */

import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/services/api/httpClient';
import { useToast } from '@/hooks/use-toast';

// Tipos para assinaturas
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'trial' | 'expired' | 'canceled' | 'suspended';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  childrenCount: number;
  usageStats: Record<string, unknown>;
  paymentDetails: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    billing_cycle: string;
    currency: string;
    features: string[];
    limits: Record<string, unknown>;
  };
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiredSubscriptions: number;
  canceledSubscriptions: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  conversionRate: number;
  newThisMonth: number;
  churnRate: number;
}

export interface UseSubscriptionManagementReturn {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  total: number;
  stats: SubscriptionStats | null;
  
  // Ações
  fetchSubscriptions: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<boolean>;
  cancelSubscription: (id: string) => Promise<boolean>;
  suspendSubscription: (id: string) => Promise<boolean>;
  reactivateSubscription: (id: string) => Promise<boolean>;
  getSubscriptionDetails: (id: string) => Promise<Subscription | null>;
}

export const useSubscriptionManagement = (): UseSubscriptionManagementReturn => {
  // Estados
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  
  const { toast } = useToast();

  // Função para buscar assinaturas
  const fetchSubscriptions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Buscando assinaturas...');

      // Buscar assinaturas
      const response = await httpClient.get<{
        subscriptions: Subscription[];
        total: number;
      }>('/subscriptions/admin/all');

      if (response.success && response.data) {
        const { subscriptions: subList, total: totalCount } = response.data;
        
        setSubscriptions(subList || []);
        setTotal(totalCount || 0);
        
        console.log(`✅ ${subList?.length || 0} assinaturas carregadas`);
      } else {
        const errorMsg = response.error || 'Erro ao carregar assinaturas';
        setError(errorMsg);
        setSubscriptions([]);
        setTotal(0);
        
        toast({
          title: "Erro",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMsg);
      setSubscriptions([]);
      setTotal(0);
      
      console.error('Erro ao buscar assinaturas:', err);
      
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Função para buscar estatísticas
  const fetchStats = useCallback(async (): Promise<void> => {
    try {
      console.log('📊 Buscando estatísticas de assinaturas...');

      const response = await httpClient.get<SubscriptionStats>('/subscriptions/admin/stats', {});

      if (response.success && response.data) {
        setStats(response.data);
        console.log('✅ Estatísticas carregadas:', response.data);
      } else {
        console.warn('⚠️ Erro ao carregar estatísticas:', response.error);
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  }, []);

  // Função para atualizar dados
  const refreshData = useCallback(async (): Promise<void> => {
    await Promise.all([
      fetchSubscriptions(),
      fetchStats()
    ]);
  }, [fetchSubscriptions, fetchStats]);

  // Função para atualizar assinatura
  const updateSubscription = useCallback(async (id: string, data: Partial<Subscription>): Promise<boolean> => {
    try {
      console.log('🔄 Atualizando assinatura:', id, data);

      const response = await httpClient.put(`/subscriptions/${id}`, data, {});
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Assinatura atualizada com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após edição
        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar assinatura",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchSubscriptions, toast]);

  // Função para cancelar assinatura
  const cancelSubscription = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('❌ Cancelando assinatura:', id);

      const response = await httpClient.post(`/subscriptions/${id}/cancel`, {});
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Assinatura cancelada com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após cancelamento
        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao cancelar assinatura",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchSubscriptions, toast]);

  // Função para suspender assinatura
  const suspendSubscription = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('⏸️ Suspendendo assinatura:', id);

      const response = await httpClient.post(`/subscriptions/${id}/suspend`, {});
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Assinatura suspensa com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após suspensão
        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao suspender assinatura",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchSubscriptions, toast]);

  // Função para reativar assinatura
  const reactivateSubscription = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('▶️ Reativando assinatura:', id);

      const response = await httpClient.post(`/subscriptions/${id}/reactivate`, {});
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Assinatura reativada com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após reativação
        await fetchSubscriptions();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao reativar assinatura",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchSubscriptions, toast]);

  // Função para obter detalhes de uma assinatura
  const getSubscriptionDetails = useCallback(async (id: string): Promise<Subscription | null> => {
    try {
      console.log('🔍 Buscando detalhes da assinatura:', id);

      const response = await httpClient.get<Subscription>(`/subscriptions/${id}`, {});
      
      if (response.success && response.data) {
        return response.data;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao buscar detalhes da assinatura",
          variant: "destructive",
        });
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Carregar dados na inicialização
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    subscriptions,
    loading,
    error,
    total,
    stats,
    fetchSubscriptions,
    refreshData,
    updateSubscription,
    cancelSubscription,
    suspendSubscription,
    reactivateSubscription,
    getSubscriptionDetails,
  };
};

export default useSubscriptionManagement;
