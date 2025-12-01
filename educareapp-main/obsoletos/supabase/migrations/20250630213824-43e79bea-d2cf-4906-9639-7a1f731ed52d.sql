
-- First, let's add comprehensive sample questions for the Journey Bot
-- These questions cover different developmental domains and age ranges

-- Clear any existing test data first
DELETE FROM journey_bot_questions WHERE active = true;

-- Insert comprehensive questions for different age ranges and dimensions
INSERT INTO journey_bot_questions (
  dimension, age_min_months, age_max_months, question_text, order_index,
  feedback_yes, feedback_no, feedback_unknown,
  tips_yes, tips_no, tips_unknown, concern_level, active
) VALUES 

-- MOTOR GROSSO (0-6 months)
('motor_grosso', 0, 3, 'O bebê consegue sustentar a cabeça quando colocado de bruços?', 1,
'Excelente! O controle da cabeça é um marco importante do desenvolvimento motor.',
'Não se preocupe, cada bebê tem seu ritmo. Vamos trabalhar para fortalecer os músculos do pescoço.',
'Continue observando e estimulando com tempo de bruços supervisionado.',
ARRAY['Continue com tempo de bruços diário', 'Use brinquedos coloridos para encorajar', 'Converse durante os exercícios'],
ARRAY['Aumente gradualmente o tempo de bruços', 'Apoie suavemente sob o peito', 'Consulte o pediatra se necessário'],
ARRAY['Observe por algumas semanas', 'Tente por períodos curtos', 'Anote o progresso'],
2, true),

('motor_grosso', 3, 6, 'O bebê consegue rolar da barriga para as costas?', 2,
'Maravilhoso! Rolar é um grande marco do desenvolvimento motor.',
'Ainda não é hora de se preocupar. Vamos estimular esse movimento.',
'Continue observando e oferecendo estímulos.',
ARRAY['Coloque brinquedos ao lado para encorajar', 'Celebre cada tentativa', 'Continue o tempo de bruços'],
ARRAY['Ajude com movimentos suaves', 'Use brinquedos motivadores', 'Pratique em superfície segura'],
ARRAY['Observe tentativas de movimento', 'Documente progressos', 'Mantenha estímulos regulares'],
1, true),

-- MOTOR GROSSO (6-12 months)
('motor_grosso', 6, 9, 'A criança consegue sentar sem apoio por alguns segundos?', 3,
'Ótimo! Sentar sem apoio é um marco importante.',
'Vamos trabalhar para fortalecer os músculos necessários.',
'Continue oferecendo oportunidades para praticar.',
ARRAY['Ofereça brinquedos na posição sentada', 'Use almofadas para apoio gradual', 'Celebre tentativas'],
ARRAY['Pratique posição sentada com apoio', 'Fortaleça músculos do core', 'Use superfícies macias'],
ARRAY['Continue oferecendo oportunidades', 'Observe progresso semanal', 'Mantenha ambiente seguro'],
1, true),

('motor_grosso', 9, 12, 'A criança consegue engatinhar ou se arrastar?', 4,
'Excelente! A mobilidade está se desenvolvendo bem.',
'Não há problema, alguns bebês pular o engatinhar.',
'Continue estimulando o movimento.',
ARRAY['Crie obstáculos seguros para contornar', 'Coloque brinquedos longe para motivar', 'Elogie tentativas'],
ARRAY['Deixe mais tempo no chão', 'Use brinquedos que rolem', 'Demonstre movimentos'],
ARRAY['Observe tentativas de movimento', 'Varie posições de brinquedos', 'Seja paciente'],
1, true),

-- LINGUAGEM (0-6 months)
('linguagem', 0, 3, 'O bebê reage a sons e vozes familiares?', 1,
'Perfeito! A reação aos sons é fundamental para o desenvolvimento da linguagem.',
'Vamos trabalhar a estimulação auditiva com mais frequência.',
'Continue observando as reações em diferentes momentos.',
ARRAY['Continue falando e cantando', 'Use diferentes tons de voz', 'Leia histórias em voz alta'],
ARRAY['Aumente exposição a sons variados', 'Fale mais próximo ao bebê', 'Use músicas suaves'],
ARRAY['Observe reações por mais tempo', 'Teste com sons diferentes', 'Anote respostas'],
2, true),

('linguagem', 3, 6, 'O bebê produz sons como "ahhh" ou "ohhh"?', 2,
'Que alegria! Esses primeiros sons são os alicerces da fala.',
'Não se preocupe, vamos estimular mais a vocalização.',
'Continue observando e estimulando.',
ARRAY['Imite os sons que o bebê faz', 'Converse como se entendesse tudo', 'Use expressões faciais'],
ARRAY['Fale mais com o bebê', 'Cante canções simples', 'Faça sons divertidos'],
ARRAY['Dê tempo para resposta', 'Continue por algumas semanas', 'Observe em momentos calmos'],
1, true),

-- LINGUAGEM (6-18 months)
('linguagem', 6, 12, 'A criança balbucia combinações como "mama" ou "papa"?', 3,
'Maravilhoso! O balbucio é precursor das primeiras palavras.',
'Vamos estimular mais a vocalização.',
'Continue observando e estimulando.',
ARRAY['Repita os sons que a criança faz', 'Nomeie objetos e pessoas', 'Leia livros diariamente'],
ARRAY['Fale mais durante atividades', 'Use músicas e canções', 'Responda a vocalizações'],
ARRAY['Continue estímulos por semanas', 'Observe em situações diferentes', 'Registre progressos'],
1, true),

('linguagem', 12, 18, 'A criança fala pelo menos 3-5 palavras diferentes?', 4,
'Excelente! O vocabulário está se desenvolvendo bem.',
'É normal, cada criança tem seu ritmo de desenvolvimento.',
'Continue observando e estimulando a comunicação.',
ARRAY['Continue conversando muito', 'Leia livros juntos', 'Cante músicas infantis'],
ARRAY['Fale durante atividades diárias', 'Use gestos com palavras', 'Repita palavras simples'],
ARRAY['Observe tentativas de comunicação', 'Preste atenção aos sons', 'Anote tentativas'],
1, true),

-- COGNITIVO (0-12 months)
('cognitivo', 1, 4, 'A criança acompanha objetos com os olhos?', 1,
'Perfeito! O acompanhamento visual é essencial.',
'Vamos trabalhar mais a estimulação visual.',
'Continue testando com diferentes objetos.',
ARRAY['Use objetos coloridos e contrastantes', 'Mova objetos lentamente', 'Varie distâncias'],
ARRAY['Use cores mais vibrantes', 'Aproxime mais os objetos', 'Teste em boa iluminação'],
ARRAY['Observe em diferentes condições', 'Use objetos com movimento', 'Teste distâncias variadas'],
2, true),

('cognitivo', 6, 12, 'A criança procura objetos que desaparecem de sua vista?', 2,
'Ótimo! A permanência do objeto está se desenvolvendo.',
'Vamos trabalhar mais esse conceito.',
'Continue brincando de esconder objetos.',
ARRAY['Brinque de "achou!" com objetos', 'Esconda brinquedos parcialmente', 'Use jogos de permanência'],
ARRAY['Comece escondendo parcialmente', 'Use objetos favoritos', 'Seja paciente e persistente'],
ARRAY['Continue brincadeiras por semanas', 'Observe interesse em objetos', 'Varie os jogos'],
1, true),

-- SOCIAL_EMOCIONAL (0-12 months)
('social_emocional', 1, 4, 'A criança sorri em resposta ao seu sorriso?', 1,
'Lindo! O sorriso social é um marco maravilhoso.',
'Vamos trabalhar mais interações sociais positivas.',
'Continue sorrindo e interagindo.',
ARRAY['Continue sorrindo frequentemente', 'Faça caretas engraçadas', 'Brinque de "achou!"'],
ARRAY['Passe mais tempo face a face', 'Use expressões exageradas', 'Seja persistente'],
ARRAY['Tente em diferentes momentos', 'Observe quando está alerta', 'Continue interagindo'],
2, true),

('social_emocional', 6, 12, 'A criança demonstra ansiedade com estranhos?', 2,
'Normal! Isso mostra que reconhece pessoas familiares.',
'Pode ser que ainda não tenha desenvolvido essa consciência.',
'Continue observando as reações sociais.',
ARRAY['Mantenha-se por perto com estranhos', 'Apresente pessoas gradualmente', 'Respeite o tempo da criança'],
ARRAY['Exponha gradualmente a pessoas novas', 'Mantenha ambiente seguro', 'Não force interações'],
ARRAY['Observe reações a pessoas diferentes', 'Note mudanças comportamentais', 'Continue expondo gradualmente'],
0, true),

-- AUTOCUIDADO (6-18 months)
('autocuidado', 6, 12, 'A criança consegue segurar a mamadeira ou copinho?', 1,
'Ótimo! A independência na alimentação está começando.',
'Vamos estimular mais a participação na alimentação.',
'Continue oferecendo oportunidades.',
ARRAY['Deixe a criança tocar na mamadeira', 'Guie as mãozinhas', 'Elogie tentativas'],
ARRAY['Coloque as mãos da criança na mamadeira', 'Use utensílios mais leves', 'Tenha paciência'],
ARRAY['Continue oferecendo oportunidades', 'Observe tentativas', 'Seja consistente'],
1, true),

('autocuidado', 12, 18, 'A criança tenta comer sozinha com as mãos?', 2,
'Excelente! A independência alimentar está se desenvolvendo.',
'Vamos encorajar mais tentativas de autoalimentação.',
'Continue oferecendo alimentos apropriados.',
ARRAY['Ofereça finger foods seguros', 'Deixe explorar a comida', 'Elogie tentativas'],
ARRAY['Comece com alimentos fáceis de pegar', 'Demonstre como fazer', 'Seja paciente com bagunça'],
ARRAY['Continue oferecendo oportunidades', 'Observe interesse pela comida', 'Mantenha rotina'],
0, true);
