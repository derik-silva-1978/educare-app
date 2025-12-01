
-- Create user_quiz_progress table for quiz functionality
CREATE TABLE public.user_quiz_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  answer BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, child_id, question_id)
);

-- Create quiz_questions table for quiz system
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  dimension TEXT NOT NULL,
  age_min_months INTEGER NOT NULL,
  age_max_months INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  feedback_yes TEXT NOT NULL,
  feedback_no TEXT NOT NULL,
  feedback_unknown TEXT NOT NULL,
  concern_level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create child_anamnese table for medical history functionality
CREATE TABLE public.child_anamnese (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prenatal_start TEXT,
  blood_exams TEXT,
  immunization TEXT,
  birth_location TEXT,
  birth_type TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_anamnese ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_quiz_progress
CREATE POLICY "Users can view their own quiz progress" 
  ON public.user_quiz_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz progress" 
  ON public.user_quiz_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz progress" 
  ON public.user_quiz_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz progress" 
  ON public.user_quiz_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for quiz_questions (public read access)
CREATE POLICY "Anyone can view active quiz questions" 
  ON public.quiz_questions 
  FOR SELECT 
  USING (active = true);

-- RLS policies for child_anamnese
CREATE POLICY "Users can view their own child anamnese" 
  ON public.child_anamnese 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own child anamnese" 
  ON public.child_anamnese 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child anamnese" 
  ON public.child_anamnese 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child anamnese" 
  ON public.child_anamnese 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert some sample quiz questions
INSERT INTO public.quiz_questions (question_text, dimension, age_min_months, age_max_months, order_index, feedback_yes, feedback_no, feedback_unknown) VALUES
('A criança consegue sustentar a cabeça quando está de bruços?', 'motor_grosso', 2, 6, 1, 'Excelente! Continue estimulando.', 'Vamos trabalhar o fortalecimento.', 'Continue observando.'),
('A criança reage aos sons familiares?', 'linguagem', 0, 4, 2, 'Ótimo desenvolvimento auditivo!', 'Vamos aumentar a estimulação sonora.', 'Continue testando com diferentes sons.'),
('A criança consegue sentar sem apoio?', 'motor_grosso', 6, 10, 3, 'Marco importante atingido!', 'Vamos praticar com apoio gradual.', 'Continue oferecendo oportunidades.');
