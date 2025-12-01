-- Script para popular quizzes das semanas 9 e 10
-- Baseado nos dados do TitiNauta 2.0

-- Primeiro, precisamos criar as semanas na tabela journey_v2_weeks se não existirem
-- Semana 9 (2-3 meses)
INSERT INTO journey_v2_weeks (id, journey_id, week_number, title, description, min_age_months, max_age_months, created_at, updated_at)
VALUES 
  (
    'week-9-uuid-2-3-months',
    'journey-2-3-months-uuid',
    9,
    'Semana 9 - Risadas e Mais Força! 😄💪',
    'Terceiro mês chegando: mais risos, força e controle do corpo',
    2,
    3,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Semana 10 (2-3 meses)
INSERT INTO journey_v2_weeks (id, journey_id, week_number, title, description, min_age_months, max_age_months, created_at, updated_at)
VALUES 
  (
    'week-10-uuid-2-3-months',
    'journey-2-3-months-uuid',
    10,
    'Semana 10 - Buscando e Pegando! 🤏✨',
    'Coordenação melhor: tentando pegar tudo que vê',
    2,
    3,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Quiz da Semana 9
INSERT INTO journey_v2_quizzes (id, week_id, domain, domain_id, title, question, options, feedback, knowledge, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'week-9-uuid-2-3-months',
    'baby_domains',
    'motor',
    'Quiz da Semana 9',
    'Qual a posição mais segura para colocar o bebê de bruços para fortalecer o pescoço?',
    '[
      {"id": "a", "text": "Em superfície macia como travesseiro"},
      {"id": "b", "text": "Em superfície firme e plana, sempre supervisionado"},
      {"id": "c", "text": "Não precisa colocar de bruços"}
    ]'::jsonb,
    '{
      "a": "❌ Incorreto. Superfícies macias podem dificultar a respiração e não são seguras.",
      "b": "✅ Correto! Superfície firme e plana com supervisão é o ideal para fortalecer o pescoço.",
      "c": "❌ Incorreto. Colocar de bruços é importante para o desenvolvimento motor."
    }'::jsonb,
    '{
      "correct_answer": "b",
      "explanation": "Colocar o bebê de bruços em superfície firme, sempre supervisionado, ajuda a fortalecer os músculos do pescoço e das costas, preparando-o para rolar e engatinhar."
    }'::jsonb,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'week-9-uuid-2-3-months',
    'baby_domains',
    'communication',
    'Quiz da Semana 9',
    'Como estimular o bebê a fazer mais sons e risadas?',
    '[
      {"id": "a", "text": "Deixar ele sozinho para se expressar"},
      {"id": "b", "text": "Fazer caretas, sons engraçados e imitar os sons que ele faz"},
      {"id": "c", "text": "Colocar vídeos e músicas"}
    ]'::jsonb,
    '{
      "a": "❌ Incorreto. O bebê precisa de interação para desenvolver a comunicação.",
      "b": "✅ Correto! Interagir, fazer caretas e imitar os sons estimula a comunicação e fortalece o vínculo.",
      "c": "⚠️ Parcialmente correto. Músicas ajudam, mas a interação direta é mais importante nessa idade."
    }'::jsonb,
    '{
      "correct_answer": "b",
      "explanation": "A interação face a face é fundamental para o desenvolvimento da comunicação. Quando você imita os sons do bebê e responde às suas vocalizações, está ensinando como funciona uma conversa."
    }'::jsonb,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'week-9-uuid-2-3-months',
    'baby_domains',
    'sensory',
    'Quiz da Semana 9',
    'Por que o bebê leva tudo à boca nessa fase?',
    '[
      {"id": "a", "text": "Porque está com fome"},
      {"id": "b", "text": "É a forma dele explorar texturas, sabores e formas"},
      {"id": "c", "text": "É um mau hábito que deve ser evitado"}
    ]'::jsonb,
    '{
      "a": "❌ Incorreto. Não é fome, é exploração sensorial.",
      "b": "✅ Correto! A boca é uma das principais formas do bebê conhecer o mundo nessa idade.",
      "c": "❌ Incorreto. É um comportamento normal e importante para o desenvolvimento."
    }'::jsonb,
    '{
      "correct_answer": "b",
      "explanation": "Levar objetos à boca é uma fase normal e importante do desenvolvimento sensorial. A boca tem muitas terminações nervosas, tornando-a ideal para explorar texturas, temperaturas e formas. Apenas certifique-se de que os objetos são seguros e limpos."
    }'::jsonb,
    NOW(),
    NOW()
  );

-- Quiz da Semana 10
INSERT INTO journey_v2_quizzes (id, week_id, domain, domain_id, title, question, options, feedback, knowledge, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'week-10-uuid-2-3-months',
    'baby_domains',
    'motor',
    'Quiz da Semana 10',
    'O que fazer para estimular o bebê a se apoiar nos antebraços quando está de bruços?',
    '[
      {"id": "a", "text": "Forçar ele a levantar a cabeça"},
      {"id": "b", "text": "Colocar brinquedos interessantes na frente dele e conversar"},
      {"id": "c", "text": "Deixar ele sempre deitado de costas"}
    ]'::jsonb,
    '{
      "a": "❌ Incorreto. Nunca force movimentos. Deixe o bebê desenvolver naturalmente.",
      "b": "✅ Correto! Motivar com brinquedos e interação estimula ele a se apoiar naturalmente.",
      "c": "❌ Incorreto. É importante variar as posições, incluindo tempo de bruços."
    }'::jsonb,
    '{
      "correct_answer": "b",
      "explanation": "Colocar brinquedos coloridos ou objetos interessantes na frente do bebê, junto com sua presença e voz, motiva ele a levantar a cabeça e se apoiar nos antebraços. Isso fortalece os músculos de forma natural e divertida."
    }'::jsonb,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'week-10-uuid-2-3-months',
    'baby_domains',
    'cognitive',
    'Quiz da Semana 10',
    'Como saber se o bebê está desenvolvendo bem a coordenação olho-mão?',
    '[
      {"id": "a", "text": "Ele consegue segurar objetos por mais tempo e os examina"},
      {"id": "b", "text": "Ele nunca solta os objetos"},
      {"id": "c", "text": "Ele só olha mas não tenta pegar"}
    ]'::jsonb,
    '{
      "a": "✅ Correto! Segurar e examinar objetos mostra desenvolvimento da coordenação olho-mão.",
      "b": "❌ Incorreto. É normal soltar objetos. O importante é tentar pegar e explorar.",
      "c": "⚠️ Atenção. Se ele nunca tentar pegar, vale estimular mais ou conversar com o pediatra."
    }'::jsonb,
    '{
      "correct_answer": "a",
      "explanation": "Quando o bebê consegue segurar objetos por períodos cada vez maiores e os examina (olhando, virando, levando à boca), isso mostra que a coordenação entre o que ele vê e o que faz com as mãos está se desenvolvendo bem."
    }'::jsonb,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'week-10-uuid-2-3-months',
    'baby_domains',
    'social_emotional',
    'Quiz da Semana 10',
    'É normal o bebê mostrar preferência por pessoas familiares nessa idade?',
    '[
      {"id": "a", "text": "Não, ele deve gostar de todo mundo igual"},
      {"id": "b", "text": "Sim, é sinal de que está criando vínculos afetivos"},
      {"id": "c", "text": "Só se for muito mimado"}
    ]'::jsonb,
    '{
      "a": "❌ Incorreto. Ter preferências é normal e saudável.",
      "b": "✅ Correto! Mostrar preferência por pessoas familiares é um sinal positivo de desenvolvimento emocional.",
      "c": "❌ Incorreto. Não tem relação com ser mimado, é desenvolvimento normal."
    }'::jsonb,
    '{
      "correct_answer": "b",
      "explanation": "Mostrar preferência por pessoas familiares (pais, cuidadores principais) é um marco importante do desenvolvimento social e emocional. Isso mostra que o bebê está criando vínculos afetivos seguros e reconhecendo quem cuida dele."
    }'::jsonb,
    NOW(),
    NOW()
  );

-- Verificar quantos quizzes foram inseridos
SELECT 
  w.week_number,
  w.title as week_title,
  COUNT(q.id) as quiz_count
FROM journey_v2_weeks w
LEFT JOIN journey_v2_quizzes q ON q.week_id = w.id
WHERE w.week_number IN (9, 10)
GROUP BY w.week_number, w.title
ORDER BY w.week_number;
