
-- Adicionar mais perguntas de exemplo organizadas por faixa etária e dimensão
-- Garantindo progressão natural das habilidades

-- DIMENSÃO MOTOR - Progressão por faixas etárias

-- 0-3 meses
INSERT INTO journey_bot_questions (
  question_text, dimension, age_min_months, age_max_months, order_index,
  feedback_yes, feedback_no, feedback_unknown,
  tips_yes, tips_no, tips_unknown, concern_level
) VALUES 
(
  'A criança move braços e pernas de forma simétrica?',
  'motor', 0, 3, 18,
  'Ótimo! Movimentos simétricos indicam desenvolvimento motor adequado.',
  'Continue observando. Alguns bebês levam mais tempo para coordenar os movimentos.',
  'Continue observando os movimentos durante as trocas de fralda.',
  ARRAY['Continue estimulando com brincadeiras no berço', 'Movimente gentilmente braços e pernas'],
  ARRAY['Faça exercícios suaves de flexão', 'Observe se há rigidez muscular', 'Converse com o pediatra'],
  ARRAY['Observe durante momentos de alerta', 'Note diferenças entre os lados', 'Registre padrões de movimento'],
  2
),
(
  'A criança consegue levar as mãos à linha média do corpo?',
  'motor', 2, 3, 19,
  'Excelente! Trazer as mãos ao centro é um marco importante.',
  'Este movimento se desenvolve gradualmente. Continue estimulando!',
  'Observe durante brincadeiras se as mãos se encontram.',
  ARRAY['Coloque brinquedos no centro do peito', 'Estimule brincadeiras com as próprias mãos'],
  ARRAY['Ajude a juntar as mãozinhas', 'Use objetos coloridos no centro', 'Pratique durante o banho'],
  ARRAY['Teste com diferentes objetos', 'Observe tentativas de alcance', 'Note coordenação bilateral'],
  1
),

-- 3-6 meses
(
  'A criança consegue segurar objetos pequenos por alguns segundos?',
  'motor', 3, 6, 20,
  'Fantástico! A preensão voluntária está se desenvolvendo.',
  'Continue oferecendo objetos seguros para estimular a preensão.',
  'Observe se mostra interesse em alcançar objetos.',
  ARRAY['Ofereça chocalhos leves', 'Varie texturas dos objetos', 'Incentive transferência entre mãos'],
  ARRAY['Use objetos maiores inicialmente', 'Ajude a fechar a mão no objeto', 'Pratique várias vezes ao dia'],
  ARRAY['Note duração da preensão', 'Observe preferência de mão', 'Registre tipos de objetos preferidos'],
  1
),

-- 6-9 meses
(
  'A criança transfere objetos de uma mão para outra?',
  'motor', 6, 9, 21,
  'Perfeito! A transferência bilateral é um marco importante.',
  'Continue praticando com diferentes objetos.',
  'Observe se tenta usar ambas as mãos simultaneamente.',
  ARRAY['Use brinquedos coloridos para motivar', 'Pratique durante alimentação', 'Varie tamanhos dos objetos'],
  ARRAY['Demonstre o movimento', 'Use objetos interessantes', 'Pratique em posições diferentes'],
  ARRAY['Note preferência de mão inicial', 'Observe coordenação', 'Registre objetos que mais interessam'],
  1
),

-- DIMENSÃO LINGUAGEM - Progressão por faixas etárias

-- 0-3 meses
(
  'A criança faz diferentes tipos de choro para necessidades diferentes?',
  'language', 0, 3, 22,
  'Excelente! Diferentes choros mostram comunicação intencional.',
  'Continue prestando atenção aos padrões do choro.',
  'Observe se consegue identificar alguns padrões.',
  ARRAY['Responda prontamente aos choros', 'Observe contextos diferentes', 'Verbalize o que acredita que precisa'],
  ARRAY['Registre horários e contextos', 'Tente diferentes respostas', 'Mantenha rotina consistente'],
  ARRAY['Note duração dos choros', 'Observe outros sinais de comunicação', 'Registre padrões ao longo do dia'],
  1
),
(
  'A criança produz sons vocálicos (ah, eh, oh) espontaneamente?',
  'language', 1, 3, 23,
  'Maravilhoso! Os primeiros sons vocálicos são o início da fala.',
  'Continue conversando para estimular mais vocalizações.',
  'Observe se faz sons durante momentos de contentamento.',
  ARRAY['Imite os sons que faz', 'Converse durante cuidados', 'Use tom melodioso'],
  ARRAY['Faça sons vocálicos variados', 'Cante cantigas', 'Responda a tentativas de som'],
  ARRAY['Registre diferentes sons', 'Note contextos de vocalização', 'Observe reações a sua voz'],
  1
),

-- 3-6 meses
(
  'A criança vocaliza quando você fala com ela, como se fosse uma conversa?',
  'language', 3, 6, 24,
  'Perfeito! Esta é uma proto-conversa muito importante.',
  'Continue as "conversas" para desenvolver turnos comunicativos.',
  'Observe se há pausas como se esperasse sua resposta.',
  ARRAY['Mantenha "conversas" regulares', 'Faça pausas para ela "responder"', 'Use expressões faciais variadas'],
  ARRAY['Inicie mais interações verbais', 'Responda a todas as vocalizações', 'Use diferentes tons de voz'],
  ARRAY['Note padrões de turnos', 'Observe duração das "conversas"', 'Registre contextos favoritos'],
  1
),

-- 6-12 meses
(
  'A criança usa gestos (apontar, acenar) junto com vocalizações?',
  'language', 8, 12, 25,
  'Excelente! Combinar gestos e sons é comunicação sofisticada.',
  'Continue incentivando gestos durante a comunicação.',
  'Observe tentativas de combinar movimentos com sons.',
  ARRAY['Imite gestos com palavras', 'Aponte para objetos nomeando-os', 'Celebre tentativas de comunicação'],
  ARRAY['Demonstre gestos simples', 'Use apontamento frequentemente', 'Combine sempre palavras com gestos'],
  ARRAY['Registre gestos emergentes', 'Note intenção comunicativa', 'Observe contextos de uso'],
  1
),

-- DIMENSÃO SOCIAL - Progressão por faixas etárias

-- 0-3 meses
(
  'A criança se acalma quando ouve sua voz familiar?',
  'social', 0, 3, 26,
  'Ótimo! Reconhecer vozes familiares é fundamental para vínculos.',
  'Continue falando com carinho para fortalecer o reconhecimento.',
  'Observe se reage diferente a vozes conhecidas vs desconhecidas.',
  ARRAY['Fale regularmente durante cuidados', 'Use tom carinhoso e calmo', 'Cante canções de ninar'],
  ARRAY['Aumente tempo de conversa', 'Varie entonações', 'Permita que outros também falem'],
  ARRAY['Compare reações a diferentes vozes', 'Note momentos de maior resposta', 'Registre preferências'],
  1
),
(
  'A criança demonstra prazer durante interações sociais (sorri, vocaliza)?',
  'social', 1, 3, 27,
  'Maravilhoso! Demonstrar prazer social é um marco emocional importante.',
  'Continue proporcionando interações positivas e carinhosas.',
  'Observe diferentes tipos de demonstração de contentamento.',
  ARRAY['Mantenha interações alegres', 'Use humor apropriado', 'Sorria frequentemente'],
  ARRAY['Aumente tempo de brincadeiras face a face', 'Use expressões exageradas', 'Seja responsiva'],
  ARRAY['Note diferentes sinais de prazer', 'Observe duração do engajamento', 'Registre atividades preferidas'],
  1
),

-- 3-6 meses
(
  'A criança mostra interesse em outras crianças olhando ou tentando tocar?',
  'social', 4, 6, 28,
  'Excelente! Interesse social precoce é muito positivo.',
  'Continue proporcionando oportunidades de observar outras crianças.',
  'Observe como reage na presença de outras crianças.',
  ARRAY['Permita observar outras crianças', 'Facilite interações supervisionadas', 'Nomeie outras crianças'],
  ARRAY['Organize encontros com outras famílias', 'Leve a parques infantis', 'Estimule interesse social'],
  ARRAY['Note tipo de interesse demonstrado', 'Observe duração da atenção', 'Registre reações específicas'],
  0
),

-- 6-12 meses
(
  'A criança demonstra ansiedade de separação quando você sai de vista?',
  'social', 6, 12, 29,
  'Normal e saudável! Ansiedade de separação mostra vínculo forte.',
  'A ansiedade de separação é um marco normal do desenvolvimento.',
  'Observe diferentes reações dependendo de quem está presente.',
  ARRAY['Faça transições graduais', 'Verbalize quando vai sair e voltar', 'Mantenha rotinas previsíveis'],
  ARRAY['Pratique separações curtas', 'Deixe objeto de conforto', 'Retorne quando prometido'],
  ARRAY['Note intensidade das reações', 'Observe duração do desconforto', 'Registre estratégias que ajudam'],
  0
),

-- DIMENSÃO SENSORIAL - Progressão por faixas etárias

-- 0-3 meses
(
  'A criança segue objetos coloridos com os olhos de um lado para outro?',
  'sensory', 1, 3, 30,
  'Perfeito! O rastreamento visual está se desenvolvendo bem.',
  'Continue estimulando com objetos coloridos e contrastantes.',
  'Observe até que distância consegue focar nos objetos.',
  ARRAY['Use brinquedos contrastantes', 'Mova objetos lentamente', 'Varie direções de movimento'],
  ARRAY['Use cores mais vibrantes', 'Aproxime objetos gradualmente', 'Pratique em ambientes bem iluminados'],
  ARRAY['Teste diferentes distâncias', 'Note preferências de cores', 'Registre duração do foco'],
  1
),
(
  'A criança reage a mudanças súbitas de luz (piscar, fechar olhos)?',
  'sensory', 0, 3, 31,
  'Ótimo! A sensibilidade à luz é uma resposta protetiva normal.',
  'Continue observando respostas a diferentes intensidades de luz.',
  'Note se há reações consistentes a mudanças de iluminação.',
  ARRAY['Use iluminação adequada', 'Evite luzes muito fortes', 'Crie ambientes confortáveis'],
  ARRAY['Teste gradualmente diferentes intensidades', 'Observe em diferentes horários', 'Proteja de luzes súbitas'],
  ARRAY['Registre tipos de reação', 'Note limiar de sensibilidade', 'Observe adaptação gradual'],
  0
),

-- 3-6 meses
(
  'A criança explora objetos com a boca de forma coordenada?',
  'sensory', 3, 6, 32,
  'Excelente! Exploração oral é fundamental para desenvolvimento sensorial.',
  'Continue oferecendo objetos seguros para exploração oral.',
  'Observe preferências por diferentes texturas e formas.',
  ARRAY['Ofereça brinquedos seguros', 'Varie texturas e formas', 'Mantenha objetos limpos'],
  ARRAY['Estimule com diferentes materiais', 'Supervise exploração', 'Use brinquedos de dentição'],
  ARRAY['Note preferências de textura', 'Observe duração da exploração', 'Registre objetos favoritos'],
  0
),

-- 6-12 meses
(
  'A criança demonstra preferências claras por certos alimentos ou texturas?',
  'sensory', 6, 12, 33,
  'Normal! Desenvolver preferências é parte do desenvolvimento sensorial.',
  'Continue oferecendo variedade respeitando as preferências.',
  'Observe se há recusa consistente a certas texturas.',
  ARRAY['Respeite preferências', 'Continue oferecendo variedade', 'Faça refeições agradáveis'],
  ARRAY['Introduza texturas gradualmente', 'Misture preferidos com novos', 'Não force aceitação'],
  ARRAY['Registre padrões de preferência', 'Note evolução ao longo do tempo', 'Observe sinais de desconforto'],
  0
);
