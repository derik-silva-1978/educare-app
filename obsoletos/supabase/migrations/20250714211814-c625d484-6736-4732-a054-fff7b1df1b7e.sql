-- Corrigir política RLS crítica na tabela team_whatsapp_groups
-- A política "Participantes podem ver grupos onde estão" tem erro na referência

DROP POLICY IF EXISTS "Participantes podem ver grupos onde estão" ON public.team_whatsapp_groups;

CREATE POLICY "Participantes podem ver grupos onde estão"
ON public.team_whatsapp_groups
FOR SELECT
USING (
  admin_user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.team_group_participants 
    WHERE group_id = team_whatsapp_groups.id 
    AND user_id = auth.uid() 
    AND is_active = true
  )
);