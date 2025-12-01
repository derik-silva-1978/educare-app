
// Ensure the DevelopmentDomain type includes all required domain types
export type DevelopmentDomain = 
  | 'motor' 
  | 'language' 
  | 'social' 
  | 'sensory' 
  | 'cognitive' 
  | 'emotional'
  | 'communication'
  | 'social_emotional'
  | 'self_care'
  | 'maternal_health'
  | 'adaptive'
  | 'behavioral'
  | 'academic';

export type AssessmentDomain = DevelopmentDomain;

export interface DevelopmentQuestion {
  id: string;
  domain: DevelopmentDomain;
  text?: string;
  question?: string;
  help_text?: string;
  age_min_months?: number;
  age_max_months?: number;
  skill?: string;
  description?: string;
  question_text?: string; // Added for compatibility with quiz questions
  importance_note?: string;
  positive_feedback_title?: string;
  positive_feedback_tips?: string[];
  negative_feedback_title?: string;
  negative_feedback_tips?: string[];
  // Other question fields
  [key: string]: any;
}

export type ResponseType = 'yes' | 'partially' | 'no' | 'not_applicable' | 'developing' | null;

export const ResponseLabels: Record<string, string> = {
  'yes': 'Sim',
  'partially': 'Parcialmente',
  'no': 'Não',
  'not_applicable': 'Não se aplica',
  'developing': 'Em desenvolvimento',
  'null': 'Não respondido'
};

export type AssessmentLevel = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'not_present' 
  | 'emerging' 
  | 'developing'
  | 'developing_strong'
  | 'achieved'
  | 'mastered'
  | 'acquired'
  | null;

export type AssessmentStatus = 
  | 'draft' 
  | 'completed' 
  | 'in_progress'
  | 'in-progress' 
  | 'archived'
  | 'pending';

export const DomainLabels: Record<string, string> = {
  'motor': 'Motor',
  'language': 'Linguagem',
  'social': 'Social',
  'sensory': 'Sensorial',
  'cognitive': 'Cognitivo',
  'emotional': 'Emocional',
  'communication': 'Comunicação',
  'social_emotional': 'Socioemocional',
  'self_care': 'Autocuidado',
  'maternal_health': 'Saúde Materna',
  'adaptive': 'Adaptativo',
  'behavioral': 'Comportamental',
  'academic': 'Acadêmico'
};

// Domain Icons for UI representation
export const DomainIcons: Record<DevelopmentDomain, string> = {
  'motor': '🚶',
  'language': '💬',
  'social': '👥',
  'sensory': '👁️',
  'cognitive': '🧠',
  'emotional': '❤️',
  'communication': '🗣️',
  'social_emotional': '😊',
  'self_care': '🧼',
  'maternal_health': '👩‍👦',
  'adaptive': '🔄',
  'behavioral': '🧸',
  'academic': '📚'
};

// Helper utility to get domain display name
export const getDomainDisplayName = (domain: DevelopmentDomain): string => {
  return DomainLabels[domain] || domain;
};

// Helper utility to get level labels for assessment items
export const getLevelLabel = (level: AssessmentLevel): string => {
  const levelLabels: Record<string, string> = {
    'low': 'Baixo',
    'medium': 'Médio',
    'high': 'Alto',
    'not_present': 'Não Presente',
    'emerging': 'Emergente',
    'developing': 'Em Desenvolvimento',
    'developing_strong': 'Desenvolvimento Avançado',
    'achieved': 'Alcançado',
    'mastered': 'Dominado',
    'acquired': 'Adquirido'
  };
  
  return level ? levelLabels[level] || String(level) : 'Não avaliado';
};

// Other assessment types...
export type AssessmentResponse = {
  id: string;
  question_id: string;
  questionId?: string; // Added for compatibility
  level: AssessmentLevel;
  notes?: string;
  
  // Additional fields needed based on error messages
  assessment_id?: string;
  response?: ResponseType;
  domain?: DevelopmentDomain;
  questions?: any[];
  created_at?: string;
  updated_at?: string;
};

export interface AssessmentItem {
  id: string;
  domain: DevelopmentDomain;
  question: string | DevelopmentQuestion;
  skill?: string;
  description?: string;
  text?: string;
  level: AssessmentLevel;
  notes?: string;
  completed?: boolean;
  required?: boolean;
  title?: string;
  response?: ResponseType;
}

export interface Assessment {
  id: string;
  title: string;
  status: AssessmentStatus;
  studentId?: string;
  student_id?: string;
  studentName?: string;
  student_name?: string;
  domains: DevelopmentDomain[];
  items: AssessmentItem[];
  observations: Record<string, string>;
  created_at: string;
  createdAt: string;
  updated_at: string;
  updatedAt: string;
  evaluator: string;
  date: string;
  childId?: string;
  childName?: string;
  childAgeMonths?: number;
  progress: number;
  completed?: boolean;
  feedback?: string;
  user_id: string;
  userId?: string;
  assessment_id?: string; // Added for compatibility
}

export interface AssessmentForm extends Assessment {
  // Additional properties for forms
  [key: string]: any;
}

// Add interface for assessment summary type
export interface AssessmentSummary {
  id: string;
  title: string;
  date: string;
  status: string;
  studentName: string;
  updatedAt: string;
  domains?: DevelopmentDomain[];
  progress?: number;
}

// Add interface for Domain Progress reporting
export interface DomainProgress {
  domain: DevelopmentDomain;
  progress: number;
  score: number;
  total?: number;
  completed?: number;
}

// Add interface for recommended activities
export interface RecommendedActivity {
  id: string;
  domain: DevelopmentDomain;
  title: string;
  description: string;
  age_range?: string;
}

// Add Anamnese related types
export interface AnamneseQuestion {
  id: string;
  category: string;
  question: string;
  options?: string[];
  responseOptions?: string[];
  required?: boolean;
  friendlyDescription?: string;
  positiveFeeback?: string;
  motherTips?: string;
  type?: string; // Added for compatibility based on error messages
}

export interface AnamneseResponse {
  questionId: string;
  value: string;
  response?: string; // For compatibility
  notes?: string;
}

// Add stub type for PEI Goal - which would need to be defined in a separate file or here
export interface PEIGoal {
  id: string;
  title: string;
  description: string;
  domain: DevelopmentDomain;
  targetDate: string;
  status: string;
  evaluationMethod?: string;
  strategies: string[];
  progress: any[];
}
