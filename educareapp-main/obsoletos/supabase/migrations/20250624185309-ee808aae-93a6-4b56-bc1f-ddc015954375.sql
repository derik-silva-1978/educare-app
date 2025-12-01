
-- Criar tabela para sessões da Jornada Bot
CREATE TABLE public.journey_bot_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_dimension TEXT,
  total_questions INTEGER DEFAULT 0,
  answered_questions INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, paused
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para respostas da Jornada Bot
CREATE TABLE public.journey_bot_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.journey_bot_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.quiz_questions(id),
  dimension TEXT NOT NULL, -- language, motor, social, sensory
  question_text TEXT NOT NULL,
  answer INTEGER NOT NULL, -- 1=Sim, 2=Não, 3=Não sei
  answer_text TEXT NOT NULL, -- "Sim", "Não", "Não sei"
  feedback_provided TEXT,
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para conquistas da Jornada Bot
CREATE TABLE public.journey_bot_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- dimension_complete, streak, explorer, etc
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  dimension TEXT, -- language, motor, social, sensory (se aplicável)
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID REFERENCES public.journey_bot_sessions(id),
  metadata JSONB DEFAULT '{}'
);

-- Criar tabela para perguntas específicas da Jornada Bot (se necessário personalizar)
CREATE TABLE public.journey_bot_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension TEXT NOT NULL, -- language, motor, social, sensory
  age_min_months INTEGER NOT NULL,
  age_max_months INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  feedback_yes TEXT NOT NULL, -- Feedback para resposta "Sim"
  feedback_no TEXT NOT NULL, -- Feedback para resposta "Não"  
  feedback_unknown TEXT NOT NULL, -- Feedback para "Não sei"
  tips_yes TEXT[], -- Dicas para estimular quando resposta é "Sim"
  tips_no TEXT[], -- Dicas para desenvolver quando resposta é "Não"
  tips_unknown TEXT[], -- Dicas para observar quando "Não sei"
  concern_level INTEGER DEFAULT 0, -- 0=normal, 1=atenção, 2=preocupação
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.journey_bot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_bot_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_bot_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_bot_questions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para journey_bot_sessions
CREATE POLICY "Users can view their own journey sessions" 
  ON public.journey_bot_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey sessions" 
  ON public.journey_bot_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey sessions" 
  ON public.journey_bot_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para journey_bot_responses
CREATE POLICY "Users can view their own journey responses" 
  ON public.journey_bot_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey responses" 
  ON public.journey_bot_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para journey_bot_achievements
CREATE POLICY "Users can view their own journey achievements" 
  ON public.journey_bot_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey achievements" 
  ON public.journey_bot_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para journey_bot_questions (leitura pública para usuários autenticados)
CREATE POLICY "Authenticated users can view journey questions" 
  ON public.journey_bot_questions 
  FOR SELECT 
  TO authenticated 
  USING (active = true);

-- Inserir algumas perguntas de exemplo para testar
INSERT INTO public.journey_bot_questions 
(dimension, age_min_months, age_max_months, question_text, order_index, feedback_yes, feedback_no, feedback_unknown, tips_yes, tips_no, tips_unknown, concern_level) 
VALUES 
(
  'language',
  12, 18,
  'A criança consegue falar pelo menos 5 palavras diferentes?',
  1,
  'Que maravilha! A linguagem da criança está se desenvolvendo muito bem!',
  'Não se preocupe, cada criança tem seu próprio ritmo de desenvolvimento.',
  'É importante observar e estimular a comunicação da criança.',
  ARRAY['Continue conversando bastante com a criança', 'Leia livros juntos diariamente', 'Cante músicas infantis'],
  ARRAY['Fale mais com a criança durante as atividades diárias', 'Use gestos para acompanhar as palavras', 'Repita palavras simples várias vezes'],
  ARRAY['Observe se a criança tenta se comunicar de outras formas', 'Preste atenção aos sons que ela faz', 'Anote as tentativas de comunicação'],
  0
),
(
  'motor',
  12, 18,
  'A criança consegue andar sozinha pelo menos alguns passos?',
  1,
  'Excelente! O desenvolvimento motor está progredindo muito bem!',
  'Não há problema, alguns bebês demoram um pouco mais para andar.',
  'Observe se a criança já consegue se apoiar em móveis para ficar de pé.',
  ARRAY['Incentive a criança a andar descalça', 'Crie obstáculos seguros para ela contornar', 'Brinque de perseguir'],
  ARRAY['Deixe a criança brincar no chão mais tempo', 'Ajude-a a se apoiar em móveis', 'Use brinquedos que incentivem o movimento'],
  ARRAY['Veja se ela consegue ficar de pé sozinha', 'Observe se ela se desloca segurando móveis', 'Note se ela tenta dar passos com apoio'],
  0
);

-- Função para calcular progresso da sessão
CREATE OR REPLACE FUNCTION public.update_journey_session_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.journey_bot_sessions 
  SET 
    answered_questions = (
      SELECT COUNT(*) 
      FROM public.journey_bot_responses 
      WHERE session_id = NEW.session_id
    ),
    updated_at = now()
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar progresso automaticamente
CREATE TRIGGER trigger_update_journey_progress
  AFTER INSERT ON public.journey_bot_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journey_session_progress();
