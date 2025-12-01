
-- Create quiz_sessions table for tracking user quiz sessions
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  phase_id UUID REFERENCES public.development_phases(id),
  week_number INTEGER,
  session_type TEXT NOT NULL DEFAULT 'regular', -- 'regular', 'review', 'assessment'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  total_duration_seconds INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed', 'abandoned'
  questions_attempted INTEGER DEFAULT 0,
  questions_completed INTEGER DEFAULT 0,
  completion_percentage NUMERIC(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz_analytics table for detailed performance tracking
CREATE TABLE public.quiz_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id),
  response_time_seconds NUMERIC(8,2),
  answer_given BOOLEAN,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  help_requested BOOLEAN DEFAULT false,
  attempts_count INTEGER DEFAULT 1,
  difficulty_perceived INTEGER CHECK (difficulty_perceived >= 1 AND difficulty_perceived <= 5),
  feedback_viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz_configurations table for dynamic quiz settings
CREATE TABLE public.quiz_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.development_phases(id),
  week_number INTEGER,
  max_questions_per_session INTEGER DEFAULT 10,
  time_limit_minutes INTEGER,
  retry_attempts_allowed INTEGER DEFAULT 3,
  difficulty_adjustment BOOLEAN DEFAULT true,
  feedback_immediate BOOLEAN DEFAULT true,
  progress_save_interval_seconds INTEGER DEFAULT 30,
  adaptive_questioning BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(phase_id, week_number)
);

-- Create question_feedback table for detailed response tracking
CREATE TABLE public.question_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id) NOT NULL,
  session_id UUID REFERENCES public.quiz_sessions(id),
  feedback_type TEXT NOT NULL, -- 'positive', 'negative', 'neutral'
  feedback_text TEXT,
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, child_id, question_id, session_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_quiz_sessions_user_child ON public.quiz_sessions(user_id, child_id);
CREATE INDEX idx_quiz_sessions_status ON public.quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_phase_week ON public.quiz_sessions(phase_id, week_number);
CREATE INDEX idx_quiz_analytics_session ON public.quiz_analytics(session_id);
CREATE INDEX idx_quiz_analytics_user_child ON public.quiz_analytics(user_id, child_id);
CREATE INDEX idx_quiz_analytics_question ON public.quiz_analytics(question_id);
CREATE INDEX idx_question_feedback_user_child ON public.question_feedback(user_id, child_id);

-- Enable Row Level Security
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions" 
  ON public.quiz_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz sessions" 
  ON public.quiz_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
  ON public.quiz_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for quiz_analytics
CREATE POLICY "Users can view their own quiz analytics" 
  ON public.quiz_analytics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz analytics" 
  ON public.quiz_analytics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_configurations
CREATE POLICY "Quiz configurations are viewable by all authenticated users" 
  ON public.quiz_configurations FOR SELECT 
  USING (auth.role() = 'authenticated');

-- RLS Policies for question_feedback
CREATE POLICY "Users can view their own question feedback" 
  ON public.question_feedback FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question feedback" 
  ON public.question_feedback FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question feedback" 
  ON public.question_feedback FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to automatically update quiz session progress
CREATE OR REPLACE FUNCTION public.update_quiz_session_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the session progress when new analytics are added
  UPDATE public.quiz_sessions 
  SET 
    questions_attempted = (
      SELECT COUNT(DISTINCT question_id) 
      FROM public.quiz_analytics 
      WHERE session_id = NEW.session_id
    ),
    questions_completed = (
      SELECT COUNT(DISTINCT question_id) 
      FROM public.quiz_analytics 
      WHERE session_id = NEW.session_id AND answer_given IS NOT NULL
    ),
    updated_at = now()
  WHERE id = NEW.session_id;
  
  -- Update completion percentage
  UPDATE public.quiz_sessions 
  SET completion_percentage = CASE 
    WHEN questions_attempted > 0 THEN 
      (questions_completed::NUMERIC / questions_attempted::NUMERIC) * 100
    ELSE 0 
  END
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update session progress
CREATE TRIGGER trigger_update_quiz_session_progress
  AFTER INSERT ON public.quiz_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quiz_session_progress();

-- Create function to automatically complete quiz sessions
CREATE OR REPLACE FUNCTION public.auto_complete_quiz_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-complete session if all questions in the week/phase are completed
  IF NEW.completion_percentage >= 100 AND NEW.status = 'active' THEN
    UPDATE public.quiz_sessions 
    SET 
      status = 'completed',
      completed_at = now(),
      updated_at = now()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-complete sessions
CREATE TRIGGER trigger_auto_complete_quiz_session
  AFTER UPDATE OF completion_percentage ON public.quiz_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_complete_quiz_session();

-- Insert default quiz configurations for existing phases
INSERT INTO public.quiz_configurations (phase_id, week_number, max_questions_per_session, time_limit_minutes, retry_attempts_allowed)
SELECT 
  dp.id as phase_id,
  wm.week_number,
  10 as max_questions_per_session,
  30 as time_limit_minutes,
  3 as retry_attempts_allowed
FROM public.development_phases dp
LEFT JOIN public.week_milestones wm ON dp.id = wm.phase_id
ON CONFLICT (phase_id, week_number) DO NOTHING;
