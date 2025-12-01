
-- First, let's add the new domains to the enum type
ALTER TYPE quiz_domain ADD VALUE IF NOT EXISTS 'cognitive';
ALTER TYPE quiz_domain ADD VALUE IF NOT EXISTS 'communication';
ALTER TYPE quiz_domain ADD VALUE IF NOT EXISTS 'social_emotional';
ALTER TYPE quiz_domain ADD VALUE IF NOT EXISTS 'self_care';
ALTER TYPE quiz_domain ADD VALUE IF NOT EXISTS 'maternal_health';

-- Add week-based fields to journey_bot_questions
ALTER TABLE journey_bot_questions 
ADD COLUMN IF NOT EXISTS age_min_weeks INTEGER,
ADD COLUMN IF NOT EXISTS age_max_weeks INTEGER;

-- Create index for better performance on week-based queries
CREATE INDEX IF NOT EXISTS idx_journey_bot_questions_weeks 
ON journey_bot_questions(age_min_weeks, age_max_weeks, dimension);

-- Insert comprehensive weekly questions for 0-6 months (26 weeks)
-- MOTOR DOMAIN - Weekly questions for 0-6 months
INSERT INTO journey_bot_questions (
  dimension, age_min_weeks, age_max_weeks, age_min_months, age_max_months,
  question_text, order_index, feedback_yes, feedback_no, feedback_unknown,
  tips_yes, tips_no, tips_unknown, concern_level
) VALUES 
-- Week 1-2: Basic reflexes
('motor', 1, 2, 0, 1, 'O bebê apresenta reflexos de sucção quando algo toca seus lábios?', 1,
'Excelente! Os reflexos de sucção são fundamentais para a alimentação e desenvolvimento.',
'É importante observar este reflexo. Vamos estimular suavemente.',
'Continue observando durante as mamadas e momentos de contato.',
ARRAY['Continue amamentando regularmente', 'Observe durante as mamadas', 'Toque suavemente os lábios do bebê'],
ARRAY['Consulte o pediatra sobre reflexos', 'Estimule suavemente os lábios', 'Observe durante tentativas de alimentação'],
ARRAY['Teste durante a hora da alimentação', 'Observe por alguns dias', 'Anote suas observações'],
2),

-- Week 3-4: Head control beginning
('motor', 3, 4, 0, 1, 'O bebê consegue levantar a cabeça por alguns segundos quando está de bruços?', 2,
'Maravilhoso! O controle da cabeça está se desenvolvendo bem.',
'Ainda é cedo, mas vamos começar a fortalecer os músculos do pescoço.',
'Continue observando e estimulando com tempo de bruços supervisionado.',
ARRAY['Continue o tempo de bruços diário', 'Use brinquedos coloridos para motivar', 'Celebre cada tentativa'],
ARRAY['Aumente gradualmente o tempo de bruços', 'Apoie suavemente sob o peito', 'Faça por períodos curtos'],
ARRAY['Tente por alguns minutos por dia', 'Observe a força do pescoço', 'Seja paciente com o desenvolvimento'],
1),

-- COGNITIVE DOMAIN
('cognitive', 1, 4, 0, 1, 'O bebê segue objetos com os olhos quando movidos lentamente?', 1,
'Perfeito! O desenvolvimento visual e cognitivo está progredindo.',
'Vamos estimular mais o acompanhamento visual.',
'Continue testando com objetos contrastantes.',
ARRAY['Use objetos coloridos e contrastantes', 'Mova lentamente objetos na frente do bebê', 'Converse durante o estímulo'],
ARRAY['Use cores mais vibrantes', 'Aproxime mais os objetos', 'Teste em boa iluminação'],
ARRAY['Use objetos com movimento', 'Teste em momentos de alerta', 'Varie as distâncias'],
1),

-- LANGUAGE DOMAIN
('language', 2, 6, 0, 2, 'O bebê produz sons diferentes de choro (como "ah", "eh")?', 1,
'Que alegria! Os primeiros sons são os alicerces da comunicação.',
'Vamos estimular mais a vocalização do bebê.',
'Continue conversando e estimulando.',
ARRAY['Converse bastante com o bebê', 'Imite os sons que ele faz', 'Cante canções suaves'],
ARRAY['Fale mais próximo ao bebê', 'Use diferentes tons de voz', 'Responda a qualquer som'],
ARRAY['Continue conversando regularmente', 'Observe em momentos calmos', 'Seja paciente'],
1),

-- SOCIAL DOMAIN
('social', 4, 8, 1, 2, 'O bebê sorri em resposta ao seu sorriso?', 1,
'Lindo! O sorriso social é um marco maravilhoso do desenvolvimento.',
'Vamos trabalhar mais interações sociais positivas.',
'Continue sorrindo e interagindo.',
ARRAY['Sorria frequentemente para o bebê', 'Faça caretas engraçadas', 'Brinque de "achou!"'],
ARRAY['Passe mais tempo face a face', 'Use expressões exageradas', 'Seja persistente e paciente'],
ARRAY['Tente em diferentes momentos', 'Observe quando está alerta', 'Continue interagindo'],
2),

-- SENSORY DOMAIN
('sensory', 1, 8, 0, 2, 'O bebê reage a sons altos ou súbitos?', 1,
'Ótimo! A audição está se desenvolvendo normalmente.',
'Vamos observar melhor as reações auditivas.',
'Continue testando com sons diferentes.',
ARRAY['Converse em tons variados', 'Use música suave', 'Observe reações a diferentes sons'],
ARRAY['Teste com sons mais próximos', 'Use sons suaves primeiro', 'Observe em ambiente silencioso'],
ARRAY['Teste em momentos calmos', 'Varie tipos de sons', 'Anote qualquer reação'],
2),

-- COMMUNICATION DOMAIN
('communication', 6, 12, 1, 3, 'O bebê faz contato visual durante a alimentação ou interações?', 1,
'Excelente! O contato visual é fundamental para a comunicação.',
'Vamos estimular mais o contato visual.',
'Continue interagindo face a face.',
ARRAY['Mantenha contato visual durante mamadas', 'Converse olhando nos olhos', 'Sorria durante interações'],
ARRAY['Posicione-se na linha de visão', 'Use expressões faciais variadas', 'Seja paciente'],
ARRAY['Observe durante diferentes atividades', 'Tente em momentos alertas', 'Continue tentando'],
1),

-- EMOTIONAL DOMAIN
('emotional', 8, 16, 2, 4, 'O bebê se acalma quando você o pega no colo?', 1,
'Maravilhoso! O vínculo emocional está se fortalecendo.',
'Vamos continuar construindo este vínculo.',
'Continue oferecendo conforto.',
ARRAY['Continue pegando no colo quando necessário', 'Fale com voz suave', 'Ofereça contato pele a pele'],
ARRAY['Experimente diferentes posições', 'Use movimentos suaves', 'Cante baixinho'],
ARRAY['Teste diferentes técnicas de consolo', 'Observe o que funciona melhor', 'Seja consistente'],
1),

-- SOCIAL_EMOTIONAL DOMAIN
('social_emotional', 12, 20, 3, 5, 'O bebê demonstra preferência por rostos conhecidos?', 1,
'Perfeito! O reconhecimento social está se desenvolvendo.',
'Continue fortalecendo vínculos familiares.',
'Observe as reações a pessoas diferentes.',
ARRAY['Passe tempo de qualidade face a face', 'Deixe familiares interagirem', 'Mantenha rotinas consistentes'],
ARRAY['Apresente pessoas novas gradualmente', 'Mantenha-se presente durante interações', 'Seja paciente'],
ARRAY['Observe reações a diferentes pessoas', 'Note diferenças de comportamento', 'Continue expondo gradualmente'],
1),

-- SELF_CARE DOMAIN
('self_care', 16, 24, 4, 6, 'O bebê consegue segurar a mamadeira ou ajuda durante a alimentação?', 1,
'Ótimo! A independência na alimentação está começando.',
'Vamos estimular mais a participação na alimentação.',
'Continue oferecendo oportunidades.',
ARRAY['Deixe o bebê tocar na mamadeira', 'Guie as mãozinhas para segurar', 'Elogie tentativas'],
ARRAY['Coloque as mãos do bebê na mamadeira', 'Use mamadeiras mais leves', 'Tenha paciência'],
ARRAY['Continue oferecendo oportunidades', 'Observe tentativas', 'Seja consistente'],
1),

-- MATERNAL_HEALTH DOMAIN
('maternal_health', 1, 8, 0, 2, 'Você está conseguindo descansar adequadamente entre as mamadas?', 1,
'Que bom! O descanso materno é fundamental para todos.',
'É importante priorizar seu bem-estar também.',
'Continue buscando momentos de descanso.',
ARRAY['Continue priorizando o descanso', 'Aceite ajuda quando oferecida', 'Descanse quando o bebê dorme'],
ARRAY['Peça ajuda aos familiares', 'Organize turnos para cuidados', 'Descanse sempre que possível'],
ARRAY['Monitore seus níveis de energia', 'Busque apoio quando necessário', 'Não hesite em pedir ajuda'],
2);
