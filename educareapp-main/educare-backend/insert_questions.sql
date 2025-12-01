-- Inserir perguntas de exemplo para o Journey Bot
INSERT INTO journey_bot_questions (
  id, question_text, question_type, options, min_age_months, max_age_months, 
  category, order_index, is_active, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  'Como está o desenvolvimento motor do seu bebê? Ele consegue sustentar a cabeça?',
  'multiple_choice',
  '[{"value": "sim", "label": "Sim, sustenta bem a cabeça"}, {"value": "parcialmente", "label": "Sustenta parcialmente"}, {"value": "nao", "label": "Ainda não sustenta"}]',
  0, 6, 'motor', 1, true, NOW(), NOW()
),
(
  gen_random_uuid(),
  'O bebê reage a sons e vozes familiares?',
  'multiple_choice',
  '[{"value": "sim", "label": "Sim, reage bem"}, {"value": "as_vezes", "label": "Às vezes"}, {"value": "nao", "label": "Não reage"}]',
  0, 6, 'auditivo', 2, true, NOW(), NOW()
),
(
  gen_random_uuid(),
  'O bebê já consegue sentar sem apoio?',
  'multiple_choice',
  '[{"value": "sim", "label": "Sim, senta sem apoio"}, {"value": "com_apoio", "label": "Senta com apoio"}, {"value": "nao", "label": "Ainda não senta"}]',
  6, 12, 'motor', 1, true, NOW(), NOW()
),
(
  gen_random_uuid(),
  'A criança já caminha sozinha?',
  'multiple_choice',
  '[{"value": "sim", "label": "Sim, caminha sozinha"}, {"value": "com_apoio", "label": "Caminha com apoio"}, {"value": "engatinha", "label": "Ainda engatinha"}]',
  12, 24, 'motor', 1, true, NOW(), NOW()
);
