
import { v4 as uuidv4 } from 'uuid';
import { AssessmentForm, AssessmentItem, DevelopmentDomain, AssessmentStatus } from '@/types/assessment';

// Default domains used in assessments
export const DEFAULT_DOMAINS: DevelopmentDomain[] = [
  'cognitive',
  'motor',
  'social',
  'language',
  'adaptive'
];

// Create an empty assessment with basic structure
export const createEmptyAssessment = (studentId: string): AssessmentForm => {
  const now = new Date().toISOString();
  const id = uuidv4();
  
  // Create an assessment that is compatible with both client and server models
  const assessment: AssessmentForm = {
    id,
    title: `Nova Avaliação`,
    date: now,
    // Fields for client-side model
    studentId,
    studentName: '',
    evaluator: '',
    observations: {},
    domains: DEFAULT_DOMAINS,
    items: generateDefaultItems(DEFAULT_DOMAINS),
    status: 'draft' as AssessmentStatus,
    createdAt: now,
    updatedAt: now,
    // Required server-side fields
    student_id: studentId,
    student_name: '',
    created_at: now,
    updated_at: now,
    user_id: '',
    // Additional fields
    childName: '',
    childId: studentId,
    childAgeMonths: 0,
    progress: 0,
    completed: false,
    feedback: ''
  };
  
  return assessment;
};

// Generate a set of default assessment items for each domain
export const generateDefaultItems = (domains: DevelopmentDomain[]): AssessmentItem[] => {
  const items: AssessmentItem[] = [];
  
  domains.forEach(domain => {
    // Add different items based on domain
    switch (domain) {
      case 'cognitive':
        items.push(
          createItem(domain, 'Memória', 'Capacidade de reter e recuperar informações'),
          createItem(domain, 'Atenção', 'Capacidade de concentrar-se em tarefas'),
          createItem(domain, 'Resolução de problemas', 'Capacidade de encontrar soluções para situações novas')
        );
        break;
      
      case 'motor':
        items.push(
          createItem(domain, 'Coordenação motora fina', 'Habilidade com movimentos precisos das mãos'),
          createItem(domain, 'Coordenação motora grossa', 'Movimentos amplos que envolvem grandes grupos musculares'),
          createItem(domain, 'Equilíbrio', 'Capacidade de manter a estabilidade corporal')
        );
        break;
        
      case 'social':
        items.push(
          createItem(domain, 'Interação com colegas', 'Habilidade de interagir com outras crianças'),
          createItem(domain, 'Expressão emocional', 'Capacidade de expressar suas emoções adequadamente'),
          createItem(domain, 'Seguir regras', 'Compreensão e obediência às regras estabelecidas')
        );
        break;
        
      case 'language':
        items.push(
          createItem(domain, 'Compreensão verbal', 'Entendimento da linguagem falada'),
          createItem(domain, 'Expressão verbal', 'Capacidade de se comunicar verbalmente'),
          createItem(domain, 'Vocabulário', 'Amplitude do conhecimento de palavras')
        );
        break;
        
      case 'adaptive':
        items.push(
          createItem(domain, 'Autonomia pessoal', 'Capacidade de realizar atividades de autocuidado'),
          createItem(domain, 'Organização', 'Habilidade de organizar materiais e seguir sequências'),
          createItem(domain, 'Adaptabilidade', 'Flexibilidade para se ajustar a mudanças na rotina')
        );
        break;
        
      default:
        items.push(
          createItem(domain, `Habilidade 1`, `Descrição da habilidade 1`),
          createItem(domain, `Habilidade 2`, `Descrição da habilidade 2`)
        );
    }
  });
  
  return items;
};

// Helper to create a single assessment item
const createItem = (domain: DevelopmentDomain, skill: string, description: string): AssessmentItem => {
  const questionText = `Avaliação de ${skill.toLowerCase()} - ${description}`;
  return {
    id: uuidv4(),
    domain,
    question: questionText,
    skill,
    description,
    text: questionText,
    level: null,
    notes: '',
    required: true,
    title: skill,
    completed: false,
    response: null // Add the required response field
  };
};
