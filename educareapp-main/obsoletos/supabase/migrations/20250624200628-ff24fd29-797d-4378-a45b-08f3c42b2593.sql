
-- Insert sample journey bot questions for different age groups and dimensions
INSERT INTO journey_bot_questions (
  question_text, 
  dimension, 
  age_min_months, 
  age_max_months, 
  order_index,
  feedback_yes,
  feedback_no,
  feedback_unknown,
  tips_yes,
  tips_no,
  tips_unknown,
  concern_level,
  active
) VALUES 
-- Motor development questions (0-6 months)
(
  'A criança consegue sustentar a cabeça quando está de bruços?',
  'motor',
  2,
  6,
  1,
  'Que ótimo! Sustentar a cabeça é um marco importante do desenvolvimento motor. Continue estimulando com atividades de bruços.',
  'Não se preocupe, cada criança tem seu próprio ritmo. Vamos trabalhar para fortalecer os músculos do pescoço.',
  'É importante observar esse marco. Tente colocar a criança de bruços por alguns minutos várias vezes ao dia.',
  ARRAY['Continue com o tempo de bruços supervisionado', 'Use brinquedos coloridos para encorajar o levantamento da cabeça', 'Converse com a criança durante o tempo de bruços'],
  ARRAY['Aumente gradualmente o tempo de bruços', 'Consulte o pediatra se houver preocupações', 'Exercite os músculos do pescoço com movimentos suaves'],
  ARRAY['Observe por algumas semanas', 'Registre o progresso diariamente', 'Converse com o pediatra na próxima consulta'],
  2,
  true
),
(
  'A criança consegue rolar da barriga para as costas?',
  'motor',
  3,
  8,
  2,
  'Excelente! Rolar é um grande marco motor. A criança está desenvolvendo bem a coordenação.',
  'Ainda não é hora de se preocupar. Vamos estimular esse movimento com brincadeiras.',
  'Continue observando e estimulando. Alguns bebês levam mais tempo para desenvolver essa habilidade.',
  ARRAY['Celebre cada tentativa de rolar', 'Coloque brinquedos ao lado para encorajar o movimento', 'Continue o tempo de bruços'],
  ARRAY['Ajude com movimentos suaves', 'Use brinquedos para motivar o movimento', 'Pratique em superfície firme e segura'],
  ARRAY['Observe por mais algumas semanas', 'Documente tentativas de movimento', 'Mantenha estímulos regulares'],
  1,
  true
),

-- Language development questions (0-12 months)
(
  'A criança reage aos sons e vozes familiares?',
  'language',
  0,
  3,
  1,
  'Maravilhoso! A reação aos sons é fundamental para o desenvolvimento da linguagem.',
  'Vamos trabalhar a estimulação auditiva. É importante expor a criança a diferentes sons.',
  'Continue observando as reações. Cada criança responde de forma diferente aos estímulos.',
  ARRAY['Continue falando e cantando para a criança', 'Use diferentes tons de voz', 'Leia historinhas em voz alta'],
  ARRAY['Aumente a exposição a sons variados', 'Fale mais próximo à criança', 'Use músicas suaves'],
  ARRAY['Observe reações por mais tempo', 'Teste com sons diferentes', 'Anote qualquer resposta'],
  2,
  true
),
(
  'A criança produz sons como "aaah" ou "oooh"?',
  'language',
  2,
  6,
  2,
  'Que alegria! Esses primeiros sons são os alicerces da fala. Continue estimulando!',
  'Não se preocupe, vamos trabalhar juntos para estimular a vocalização.',
  'Continue observando e estimulando. Alguns bebês são mais quietos no início.',
  ARRAY['Imite os sons que a criança faz', 'Converse como se ela entendesse tudo', 'Use expressões faciais animadas'],
  ARRAY['Fale mais com a criança', 'Cante canções simples', 'Faça sons divertidos para imitar'],
  ARRAY['Dê tempo para a criança responder', 'Continue tentativas por algumas semanas', 'Observe em momentos calmos'],
  1,
  true
),

-- Social development questions (0-6 months)
(
  'A criança sorri em resposta ao sorriso de outras pessoas?',
  'social',
  1,
  4,
  1,
  'Que lindo! O sorriso social é um marco maravilhoso do desenvolvimento emocional.',
  'Vamos trabalhar para estimular mais interações sociais positivas.',
  'Continue observando em diferentes momentos do dia. Alguns bebês são mais sociais em certas horas.',
  ARRAY['Continue sorrindo e fazendo caretas alegres', 'Brinque de "achou!" (peekaboo)', 'Use espelhos para autoconhecimento'],
  ARRAY['Passe mais tempo face a face', 'Use expressões exageradas', 'Seja paciente e persistente'],
  ARRAY['Observe em momentos quando a criança está alerta', 'Tente em diferentes horários', 'Registre qualquer resposta social'],
  2,
  true
),

-- Sensory development questions (0-6 months)
(
  'A criança acompanha objetos com os olhos?',
  'sensory',
  1,
  4,
  1,
  'Perfeito! O acompanhamento visual é essencial para o desenvolvimento sensorial.',
  'Vamos trabalhar a estimulação visual com objetos interessantes.',
  'Continue testando com diferentes objetos e distâncias.',
  ARRAY['Use objetos coloridos e contrastantes', 'Mova objetos lentamente', 'Varie a distância dos objetos'],
  ARRAY['Use cores mais vibrantes', 'Aproxime mais os objetos', 'Teste em boa iluminação'],
  ARRAY['Observe em diferentes condições de luz', 'Use objetos com movimento', 'Teste a distâncias variadas'],
  2,
  true
),

-- Questions for older children (6-12 months)
(
  'A criança consegue sentar sem apoio?',
  'motor',
  6,
  10,
  3,
  'Excelente! Sentar sem apoio é um grande marco do desenvolvimento motor.',
  'Não se preocupe, vamos fortalecer os músculos necessários para sentar.',
  'Continue observando e oferecendo oportunidades para praticar.',
  ARRAY['Ofereça brinquedos na posição sentada', 'Use almofadas para apoio gradual', 'Celebre cada tentativa'],
  ARRAY['Pratique posição sentada com apoio', 'Fortaleça músculos do core', 'Use superfícies macias para segurança'],
  ARRAY['Continue oferecendo oportunidades', 'Observe o progresso semanalmente', 'Mantenha ambiente seguro'],
  1,
  true
),

(
  'A criança balbucia combinações como "mama" ou "papa"?',
  'language',
  6,
  12,
  3,
  'Que maravilha! O balbucio é o precursor das primeiras palavras.',
  'Vamos estimular mais a vocalização e o balbucio.',
  'Continue observando e estimulando. Cada criança tem seu ritmo.',
  ARRAY['Repita os sons que a criança faz', 'Nomeie objetos e pessoas', 'Leia livros diariamente'],
  ARRAY['Fale mais durante atividades diárias', 'Use músicas e canções', 'Responda a qualquer vocalização'],
  ARRAY['Continue estímulos por algumas semanas', 'Observe em diferentes situações', 'Registre progressos'],
  1,
  true
);
