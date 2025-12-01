
// Enhanced types for the new backend quiz system
export interface QuizSession {
  id: string;
  user_id: string;
  child_id: string;
  phase_id?: string;
  week_number?: number;
  session_type: 'regular' | 'review' | 'assessment';
  started_at: string;
  completed_at?: string;
  paused_at?: string;
  total_duration_seconds: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  questions_attempted: number;
  questions_completed: number;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAnalytics {
  id: string;
  session_id: string;
  user_id: string;
  child_id: string;
  question_id: string;
  response_time_seconds?: number;
  answer_given?: boolean;
  confidence_level?: number; // 1-5
  help_requested: boolean;
  attempts_count: number;
  difficulty_perceived?: number; // 1-5
  feedback_viewed: boolean;
  created_at: string;
}

export interface QuizConfiguration {
  id: string;
  phase_id?: string;
  week_number?: number;
  max_questions_per_session: number;
  time_limit_minutes?: number;
  retry_attempts_allowed: number;
  difficulty_adjustment: boolean;
  feedback_immediate: boolean;
  progress_save_interval_seconds: number;
  adaptive_questioning: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionFeedback {
  id: string;
  user_id: string;
  child_id: string;
  question_id: string;
  session_id?: string;
  feedback_type: 'positive' | 'negative' | 'neutral';
  feedback_text?: string;
  helpful_rating?: number; // 1-5
  suggestion?: string;
  created_at: string;
}

export interface SessionMetrics {
  totalSessions: number;
  completedSessions: number;
  averageCompletionTime: number;
  averageScore: number;
  currentStreak: number;
}
