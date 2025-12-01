import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/api';

/**
 * Hook de exemplo para demonstrar o uso do TanStack DevTools
 * 
 * Este hook busca dados de exemplo e pode ser usado para testar o DevTools
 */
export const useExampleQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      // Simulando um delay para ver o loading state no DevTools
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fazendo uma requisição real
      const response = await httpClient.get('/api/some-endpoint');
      return response.data;
    },
    enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Estas opções serão visíveis no DevTools
    meta: {
      description: 'Dados de exemplo para testar o DevTools',
      tags: ['exemplo', 'teste', 'devtools'],
    },
  });
};

/**
 * Hook de exemplo com parâmetros para demonstrar o uso do TanStack DevTools
 */
export const useParameterizedQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['parameterized-data', id],
    queryFn: async () => {
      // Simulando um delay para ver o loading state no DevTools
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fazendo uma requisição real
      const response = await httpClient.get(`/api/some-endpoint/${id}`);
      return response.data;
    },
    enabled,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Estas opções serão visíveis no DevTools
    meta: {
      description: `Dados parametrizados para o ID: ${id}`,
      tags: ['parametrizado', 'id', 'devtools'],
    },
  });
};

export default useExampleQuery;
