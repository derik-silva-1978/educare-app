import { useState, useEffect, useCallback } from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { listChildren, Child as ApiChild } from '@/services/api/childService';
import { calculateAge, formatAge } from '@/utils/dateUtils';

// Interface estendida para compatibilidade com componentes existentes
interface Child extends ApiChild {
  // Campos calculados/mapeados
  first_name: string; // Para compatibilidade com componentes existentes
  last_name: string;  // Para compatibilidade com componentes existentes
  birthdate: string;  // Para compatibilidade com componentes existentes
  age: number;
  ageFormatted: string; // Idade formatada de forma inteligente
  journey_progress?: number;
}

export const useCustomChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchChildren = useCallback(async () => {
    if (!user) {
      setChildren([]);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      console.log('Fetching children for user:', user.id);

      const apiResponse = await listChildren();
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Erro ao buscar crianças');
      }
      
      // O backend retorna { children: [...] }, então extraimos o array
      const responseData = apiResponse.data as { children?: ApiChild[] } | ApiChild[];
      let response: ApiChild[];
      
      // Verificar se é um array direto ou um objeto com propriedade children
      if (Array.isArray(responseData)) {
        response = responseData;
      } else if (responseData && typeof responseData === 'object' && 'children' in responseData) {
        response = responseData.children || [];
      } else {
        response = [];
      }
      
      console.log('Children fetched successfully:', response.length || 0);
      console.log('Response structure:', { isArray: Array.isArray(response), data: response });

      // Garantir que response é um array antes de aplicar .map()
      if (!Array.isArray(response)) {
        console.warn('Response is not an array:', response);
        response = [];
      }

      // Mapear dados do backend para formato compatível com componentes existentes
      const childrenWithAge: Child[] = response.map(child => {
        console.log('Processing child:', child);
        
        const ageData = calculateAge(child.birthDate);
        const ageFormatted = formatAge(child.birthDate);
        
        // O backend já retorna firstName e lastName separados
        let firstName = '';
        let lastName = '';
        
        // Usar type assertion para acessar propriedades do backend
        const backendChild = child as any;
        
        if (backendChild.firstName && backendChild.lastName) {
          // Backend retorna firstName e lastName separados
          firstName = backendChild.firstName;
          lastName = backendChild.lastName;
        } else if (backendChild.name) {
          // Fallback: dividir o campo name se existir
          const nameParts = backendChild.name.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        console.log('Mapped names:', { firstName, lastName, age: ageData.years, ageFormatted });
        
        return {
          ...child,
          // Campos de compatibilidade para componentes existentes
          first_name: firstName,
          last_name: lastName,
          birthdate: child.birthDate,
          age: ageData.years,
          ageFormatted: ageFormatted, // Idade formatada inteligentemente
          journey_progress: Math.floor(Math.random() * 100) // Simulado por enquanto
        } as Child;
      });

      setChildren(childrenWithAge);
    } catch (error: unknown) {
      console.error('Error in fetchChildren:', error);
      setIsError(true);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível carregar a lista de crianças.";
      toast({
        title: "Erro ao carregar crianças",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const refreshListing = useCallback(() => {
    console.log('Refreshing children list...');
    fetchChildren();
  }, [fetchChildren]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    isLoading,
    isError,
    refreshListing
  };
};
