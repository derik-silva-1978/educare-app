const ALL_MODULE_TYPES = [
  'baby', 'mother', 'professional',
  'landing_chat',
  'quiz_baby', 'quiz_mother',
  'content_generator',
  'curation_baby_quiz', 'curation_mother_quiz', 'curation_baby_content', 'curation_mother_content',
  'media_metadata',
  'nlp_biometric', 'nlp_sleep', 'nlp_appointment', 'nlp_vaccine'
];

const AGENT_META = {
  baby: {
    name: 'TitiNauta',
    description: 'Assistente de IA para pais e responsáveis sobre desenvolvimento infantil',
    icon: 'baby',
    color: '#8b5cf6',
    kb: 'kb_baby',
    category: 'assistants'
  },
  mother: {
    name: 'TitiNauta Materna',
    description: 'Assistente de IA para saúde materna, gravidez e pós-parto',
    icon: 'heart',
    color: '#f43f5e',
    kb: 'kb_mother',
    category: 'assistants'
  },
  professional: {
    name: 'TitiNauta Especialista',
    description: 'Assistente de IA para profissionais de saúde com protocolos clínicos',
    icon: 'stethoscope',
    color: '#14b8a6',
    kb: 'kb_professional',
    category: 'assistants'
  },
  landing_chat: {
    name: 'MyChat Pré-vendas',
    description: 'Assistente de pré-vendas e suporte inicial na landing page',
    icon: 'message-circle',
    color: '#3b82f6',
    kb: 'landing',
    category: 'sales'
  },
  quiz_baby: {
    name: 'Gerador Quiz Bebê',
    description: 'Gera opções e feedback para quizzes de desenvolvimento infantil',
    icon: 'brain',
    color: '#a855f7',
    kb: 'none',
    category: 'generators'
  },
  quiz_mother: {
    name: 'Gerador Quiz Mãe',
    description: 'Gera opções e feedback para quizzes de saúde materna',
    icon: 'heart-pulse',
    color: '#ec4899',
    kb: 'none',
    category: 'generators'
  },
  content_generator: {
    name: 'Gerador de Conteúdo',
    description: 'Cria conteúdo educativo sobre desenvolvimento infantil e saúde materna',
    icon: 'file-pen',
    color: '#f59e0b',
    kb: 'none',
    category: 'generators'
  },
  curation_baby_quiz: {
    name: 'Curadoria Quiz Bebê',
    description: 'Gera perguntas de quiz em lote para a trilha do bebê',
    icon: 'list-checks',
    color: '#7c3aed',
    kb: 'none',
    category: 'curation'
  },
  curation_mother_quiz: {
    name: 'Curadoria Quiz Mãe',
    description: 'Gera perguntas de quiz em lote para a trilha da mãe',
    icon: 'list-checks',
    color: '#db2777',
    kb: 'none',
    category: 'curation'
  },
  curation_baby_content: {
    name: 'Curadoria Conteúdo Bebê',
    description: 'Gera conteúdo educativo em lote para a trilha do bebê',
    icon: 'book-open',
    color: '#6d28d9',
    kb: 'none',
    category: 'curation'
  },
  curation_mother_content: {
    name: 'Curadoria Conteúdo Mãe',
    description: 'Gera conteúdo educativo em lote para a trilha da mãe',
    icon: 'book-open',
    color: '#be185d',
    kb: 'none',
    category: 'curation'
  },
  media_metadata: {
    name: 'Gerador de Metadados',
    description: 'Gera descrições, categorias e tags para recursos audiovisuais',
    icon: 'image',
    color: '#0891b2',
    kb: 'none',
    category: 'utilities'
  },
  nlp_biometric: {
    name: 'Parser Biométrico',
    description: 'Extrai peso, altura e perímetro cefálico de texto livre',
    icon: 'ruler',
    color: '#059669',
    kb: 'none',
    category: 'utilities'
  },
  nlp_sleep: {
    name: 'Parser de Sono',
    description: 'Extrai registros de sono do bebê de texto livre',
    icon: 'moon',
    color: '#4f46e5',
    kb: 'none',
    category: 'utilities'
  },
  nlp_appointment: {
    name: 'Parser de Consultas',
    description: 'Extrai dados de agendamentos médicos de texto livre',
    icon: 'calendar',
    color: '#0d9488',
    kb: 'none',
    category: 'utilities'
  },
  nlp_vaccine: {
    name: 'Parser de Vacinas',
    description: 'Extrai registros de vacinas de texto livre',
    icon: 'syringe',
    color: '#16a34a',
    kb: 'none',
    category: 'utilities'
  }
};

const AGENT_CATEGORIES = {
  assistants: {
    name: 'Assistentes TitiNauta',
    description: 'Assistentes de IA conversacionais para diferentes públicos',
    icon: 'bot',
    order: 1
  },
  sales: {
    name: 'Pré-vendas',
    description: 'Assistentes de IA para captação e conversão de leads',
    icon: 'megaphone',
    order: 2
  },
  generators: {
    name: 'Geradores de Conteúdo',
    description: 'IAs para geração de quizzes, conteúdos e materiais educativos',
    icon: 'sparkles',
    order: 3
  },
  curation: {
    name: 'Curadoria em Lote',
    description: 'IAs para geração em massa de conteúdo da Jornada V2',
    icon: 'layers',
    order: 4
  },
  utilities: {
    name: 'Utilitários de IA',
    description: 'Parsers NLP e geradores de metadados auxiliares',
    icon: 'wrench',
    order: 5
  }
};

module.exports = { ALL_MODULE_TYPES, AGENT_META, AGENT_CATEGORIES };
