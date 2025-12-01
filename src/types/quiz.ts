export interface QuizQuestion {
  id: string;
  phase_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  order_index: number;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  tip?: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  domain?: 'cognitive' | 'language' | 'motor' | 'social_emotional';
  active: boolean;
  created_at: string;
}

export interface QuizPhase {
  id: string;
  title: string;
  description?: string;
  min_months: number;
  max_months: number;
  icon_class?: string;
  color_class?: string;
  bg_color?: string;
  border_color?: string;
  badge_name?: string;
  order_index: number;
  status?: 'unlocked' | 'locked' | 'current' | 'completed';
}

export interface DevelopmentPhase {
  id: string;
  title: string;
  description: string;
  age_range: string;
  order_index: number;
  created_at: string;
}

export interface QuizProgress {
  id: string;
  user_id: string;
  child_id: string;
  question_id: string;
  answer: boolean;
  created_at: string;
  updated_at: string;
}
