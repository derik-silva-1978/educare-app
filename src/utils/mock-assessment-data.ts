
import { Assessment, AssessmentItem, DevelopmentDomain } from '@/types/assessment';
import { DomainProgressWithTimeline, Milestone } from '@/types/development';

/**
 * Generate a mock assessment with provided data
 */
export const createMockAssessment = (
  id: string,
  childId: string,
  childName: string,
  childAge: number
): Assessment => {
  return {
    id,
    title: `Assessment for ${childName}`,
    status: 'completed',
    studentId: childId,
    studentName: childName,
    childId: childId,
    childName: childName,
    childAgeMonths: childAge,
    domains: ['motor', 'language', 'cognitive', 'social', 'emotional', 'communication'],
    items: generateMockItems(),
    observations: {
      'motor': 'Shows good control of large muscles',
      'language': 'Beginning to form simple sentences',
      'cognitive': 'Can solve simple puzzles',
      'social': 'Plays well with other children',
      'emotional': 'Shows empathy towards others',
    },
    progress: 75,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    evaluator: 'Parent',
    date: new Date().toISOString(),
    user_id: 'mock-user-id',
  };
};

/**
 * Generate mock assessment items
 */
export const generateMockItems = (): AssessmentItem[] => {
  return [
    {
      id: '1',
      domain: 'motor',
      question: 'Can the child walk without assistance?',
      level: 'high',
      skill: 'Walking',
      description: 'Walking independently',
      text: 'Can walk without assistance',
      completed: true,
      required: true,
      title: 'Walking independently',
    },
    {
      id: '2',
      domain: 'language',
      question: 'Can the child say simple words?',
      level: 'medium',
      skill: 'Speaking',
      description: 'Speaking simple words',
      text: 'Can say at least 5 simple words',
      completed: true,
      required: true,
      title: 'Speaking simple words',
    },
    {
      id: '3',
      domain: 'cognitive',
      question: 'Can the child solve simple puzzles?',
      level: 'high',
      skill: 'Problem solving',
      description: 'Solving simple puzzles',
      text: 'Can solve age-appropriate puzzles',
      completed: true,
      required: true,
      title: 'Problem solving',
    },
  ];
};

/**
 * Generate mock domain progress data
 */
export const generateMockDomainProgress = (): DomainProgressWithTimeline[] => {
  return [
    { domain: 'motor', progress: 85, milestones: [] },
    { domain: 'language', progress: 65, milestones: [] },
    { domain: 'social', progress: 75, milestones: [] },
    { domain: 'cognitive', progress: 90, milestones: [] },
    { domain: 'emotional', progress: 60, milestones: [] },
    { domain: 'communication', progress: 70, milestones: [] },
  ];
};

/**
 * Generate mock milestones
 */
export const generateMockMilestones = (childAge: number): Milestone[] => {
  return [
    { 
      id: '1', 
      title: 'Andar sem apoio', 
      description: 'A criança consegue andar sem precisar se apoiar',
      age: 12, 
      completed: true, 
      domain: 'motor',
      skills: ['Equilíbrio', 'Coordenação']
    },
    { 
      id: '2', 
      title: 'Falar primeiras palavras',
      description: 'A criança consegue falar palavras com significado',
      age: 12, 
      completed: childAge >= 12, 
      domain: 'language',
      skills: ['Comunicação', 'Vocabulário']
    },
    { 
      id: '3', 
      title: 'Segurar objetos pequenos',
      description: 'A criança consegue segurar e manipular objetos pequenos', 
      age: 9, 
      completed: childAge >= 9, 
      domain: 'motor',
      skills: ['Motricidade fina']
    },
    { 
      id: '4', 
      title: 'Reconhecer familiares',
      description: 'A criança demonstra reconhecer pessoas familiares',
      age: 3, 
      completed: true, 
      domain: 'social',
      skills: ['Reconhecimento facial', 'Memória']
    },
    { 
      id: '5', 
      title: 'Juntar duas palavras',
      description: 'A criança consegue juntar duas palavras para formar frases simples',
      age: 18, 
      completed: childAge >= 18, 
      domain: 'language',
      skills: ['Sintaxe', 'Gramática']
    }
  ];
};
