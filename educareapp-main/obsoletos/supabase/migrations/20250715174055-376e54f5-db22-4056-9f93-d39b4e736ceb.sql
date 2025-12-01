-- Criar nova função para cálculo de módulos individuais
CREATE OR REPLACE FUNCTION public.calculate_child_modules(p_child_id uuid, p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    child_age_months INTEGER;
    module_data JSON := '[]';
    completed_modules INTEGER := 0;
    total_modules INTEGER := 0;
    current_module JSON := null;
    next_module JSON := null;
    result JSON;
BEGIN
    -- Verificar se a criança pertence ao usuário
    SELECT age INTO child_age_months 
    FROM educare_children 
    WHERE id = p_child_id AND user_id = p_user_id;
    
    IF child_age_months IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Child not found or access denied'
        );
    END IF;
    
    -- Obter módulos únicos (faixas etárias não-sobrepostas) para a idade da criança
    WITH age_modules AS (
        SELECT DISTINCT 
            age_min_months,
            age_max_months,
            CONCAT(age_min_months, '-', age_max_months, ' meses') as module_name,
            CASE 
                WHEN age_max_months <= child_age_months THEN 'completed_age'
                WHEN age_min_months <= child_age_months AND age_max_months > child_age_months THEN 'current_age'
                ELSE 'future_age'
            END as age_status
        FROM journey_bot_questions 
        WHERE active = true 
        AND age_min_months <= child_age_months + 3  -- incluir próximos módulos
        ORDER BY age_min_months
    ),
    module_progress AS (
        SELECT 
            am.age_min_months,
            am.age_max_months,
            am.module_name,
            am.age_status,
            COUNT(DISTINCT jbq.id) as total_questions,
            COUNT(DISTINCT jbr.question_id) as answered_questions,
            CASE 
                WHEN COUNT(DISTINCT jbq.id) > 0 THEN 
                    ROUND((COUNT(DISTINCT jbr.question_id)::NUMERIC / COUNT(DISTINCT jbq.id)::NUMERIC * 100), 1)
                ELSE 0 
            END as completion_percentage,
            CASE 
                WHEN COUNT(DISTINCT jbq.id) > 0 AND COUNT(DISTINCT jbr.question_id) = COUNT(DISTINCT jbq.id) THEN true
                ELSE false
            END as is_completed
        FROM age_modules am
        LEFT JOIN journey_bot_questions jbq ON jbq.age_min_months = am.age_min_months 
            AND jbq.age_max_months = am.age_max_months 
            AND jbq.active = true
        LEFT JOIN journey_bot_responses jbr ON jbr.question_id = jbq.id 
            AND jbr.child_id = p_child_id
        GROUP BY am.age_min_months, am.age_max_months, am.module_name, am.age_status
        ORDER BY am.age_min_months
    )
    SELECT 
        json_agg(
            json_build_object(
                'age_min_months', age_min_months,
                'age_max_months', age_max_months,
                'module_name', module_name,
                'age_status', age_status,
                'total_questions', total_questions,
                'answered_questions', answered_questions,
                'completion_percentage', completion_percentage,
                'is_completed', is_completed
            ) ORDER BY age_min_months
        ),
        COUNT(*) FILTER (WHERE is_completed = true AND age_status = 'completed_age'),
        COUNT(*),
        json_agg(
            CASE WHEN age_status = 'current_age' THEN
                json_build_object(
                    'module_name', module_name,
                    'completion_percentage', completion_percentage,
                    'total_questions', total_questions,
                    'answered_questions', answered_questions
                )
            END
        ) FILTER (WHERE age_status = 'current_age'),
        json_agg(
            CASE WHEN age_status = 'future_age' THEN
                json_build_object(
                    'module_name', module_name,
                    'age_min_months', age_min_months,
                    'age_max_months', age_max_months
                )
            END
        ) FILTER (WHERE age_status = 'future_age')
    INTO module_data, completed_modules, total_modules, current_module, next_module
    FROM module_progress;
    
    -- Limpar nulls dos arrays JSON
    current_module := COALESCE((current_module::jsonb - 'null')::json, 'null');
    next_module := COALESCE((next_module::jsonb - 'null')::json, 'null');
    
    -- Pegar primeiro elemento se for array
    IF current_module != 'null' AND json_array_length(current_module) > 0 THEN
        current_module := current_module->0;
    ELSE
        current_module := 'null';
    END IF;
    
    IF next_module != 'null' AND json_array_length(next_module) > 0 THEN
        next_module := next_module->0;
    ELSE
        next_module := 'null';
    END IF;
    
    result := json_build_object(
        'success', true,
        'child_id', p_child_id,
        'child_age_months', child_age_months,
        'completed_modules', completed_modules,
        'total_modules', total_modules,
        'completion_percentage', CASE 
            WHEN total_modules > 0 THEN ROUND((completed_modules::NUMERIC / total_modules::NUMERIC * 100), 1)
            ELSE 0 
        END,
        'current_module', current_module,
        'next_module', next_module,
        'modules', module_data
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