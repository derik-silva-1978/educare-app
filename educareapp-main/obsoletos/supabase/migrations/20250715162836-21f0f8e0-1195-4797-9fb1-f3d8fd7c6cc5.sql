-- Fase 1: Padronizar Cálculo de Progresso e Corrigir Funções de Segurança

-- 1. Corrigir função handle_new_user com security definer adequado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    user_role text;
    user_first_name text;
    user_last_name text;
    user_name text;
BEGIN
    -- Extract metadata safely with defaults
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'parent');
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', '');
    
    -- If name is provided but first_name/last_name are not, split the name
    IF user_name != '' AND user_first_name = '' AND user_last_name = '' THEN
        user_first_name := split_part(user_name, ' ', 1);
        user_last_name := CASE 
            WHEN array_length(string_to_array(user_name, ' '), 1) > 1 
            THEN substring(user_name from length(split_part(user_name, ' ', 1)) + 2)
            ELSE ''
        END;
    END IF;
    
    -- Ensure we have at least a first name
    IF user_first_name = '' THEN
        user_first_name := split_part(NEW.email, '@', 1);
    END IF;
    
    -- Validate and cast role
    IF user_role NOT IN ('admin', 'teacher', 'therapist', 'coordinator', 'parent', 'student', 'guest', 'specialist', 'psychologist', 'professional', 'manager') THEN
        user_role := 'parent';
    END IF;
    
    -- Insert into profiles table
    INSERT INTO public.educare_profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        user_first_name,
        user_last_name,
        user_role::app_role
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 2. Criar função para cálculo padronizado de progresso
CREATE OR REPLACE FUNCTION public.calculate_child_progress(p_child_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    child_age_months INTEGER;
    total_questions INTEGER := 0;
    answered_questions INTEGER := 0;
    progress_percentage NUMERIC := 0;
    dimension_progress JSON := '{}';
    result JSON;
BEGIN
    -- Obter idade da criança em meses
    SELECT age INTO child_age_months 
    FROM educare_children 
    WHERE id = p_child_id;
    
    IF child_age_months IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Child not found'
        );
    END IF;
    
    -- Contar total de perguntas para a idade da criança
    SELECT COUNT(*) INTO total_questions
    FROM journey_bot_questions 
    WHERE active = true 
    AND age_min_months <= child_age_months 
    AND age_max_months >= child_age_months;
    
    -- Contar respostas da criança
    SELECT COUNT(DISTINCT jbr.question_id) INTO answered_questions
    FROM journey_bot_responses jbr
    JOIN journey_bot_questions jbq ON jbr.question_id = jbq.id
    WHERE jbr.child_id = p_child_id
    AND jbq.active = true
    AND jbq.age_min_months <= child_age_months 
    AND jbq.age_max_months >= child_age_months;
    
    -- Calcular progresso garantindo que não exceda 100%
    IF total_questions > 0 THEN
        progress_percentage := LEAST(100.0, (answered_questions::NUMERIC / total_questions::NUMERIC * 100.0));
    END IF;
    
    -- Calcular progresso por dimensão
    SELECT json_object_agg(
        dimension,
        json_build_object(
            'answered', dimension_answered,
            'total', dimension_total,
            'percentage', LEAST(100.0, CASE WHEN dimension_total > 0 THEN (dimension_answered::NUMERIC / dimension_total::NUMERIC * 100.0) ELSE 0 END)
        )
    ) INTO dimension_progress
    FROM (
        SELECT 
            jbq.dimension,
            COUNT(DISTINCT jbq.id) as dimension_total,
            COUNT(DISTINCT jbr.question_id) as dimension_answered
        FROM journey_bot_questions jbq
        LEFT JOIN journey_bot_responses jbr ON jbq.id = jbr.question_id AND jbr.child_id = p_child_id
        WHERE jbq.active = true 
        AND jbq.age_min_months <= child_age_months 
        AND jbq.age_max_months >= child_age_months
        GROUP BY jbq.dimension
    ) dim_stats;
    
    -- Atualizar progresso na tabela de crianças
    UPDATE educare_children 
    SET journey_progress = ROUND(progress_percentage)::INTEGER,
        updated_at = now()
    WHERE id = p_child_id;
    
    result := json_build_object(
        'success', true,
        'child_id', p_child_id,
        'total_questions', total_questions,
        'answered_questions', answered_questions,
        'overall_progress', progress_percentage,
        'dimension_progress', dimension_progress,
        'child_age_months', child_age_months
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 3. Criar função para atualizar progresso de múltiplas crianças
CREATE OR REPLACE FUNCTION public.update_all_children_progress()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    child_record RECORD;
    update_count INTEGER := 0;
    error_count INTEGER := 0;
    result JSON;
BEGIN
    -- Iterar sobre todas as crianças
    FOR child_record IN 
        SELECT id FROM educare_children
    LOOP
        BEGIN
            -- Calcular progresso para cada criança
            PERFORM public.calculate_child_progress(child_record.id);
            update_count := update_count + 1;
        EXCEPTION
            WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error updating progress for child %: %', child_record.id, SQLERRM;
        END;
    END LOOP;
    
    result := json_build_object(
        'success', true,
        'updated_children', update_count,
        'errors', error_count
    );
    
    RETURN result;
END;
$$;

-- 4. Adicionar constraint para garantir que progresso não exceda 100%
ALTER TABLE educare_children 
ADD CONSTRAINT check_journey_progress_valid 
CHECK (journey_progress >= 0 AND journey_progress <= 100);