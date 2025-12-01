
import { VideoTutorial } from '@/types/tutorial';

export const tutorialVideos: VideoTutorial[] = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos com o Smart PEI',
    description: 'Um guia completo para começar a usar a plataforma Smart PEI, desde o registro até a criação do primeiro PEI.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/getting-started.jpg',
    duration: '8:42',
    level: 'beginner',
    category: 'getting-started',
    topics: [
      'Criação de conta',
      'Navegação básica',
      'Configuração de perfil',
      'Dashboard principal'
    ],
    relatedManualSection: 'introduction',
    transcript: 'Bem-vindo ao Smart PEI! Neste tutorial, vamos mostrar como começar a usar nossa plataforma...',
    dateAdded: '2023-09-15'
  },
  {
    id: 'creating-pei',
    title: 'Como Criar um PEI',
    description: 'Aprenda a criar um Plano de Ensino Individualizado eficaz passo a passo usando o Smart PEI.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/creating-pei.jpg',
    duration: '12:18',
    level: 'beginner',
    category: 'pei',
    topics: [
      'Estrutura do PEI',
      'Definição de objetivos',
      'Estratégias pedagógicas',
      'Recursos necessários',
      'Cronograma de implementação'
    ],
    relatedManualSection: 'quick-start',
    transcript: 'Neste tutorial, vamos aprender como criar um PEI completo para um aluno...',
    dateAdded: '2023-09-20'
  },
  {
    id: 'assessments',
    title: 'Realizando Avaliações',
    description: 'Guia completo para realizar avaliações abrangentes e interpretar seus resultados no Smart PEI.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/assessments.jpg',
    duration: '15:47',
    level: 'intermediate',
    category: 'assessments',
    topics: [
      'Tipos de avaliação',
      'Preenchimento dos domínios',
      'Adição de observações',
      'Análise dos resultados'
    ],
    relatedManualSection: 'assessments',
    transcript: 'As avaliações são fundamentais para um PEI eficaz. Neste vídeo...',
    dateAdded: '2023-10-05'
  },
  {
    id: 'reports',
    title: 'Gerando Relatórios',
    description: 'Aprenda a gerar diferentes tipos de relatórios e personalizá-los de acordo com suas necessidades.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/reports.jpg',
    duration: '9:23',
    level: 'intermediate',
    category: 'reports',
    topics: [
      'Tipos de relatórios',
      'Personalização',
      'Exportação de dados',
      'Compartilhamento',
      'Histórico de relatórios'
    ],
    relatedManualSection: 'reports',
    transcript: 'Os relatórios são essenciais para comunicar o progresso e as necessidades dos alunos...',
    dateAdded: '2023-10-12'
  },
  {
    id: 'team-collaboration',
    title: 'Colaboração em Equipe',
    description: 'Saiba como utilizar os recursos de colaboração para trabalhar efetivamente com toda a equipe educacional.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/team-collaboration.jpg',
    duration: '11:05',
    level: 'intermediate',
    category: 'teams',
    topics: [
      'Criação de equipe',
      'Atribuição de papéis',
      'Comunicação interna',
      'Fluxo de trabalho colaborativo'
    ],
    relatedManualSection: 'team-management',
    transcript: 'A colaboração eficaz entre os membros da equipe é fundamental para o sucesso do PEI...',
    dateAdded: '2023-10-25'
  },
  {
    id: 'ai-resources',
    title: 'Usando Recursos de IA',
    description: 'Explore como os recursos de inteligência artificial podem ajudar na criação e aprimoramento dos PEIs.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/ai-resources.jpg',
    duration: '14:32',
    level: 'advanced',
    category: 'ai',
    topics: [
      'Análise de dados',
      'Sugestões de objetivos',
      'Recomendações de estratégias',
      'Personalização automatizada'
    ],
    relatedManualSection: 'ai-features',
    transcript: 'Os recursos de IA do Smart PEI podem revolucionar a forma como você cria e gerencia PEIs...',
    dateAdded: '2023-11-10'
  },
  {
    id: 'progress-monitoring',
    title: 'Monitoramento de Progresso',
    description: 'Aprenda a monitorar e documentar o progresso dos alunos de forma eficiente e precisa.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/progress-monitoring.jpg',
    duration: '13:20',
    level: 'intermediate',
    category: 'pei',
    topics: [
      'Registro de observações',
      'Atualizações periódicas',
      'Análise de tendências',
      'Documentação de resultados'
    ],
    relatedManualSection: 'reports',
    transcript: 'O monitoramento constante do progresso é essencial para verificar a eficácia do PEI...',
    dateAdded: '2023-11-20'
  },
  {
    id: 'advanced-settings',
    title: 'Configurações Avançadas',
    description: 'Explore as configurações avançadas do sistema para personalizar completamente sua experiência.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/images/tutorials/advanced-settings.jpg',
    duration: '10:45',
    level: 'advanced',
    category: 'settings',
    topics: [
      'Personalização de interface',
      'Configurações de privacidade',
      'Automações e integrações',
      'Backups e exportações'
    ],
    relatedManualSection: 'settings',
    transcript: 'As configurações avançadas permitem que você adapte o Smart PEI às suas necessidades específicas...',
    dateAdded: '2023-12-05'
  }
];
