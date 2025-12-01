import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { listProfessionals, Professional, createProfessional, updateProfessional, deleteProfessional } from '@/services/api/professionalService';

interface UseProfessionalManagementReturn {
  professionals: Professional[];
  isLoading: boolean;
  error: string | null;
  refreshProfessionals: () => void;
  addProfessional: (professionalData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    profession?: string;
    specialization?: string;
    registration_number?: string;
    bio?: string;
  }) => Promise<boolean>;
  updateProfessionalData: (id: string, professionalData: Partial<{
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    profession?: string;
    specialization?: string;
    registration_number?: string;
    bio?: string;
  }>) => Promise<boolean>;
  removeProfessional: (id: string) => Promise<boolean>;
}

export const useProfessionalManagement = (): UseProfessionalManagementReturn => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfessionals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listProfessionals();

      if (response.success && response.data) {
        const professionalsArray = response.data.professionals || [];
        setProfessionals(professionalsArray);
      } else {
        const errorMessage = response.error || 'Erro ao carregar profissionais';
        setError(errorMessage);
        toast({
          title: "Erro ao carregar profissionais",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error: unknown) {
      
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao carregar profissionais";
      setError(errorMessage);
      toast({
        title: "Erro ao carregar profissionais",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('\n=== ESTADO FINAL DO HOOK ===');
      console.log('⏳ isLoading definido como false');
      console.log('=== FIM REQUISIÇÃO FRONTEND ===\n');
    }
  }, [toast]);

  const refreshProfessionals = useCallback(() => {
    console.log('Atualizando lista de profissionais...');
    fetchProfessionals();
  }, [fetchProfessionals]);

  const addProfessional = useCallback(async (professionalData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    profession?: string;
    specialization?: string;
    registration_number?: string;
    bio?: string;
  }): Promise<boolean> => {
    try {
      console.log('Criando profissional:', professionalData.email);
      const response = await createProfessional(professionalData);

      if (response.success) {
        toast({
          title: "Profissional criado",
          description: `${professionalData.name} foi adicionado com sucesso`,
          variant: "default"
        });
        
        // Atualizar lista
        await fetchProfessionals();
        return true;
      } else {
        const errorMessage = response.error || 'Erro ao criar profissional';
        toast({
          title: "Erro ao criar profissional",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error: unknown) {
      console.error('Error in addProfessional:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao criar profissional";
      toast({
        title: "Erro ao criar profissional",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchProfessionals, toast]);

  const updateProfessionalData = useCallback(async (id: string, professionalData: Partial<{
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    profession?: string;
    specialization?: string;
    registration_number?: string;
    bio?: string;
  }>): Promise<boolean> => {
    try {
      console.log('Atualizando profissional:', id);
      const response = await updateProfessional(id, professionalData);

      if (response.success) {
        toast({
          title: "Profissional atualizado",
          description: "As informações foram atualizadas com sucesso",
          variant: "default"
        });
        
        // Atualizar lista
        await fetchProfessionals();
        return true;
      } else {
        const errorMessage = response.error || 'Erro ao atualizar profissional';
        toast({
          title: "Erro ao atualizar profissional",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error: unknown) {
      console.error('Error in updateProfessionalData:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao atualizar profissional";
      toast({
        title: "Erro ao atualizar profissional",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchProfessionals, toast]);

  const removeProfessional = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('Removendo profissional:', id);
      const response = await deleteProfessional(id);

      if (response.success) {
        toast({
          title: "Profissional removido",
          description: "O profissional foi removido com sucesso",
          variant: "default"
        });
        
        // Atualizar lista
        await fetchProfessionals();
        return true;
      } else {
        const errorMessage = response.error || 'Erro ao remover profissional';
        toast({
          title: "Erro ao remover profissional",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error: unknown) {
      console.error('Error in removeProfessional:', error);
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao remover profissional";
      toast({
        title: "Erro ao remover profissional",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  }, [fetchProfessionals, toast]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    professionals,
    isLoading,
    error,
    refreshProfessionals,
    addProfessional,
    updateProfessionalData,
    removeProfessional
  };
};
