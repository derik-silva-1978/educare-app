-- Criar tabelas para sistema de comunicação WhatsApp com equipe terapêutica

-- Tabela para grupos WhatsApp da equipe terapêutica
CREATE TABLE public.team_whatsapp_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  admin_user_id UUID NOT NULL,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para participantes do grupo WhatsApp
CREATE TABLE public.team_group_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.team_whatsapp_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Tabela para mensagens do grupo
CREATE TABLE public.team_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.team_whatsapp_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'parent', -- 'parent', 'professional', 'ai_assistant'
  message_content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'file', 'image', 'ai_summary'
  file_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_ai_processed BOOLEAN NOT NULL DEFAULT false
);

-- Tabela para resumos gerados pelo AI
CREATE TABLE public.team_ai_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.team_whatsapp_groups(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.educare_children(id) ON DELETE CASCADE,
  summary_content TEXT NOT NULL,
  insights TEXT[],
  recommendations TEXT[],
  key_topics TEXT[],
  sentiment_analysis JSONB,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  summary_type TEXT NOT NULL DEFAULT 'weekly' -- 'daily', 'weekly', 'monthly', 'on_demand'
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.team_whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_ai_summaries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para team_whatsapp_groups
CREATE POLICY "Pais podem criar grupos para suas crianças"
ON public.team_whatsapp_groups
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.educare_children 
    WHERE id = child_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Participantes podem ver grupos onde estão"
ON public.team_whatsapp_groups
FOR SELECT
USING (
  admin_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = id AND user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admins podem atualizar seus grupos"
ON public.team_whatsapp_groups
FOR UPDATE
USING (admin_user_id = auth.uid());

-- Políticas RLS para team_group_participants
CREATE POLICY "Admins podem gerenciar participantes"
ON public.team_group_participants
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.team_whatsapp_groups 
    WHERE id = group_id AND admin_user_id = auth.uid()
  )
);

CREATE POLICY "Participantes podem se ver"
ON public.team_group_participants
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_whatsapp_groups 
    WHERE id = group_id AND admin_user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.team_group_participants p2
    WHERE p2.group_id = group_id AND p2.user_id = auth.uid() AND p2.is_active = true
  )
);

-- Políticas RLS para team_group_messages
CREATE POLICY "Participantes podem inserir mensagens"
ON public.team_group_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = team_group_messages.group_id 
    AND user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Participantes podem ver mensagens do grupo"
ON public.team_group_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = team_group_messages.group_id 
    AND user_id = auth.uid() 
    AND is_active = true
  )
);

-- Políticas RLS para team_ai_summaries
CREATE POLICY "Participantes podem ver resumos do grupo"
ON public.team_ai_summaries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = team_ai_summaries.group_id 
    AND user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Sistema pode inserir resumos AI"
ON public.team_ai_summaries
FOR INSERT
WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX idx_team_groups_child_id ON public.team_whatsapp_groups(child_id);
CREATE INDEX idx_team_groups_admin ON public.team_whatsapp_groups(admin_user_id);
CREATE INDEX idx_team_participants_group ON public.team_group_participants(group_id);
CREATE INDEX idx_team_participants_user ON public.team_group_participants(user_id);
CREATE INDEX idx_team_messages_group ON public.team_group_messages(group_id);
CREATE INDEX idx_team_messages_sent_at ON public.team_group_messages(sent_at);
CREATE INDEX idx_team_summaries_group ON public.team_ai_summaries(group_id);
CREATE INDEX idx_team_summaries_period ON public.team_ai_summaries(period_start, period_end);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_team_groups_updated_at
BEFORE UPDATE ON public.team_whatsapp_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();