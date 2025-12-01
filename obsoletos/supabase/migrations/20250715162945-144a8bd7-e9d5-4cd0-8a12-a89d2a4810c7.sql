-- Fase 2: Melhorar Performance e Criar Índices

-- 1. Criar índices compostos para otimizar queries
CREATE INDEX IF NOT EXISTS idx_journey_bot_questions_age_active 
ON journey_bot_questions(age_min_months, age_max_months, active, dimension) 
WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_journey_bot_responses_child_question 
ON journey_bot_responses(child_id, question_id, created_at);

CREATE INDEX IF NOT EXISTS idx_journey_bot_sessions_child_status 
ON journey_bot_sessions(child_id, status, updated_at);

CREATE INDEX IF NOT EXISTS idx_educare_children_user_progress 
ON educare_children(user_id, journey_progress, updated_at);

-- 2. Criar trigger para atualizar progresso automaticamente quando resposta é inserida
CREATE OR REPLACE FUNCTION public.update_child_progress_on_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Atualizar progresso da criança quando nova resposta é inserida
    PERFORM public.calculate_child_progress(NEW.child_id);
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block the insert
        RAISE WARNING 'Error updating child progress: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Criar trigger que executa após inserir resposta
DROP TRIGGER IF EXISTS trigger_update_progress_on_response ON journey_bot_responses;
CREATE TRIGGER trigger_update_progress_on_response
    AFTER INSERT ON journey_bot_responses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_child_progress_on_response();

-- 3. Criar função para sincronizar dados existentes
CREATE OR REPLACE FUNCTION public.sync_existing_progress_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    result JSON;
    session_record RECORD;
    progress_result JSON;
    updated_sessions INTEGER := 0;
BEGIN
    -- Atualizar todas as sessões com contagem correta de perguntas respondidas
    FOR session_record IN 
        SELECT DISTINCT s.id, s.child_id, s.user_id
        FROM journey_bot_sessions s
        WHERE s.status = 'active'
    LOOP
        -- Contar respostas para esta sessão
        UPDATE journey_bot_sessions 
        SET answered_questions = (
            SELECT COUNT(*)
            FROM journey_bot_responses r
            WHERE r.session_id = session_record.id
        ),
        updated_at = now()
        WHERE id = session_record.id;
        
        updated_sessions := updated_sessions + 1;
    END LOOP;
    
    -- Executar função de atualização de progresso para todas as crianças
    SELECT public.update_all_children_progress() INTO progress_result;
    
    result := json_build_object(
        'success', true,
        'updated_sessions', updated_sessions,
        'progress_update', progress_result
    );
    
    RETURN result;
END;
$$;

-- 4. Melhorar as funções RLS existentes com security definer
CREATE OR REPLACE FUNCTION public.is_group_admin(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_whatsapp_groups 
    WHERE id = group_id AND admin_user_id = user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_participant(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_group_participants 
    WHERE group_id = $1 AND user_id = $2 AND is_active = true
  );
$$;