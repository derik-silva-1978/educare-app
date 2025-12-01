import { DevelopmentDomain } from '@/types/assessment';

// Domain color definitions
export const domainColors: Record<string, string> = {
  cognitive: 'blue',
  motor: 'green',
  social: 'red',
  language: 'purple',
  adaptive: 'orange',
  communication: 'yellow',
  sensory: 'pink',
  social_emotional: 'brown',
  self_care: 'gray',
  maternal_health: 'black'
};

// Domain labels for display
export const domainLabels: Record<string, string> = {
  cognitive: 'Cognitivo',
  motor: 'Motor',
  social: 'Social',
  language: 'Linguagem',
  adaptive: 'Adaptativo',
  communication: 'Comunicação',
  sensory: 'Sensorial',
  social_emotional: 'Socioemocional',
  self_care: 'Autocuidado',
  maternal_health: 'Saúde Materna'
};

// Helper function to get domain label
export const getDomainLabel = (domain: DevelopmentDomain): string => {
  return domainLabels[domain] || domain;
};

// Helper function to create a complete domain record
const createDomainRecord = <T>(partialRecord: Partial<Record<DevelopmentDomain, T>>, defaultValue: T): Record<DevelopmentDomain, T> => {
  const fullRecord = { ...partialRecord } as Record<DevelopmentDomain, T>;
  
  // Ensure all domains have values
  const allDomains: DevelopmentDomain[] = [
    'cognitive', 'motor', 'social', 'language', 'adaptive', 
    'communication', 'sensory', 'social_emotional', 'self_care', 
    'maternal_health'
  ];
  
  allDomains.forEach(domain => {
    if (!fullRecord[domain]) {
      fullRecord[domain] = defaultValue;
    }
  });
  
  return fullRecord;
};

export const domainEmojis = createDomainRecord({
  cognitive: '🧠',
  motor: '🏃‍♂️',
  social: '👥',
  language: '🗣️',
  adaptive: '🔄',
  communication: '💬',
  sensory: '👁️',
  social_emotional: '❤️',
  self_care: '🛡️',
  maternal_health: '🩺'
}, '📊');

export const domainExamples = createDomainRecord({
  cognitive: 'Reconhece objetos, resolve problemas simples, entende conceitos',
  motor: 'Segura objetos, engatinha, anda, corre, pula',
  social: 'Sorri, interage com adultos e crianças, brinca junto',
  language: 'Balbucia, fala palavras, forma frases, compreende instruções',
  adaptive: 'Adapta-se a novas rotinas, situações e ambientes',
  communication: 'Comunica necessidades, faz solicitações, interage',
  sensory: 'Processa estímulos visuais, auditivos e táteis',
  social_emotional: 'Expressa e regula emoções, cria vínculos afetivos',
  self_care: 'Alimenta-se, veste-se, cuida da higiene pessoal',
  maternal_health: 'Cuidados pré e pós-natais, amamentação, vínculo materno'
}, 'Habilidades importantes para o desenvolvimento');

export const domainActivities = createDomainRecord({
  cognitive: 'Quebra-cabeças, jogos de memória, blocos de construção',
  motor: 'Correr, pular, jogar bola, desenhar, pintar',
  social: 'Brincadeiras em grupo, compartilhar brinquedos, jogos colaborativos',
  language: 'Contar histórias, cantar músicas, conversar bastante',
  adaptive: 'Estabelecer rotinas, praticar vestir-se e comer sozinho',
  communication: 'Fazer perguntas, responder, incentivar a expressão',
  sensory: 'Brincadeiras sensoriais com texturas, sons e cores',
  social_emotional: 'Jogos de faz-de-conta, atividades de expressão emocional',
  self_care: 'Praticar independência em higiene pessoal e alimentação',
  maternal_health: 'Alimentação saudável, exercícios adequados, relaxamento'
}, 'Atividades de estímulo apropriadas para a idade');

export default {
  domainLabels,
  domainEmojis,
  domainExamples,
  domainActivities,
  getDomainLabel
};
