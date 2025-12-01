
// Journey Bot Types
export interface JourneyBotSession {
  id: string;
  user_id: string;
  child_id: string;
  started_at: string;
  completed_at?: string | null;
  total_questions: number;
  answered_questions: number;
  current_dimension?: string | null;
  status: 'active' | 'completed' | 'paused';
  session_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface JourneyBotQuestion {
  id: string;
  
  // Metadados do módulo
  meta_title?: string;
  meta_min_months: number;
  meta_max_months: number;
  meta_description?: string;
  
  // Dados da semana
  week?: number;
  week_title?: string;
  week_description?: string;
  
  // Gamificação - Boas-vindas
  gamification_welcome_title?: string;
  gamification_welcome_message?: string;
  
  // Gamificação - Badge e progresso
  gamification_badge_name?: string;
  gamification_progress_message?: string;
  gamification_challenge_description?: string;
  gamification_tips?: string;
  gamification_closing_message?: string;
  gamification_affective_record?: string;
  gamification_personalized_message?: string;
  
  // Dados da pergunta principal
  domain_name: string;
  domain_question: string;
  domain_importance?: string;
  
  // Feedbacks por resposta
  domain_feedback_1?: string;
  domain_feedback_2?: string;
  domain_feedback_3?: string;
  
  // Atividades e alertas
  domain_activities?: string;
  domain_alert_missing?: string;
  
  // Controles
  order_index?: number;
  is_active?: boolean;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Campos legados (para compatibilidade)
  dimension?: string;
  question_text?: string;
  age_min_months?: number;
  age_max_months?: number;
  age_min_weeks?: number | null;
  age_max_weeks?: number | null;
  concern_level?: number;
  active?: boolean;
  feedback_yes?: string;
  feedback_no?: string;
  feedback_unknown?: string;
  tips_yes?: string[] | null;
  tips_no?: string[] | null;
  tips_unknown?: string[] | null;
  
  // WhatsApp interface metadata (legado)
  jsonData?: {
    categoryName: string;
    categoryIcon: string;
    importance: string;
    options: {
      value: number;
      text: string;
      emoji: string;
    }[];
    feedbacks: {
      [key: string]: string;
    };
    activity: string;
  };
}

export interface JourneyBotResponse {
  id: string;
  session_id: string;
  user_id: string;
  child_id: string;
  question_id?: string | null;
  answer: 1 | 2 | 3; // 1=Yes, 2=No, 3=Unknown
  responded_at: string;
  dimension: string;
  question_text: string;
  answer_text: string;
  feedback_provided?: string | null;
  created_at: string;
}

export interface JourneyBotAchievement {
  id: string;
  user_id: string;
  child_id: string;
  session_id?: string | null;
  achievement_type: string;
  achievement_name: string;
  achievement_description?: string | null;
  dimension?: string | null;
  metadata: Record<string, unknown>;
  earned_at: string;
}

// Journey Bot Dimensions
export type JourneyBotDimension = 
  | 'motor_grosso' 
  | 'motor_fino' 
  | 'linguagem' 
  | 'cognitivo' 
  | 'social_emocional'
  | 'autocuidado';

// Helper function to check if a string is a valid dimension
export const isValidDimension = (dimension: string): dimension is JourneyBotDimension => {
  return ['motor_grosso', 'motor_fino', 'linguagem', 'cognitivo', 'social_emocional', 'autocuidado'].includes(dimension);
};

// Helper function to cast dimension safely
export const castToDimension = (dimension: string): JourneyBotDimension => {
  if (isValidDimension(dimension)) {
    return dimension;
  }
  // Fallback to a default dimension
  return 'cognitivo';
};

// Dimension Icons and Colors
export const DimensionIcons: Record<JourneyBotDimension, string> = {
  motor_grosso: '🏃',
  motor_fino: '✋',
  linguagem: '💬',
  cognitivo: '🧠',
  social_emocional: '❤️',
  autocuidado: '🧼'
};

export const DimensionColors: Record<JourneyBotDimension, string> = {
  motor_grosso: 'bg-blue-500',
  motor_fino: 'bg-green-500',
  linguagem: 'bg-purple-500',
  cognitivo: 'bg-orange-500',
  social_emocional: 'bg-pink-500',
  autocuidado: 'bg-yellow-500'
};

export const DimensionLabels: Record<JourneyBotDimension, string> = {
  motor_grosso: 'Motor Grosso',
  motor_fino: 'Motor Fino',
  linguagem: 'Linguagem',
  cognitivo: 'Cognitivo',
  social_emocional: 'Social/Emocional',
  autocuidado: 'Autocuidado'
};
