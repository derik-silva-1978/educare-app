/**
 * Hook simplificado para gerenciamento de profissionais
 * Versão refatorada com estado mais limpo e robusto
 */

import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@/services/api/httpClient';
import { useToast } from '@/hooks/use-toast';

// Tipos simplificados
export interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  profile?: {
    id: string;
    profession?: string;
    specialization?: string;
    bio?: string;
    city?: string;
    state?: string;
  };
}

export interface CreateProfessionalData {
  name: string;
  email: string;
  phone?: string;
  role: 'professional';
  profile: {
    specialization?: string;
    bio?: string;
    city?: string;
    state?: string;
    experience_years?: number;
    certifications?: string[];
  };
}

export interface TemporaryPasswordData {
  professionalName: string;
  professionalEmail: string;
  temporaryPassword: string;
}

export interface UseProfessionalsReturn {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  total: number;
  temporaryPasswordData: TemporaryPasswordData | null;
  
  // Ações
  fetchProfessionals: () => Promise<void>;
  refreshData: () => Promise<void>;
  createProfessional: (data: CreateProfessionalData) => Promise<{ success: boolean; temporaryPasswordData?: TemporaryPasswordData }>;
  updateProfessional: (id: string, data: Partial<Professional>) => Promise<boolean>;
  deleteProfessional: (id: string) => Promise<boolean>;
  clearTemporaryPasswordData: () => void;
}

export const useProfessionalManagement = (): UseProfessionalsReturn => {
  // Estados simples e diretos
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [temporaryPasswordData, setTemporaryPasswordData] = useState<TemporaryPasswordData | null>(null);
  
  const { toast } = useToast();

  // Função principal para buscar profissionais
  const fetchProfessionals = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Requisição direta sem cache
      const response = await httpClient.get<{
        professionals: Professional[];
        total: number;
      }>('/users/professionals', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      if (response.success && response.data) {
        const { professionals: profList, total: totalCount } = response.data;
        
        // Atualizar estados de forma direta
        setProfessionals(profList || []);
        setTotal(totalCount || 0);
        
        console.log(`✅ ${profList?.length || 0} profissionais carregados`);
      } else {
        const errorMsg = response.error || 'Erro ao carregar profissionais';
        setError(errorMsg);
        setProfessionals([]);
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
      setProfessionals([]);
      setTotal(0);
      
      console.error('Erro ao buscar profissionais:', err);
      
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Função para atualizar dados (força nova requisição)
  const refreshData = useCallback(async (): Promise<void> => {
    await fetchProfessionals();
  }, [fetchProfessionals]);

  // Função para criar novo profissional
  const createProfessional = useCallback(async (data: CreateProfessionalData): Promise<{ success: boolean; temporaryPasswordData?: TemporaryPasswordData }> => {
    try {
      console.log('=== DEBUG: Criando profissional ===');
      console.log('Dados enviados:', data);
      
      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        profile: data.profile
      };
      
      console.log('Payload da requisição:', requestData);
      
      const response = await httpClient.post('/auth/register', requestData);
      
      console.log('Resposta do servidor:', response);
      
      if (response.success) {
        // Verificar se há senha temporária na resposta
        if (response.data?.temporaryPassword) {
          const tempPasswordData: TemporaryPasswordData = {
            professionalName: data.name,
            professionalEmail: data.email,
            temporaryPassword: response.data.temporaryPassword
          };
          
          // Armazenar dados da senha temporária para exibir no modal
          setTemporaryPasswordData(tempPasswordData);
          
          // Atualizar lista após criação
          await fetchProfessionals();
          
          return { success: true, temporaryPasswordData: tempPasswordData };
        } else {
          toast({
            title: "Sucesso",
            description: "Profissional cadastrado com sucesso",
            variant: "default",
          });
          
          // Atualizar lista após criação
          await fetchProfessionals();
          
          return { success: true };
        }
      } else {
        console.error('Erro na resposta do servidor:', response);
        console.error('Detalhes do erro:', response.error);
        
        toast({
          title: "Erro",
          description: response.error || "Erro ao cadastrar profissional",
          variant: "destructive",
        });
        return { success: false };
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return { success: false };
    }
  }, [fetchProfessionals, toast]);

  // Função para atualizar profissional
  const updateProfessional = useCallback(async (id: string, data: Partial<Professional>): Promise<boolean> => {
    try {
      const response = await httpClient.put(`/users/${id}`, data);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Profissional atualizado com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após edição
        await fetchProfessionals();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar profissional",
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
  }, [fetchProfessionals, toast]);

  // Função para deletar profissional
  const deleteProfessional = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await httpClient.delete(`/users/${id}`);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Profissional removido com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após exclusão
        await fetchProfessionals();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao remover profissional",
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
  }, [fetchProfessionals, toast]);

  // Função para limpar dados da senha temporária
  const clearTemporaryPasswordData = useCallback(() => {
    setTemporaryPasswordData(null);
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    professionals,
    loading,
    error,
    total,
    temporaryPasswordData,
    fetchProfessionals,
    refreshData,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    clearTemporaryPasswordData,
  };
};

export default useProfessionalManagement;
