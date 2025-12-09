import { useQuery } from '@tanstack/react-query';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'novidade' | 'dica' | 'evento' | 'atualização';
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  progress?: number;
  level: 'iniciante' | 'intermediário' | 'avançado';
  category: string;
}

interface WelcomeContent {
  news: NewsItem[];
  courses: Course[];
  announcements: string[];
}

const mockWelcomeContent: WelcomeContent = {
  news: [
    {
      id: '1',
      title: 'Nova funcionalidade: Marcos do Desenvolvimento',
      summary: 'Agora você pode acompanhar os marcos importantes do desenvolvimento do seu filho baseado nas recomendações do Ministério da Saúde.',
      date: '2025-12-09',
      category: 'novidade',
    },
    {
      id: '2',
      title: 'Dica: Estimulação da linguagem',
      summary: 'Converse com seu bebê durante as atividades diárias. Narrar o que você está fazendo ajuda no desenvolvimento da linguagem.',
      date: '2025-12-08',
      category: 'dica',
    },
    {
      id: '3',
      title: 'TitiNauta agora ainda mais inteligente',
      summary: 'Nosso assistente foi atualizado com novos recursos para oferecer orientações ainda mais personalizadas.',
      date: '2025-12-07',
      category: 'atualização',
    },
  ],
  courses: [
    {
      id: '1',
      title: 'Primeiros Passos no Desenvolvimento Infantil',
      description: 'Entenda as principais fases do desenvolvimento nos primeiros anos de vida.',
      duration: '2h 30min',
      students: 1234,
      progress: 45,
      level: 'iniciante',
      category: 'Desenvolvimento',
    },
    {
      id: '2',
      title: 'Estimulação Cognitiva na Primeira Infância',
      description: 'Aprenda técnicas práticas para estimular o desenvolvimento cognitivo.',
      duration: '3h 15min',
      students: 892,
      level: 'intermediário',
      category: 'Estimulação',
    },
    {
      id: '3',
      title: 'Comunicação e Linguagem: 0-3 anos',
      description: 'Como ajudar seu filho a desenvolver habilidades de comunicação.',
      duration: '1h 45min',
      students: 2156,
      level: 'iniciante',
      category: 'Linguagem',
    },
  ],
  announcements: [],
};

export function useWelcomeContent() {
  return useQuery({
    queryKey: ['welcome-content'],
    queryFn: async (): Promise<WelcomeContent> => {
      return mockWelcomeContent;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export type { NewsItem, Course, WelcomeContent };
