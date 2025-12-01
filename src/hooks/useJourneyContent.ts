import { useState, useEffect } from 'react';
import { JourneyContent } from '@/types/titinauta';
import { useQuery } from '@tanstack/react-query';
import * as titiNautaService from '@/services/api/titiNautaService';

interface UseJourneyContentReturn {
  journeyContent: JourneyContent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useJourneyContent = (childId: string, ageInMonths: number): UseJourneyContentReturn => {
  // Usar React Query para gerenciamento de cache e estado
  const {
    data,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: [`journeyContent-${childId}-${ageInMonths}`],
    queryFn: async () => {
      if (!childId || ageInMonths <= 0) {
        throw new Error('ID da criança ou idade inválidos');
      }

      console.log(`🔍 Buscando conteúdo da jornada para criança ${childId} com ${ageInMonths} meses`);
      const response = await titiNautaService.getJourneyContent(childId, ageInMonths);
      
      if (!response.success) {
        throw new Error(response.error || 'Erro ao buscar conteúdo da jornada');
      }

      return response.data as JourneyContent;
    },
    enabled: !!childId && ageInMonths > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2
  });

  // Extrair mensagem de erro se existir
  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Erro desconhecido') : null;

  // Definir um valor padrão para journeyContent se data for undefined
  const defaultContent: JourneyContent = {
    id: '',
    title: '',
    ageRangeMin: 0,
    ageRangeMax: 0,
    steps: []
  };

  return { 
    journeyContent: data || defaultContent, 
    isLoading, 
    error, 
    refetch 
  };
};

// Mock para desenvolvimento
export const useMockJourneyContent = (childId: string, ageInMonths: number): UseJourneyContentReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Dados mockados para desenvolvimento
  const mockContent: JourneyContent = {
    id: 'journey-1-2-months',
    title: 'Desenvolvimento no Primeiro Trimestre',
    description: 'Conheça o desenvolvimento do bebê nos primeiros meses de vida',
    ageRangeMin: 1,
    ageRangeMax: 2,
    steps: [
      {
        id: 'step-1',
        type: 'message',
        content: 'Vamos conversar sobre o desenvolvimento do seu bebê no módulo 1-2 meses! 🌟'
      },
      {
        id: 'step-2',
        type: 'message',
        content: 'Nesta fase, seu bebê está desenvolvendo habilidades importantes como foco visual e reconhecimento de rostos familiares.'
      },
      {
        id: 'step-3',
        type: 'question',
        content: 'Você notou que seu bebê já consegue seguir objetos com os olhos?',
        options: [
          { id: 'opt-1', text: 'Sim, ele já acompanha objetos com o olhar' },
          { id: 'opt-2', text: 'Às vezes, depende do objeto' },
          { id: 'opt-3', text: 'Ainda não percebi isso' }
        ]
      },
      {
        id: 'step-4',
        type: 'message',
        content: 'Isso é ótimo! O desenvolvimento da visão é uma das primeiras habilidades que o bebê aprimora. Continue estimulando com objetos coloridos e contrastantes.'
      },
      {
        id: 'step-5',
        type: 'question',
        content: 'E quanto aos sons? Seu bebê reage quando ouve sua voz?',
        options: [
          { id: 'opt-4', text: 'Sim, ele fica atento quando falo' },
          { id: 'opt-5', text: 'Reage a sons altos, mas não tenho certeza se reconhece minha voz' },
          { id: 'opt-6', text: 'Ainda não percebi reação aos sons' }
        ]
      },
      {
        id: 'step-6',
        type: 'message',
        content: 'A audição também está se desenvolvendo! Continue conversando com seu bebê, isso ajuda no desenvolvimento da linguagem e cria vínculo afetivo.'
      },
      {
        id: 'step-7',
        type: 'message',
        content: 'Lembre-se que cada bebê tem seu próprio ritmo de desenvolvimento. O importante é observar e estimular com carinho e atenção.'
      }
    ]
  };

  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { 
    journeyContent: mockContent, 
    isLoading, 
    error: null,
    refetch: () => {} 
  };
};
