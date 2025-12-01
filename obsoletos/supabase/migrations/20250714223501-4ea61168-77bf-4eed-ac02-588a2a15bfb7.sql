-- Fase 1: Correção Crítica das Políticas RLS
-- Corrigir recursão infinita na tabela team_whatsapp_groups

-- 1. Criar função security definer para verificar se usuário é admin do grupo
CREATE OR REPLACE FUNCTION public.is_group_admin(group_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_whatsapp_groups 
    WHERE id = group_id AND admin_user_id = user_id
  );
$$;

-- 2. Criar função para verificar se usuário é participante ativo
CREATE OR REPLACE FUNCTION public.is_group_participant(group_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = $1 AND user_id = $2 AND is_active = true
  );
$$;

-- 3. Remover políticas problemáticas existentes
DROP POLICY IF EXISTS "Participantes podem ver grupos onde estão" ON public.team_whatsapp_groups;
DROP POLICY IF EXISTS "Participantes podem se ver" ON public.team_group_participants;

-- 4. Criar nova política para team_whatsapp_groups sem recursão
CREATE POLICY "Participantes podem ver grupos onde estão"
ON public.team_whatsapp_groups
FOR SELECT
USING (
  admin_user_id = auth.uid() OR
  public.is_group_participant(id, auth.uid())
);

-- 5. Corrigir política de team_group_participants removendo auto-referência
CREATE POLICY "Participantes podem se ver"
ON public.team_group_participants
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.is_group_admin(group_id, auth.uid()) OR
  public.is_group_participant(group_id, auth.uid())
);