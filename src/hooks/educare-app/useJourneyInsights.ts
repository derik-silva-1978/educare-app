import { useQuery } from '@tanstack/react-query';

interface DomainProgress {
  domain: string;
  shortName: string;
  progress: number;
  color: string;
}

interface StrengthItem {
  domain: string;
  description: string;
  score: number;
}

interface Insight {
  id: string;
  type: 'tip' | 'activity' | 'milestone' | 'alert';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  domain: string;
  status: 'achieved' | 'current' | 'upcoming';
  source?: string;
}

interface JourneyInsightsData {
  domainProgress: DomainProgress[];
  strengths: StrengthItem[];
  opportunities: StrengthItem[];
  insights: Insight[];
  milestones: Milestone[];
}

const defaultDomainProgress: DomainProgress[] = [
  { domain: 'Motor', shortName: 'Motor', progress: 0, color: '#3B82F6' },
  { domain: 'Linguagem', shortName: 'Linguagem', progress: 0, color: '#10B981' },
  { domain: 'Cognitivo', shortName: 'Cognitivo', progress: 0, color: '#F59E0B' },
  { domain: 'Social', shortName: 'Social', progress: 0, color: '#8B5CF6' },
  { domain: 'Sensorial', shortName: 'Sensorial', progress: 0, color: '#EC4899' },
];

const defaultInsights: Insight[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Dica do TitiNauta',
    description: 'Converse com seu filho durante as atividades diárias. Narrar o que você está fazendo ajuda no desenvolvimento da linguagem.',
    action: 'Ver mais dicas',
    actionUrl: '/educare-app/titinauta',
  },
  {
    id: '2',
    type: 'activity',
    title: 'Atividade Sugerida',
    description: 'Brincar de empilhar blocos ajuda a desenvolver coordenação motora e noção espacial.',
    action: 'Ver atividades',
    actionUrl: '/educare-app/activities',
  },
];

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Sorriso Social',
    description: 'Bebê responde com sorrisos quando interage com adultos.',
    ageRange: '2-3 meses',
    domain: 'Social',
    status: 'achieved',
    source: 'Ministério da Saúde',
  },
  {
    id: '2',
    title: 'Sustenta a Cabeça',
    description: 'Consegue manter a cabeça firme quando está no colo.',
    ageRange: '3-4 meses',
    domain: 'Motor',
    status: 'achieved',
    source: 'Ministério da Saúde',
  },
  {
    id: '3',
    title: 'Primeiras Palavras',
    description: 'Fala "mama" ou "papa" com significado.',
    ageRange: '9-12 meses',
    domain: 'Linguagem',
    status: 'current',
    source: 'Ministério da Saúde',
  },
  {
    id: '4',
    title: 'Primeiros Passos',
    description: 'Caminha com apoio ou independentemente.',
    ageRange: '12-15 meses',
    domain: 'Motor',
    status: 'upcoming',
    source: 'Ministério da Saúde',
  },
];

export function useJourneyInsights(childId?: string) {
  return useQuery({
    queryKey: ['journey-insights', childId],
    queryFn: async (): Promise<JourneyInsightsData> => {
      return {
        domainProgress: defaultDomainProgress,
        strengths: [],
        opportunities: [],
        insights: defaultInsights,
        milestones: defaultMilestones,
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export type { DomainProgress, StrengthItem, Insight, Milestone, JourneyInsightsData };
