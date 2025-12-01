
-- Inserir perguntas de exemplo para a Jornada Bot
-- Cobrindo diferentes dimensões e faixas etárias

-- Dimensão: Motor (0-6 meses)
INSERT INTO journey_bot_questions (
  question_text, dimension, age_min_months, age_max_months, order_index,
  feedback_yes, feedback_no, feedback_unknown,
  tips_yes, tips_no, tips_unknown, concern_level
) VALUES 
(
  'A criança consegue sustentar a cabeça quando está de bruços?',
  'motor', 0, 3, 1,
  'Excelente! O controle da cabeça é um marco importante do desenvolvimento motor.',
  'Não se preocupe, cada criança tem seu próprio ritmo. Vamos trabalhar nisso juntos.',
  'É importante observar este marco nos próximos dias.',
  ARRAY['Continue com tempo supervisionado de bruços diariamente', 'Use brinquedos coloridos para motivar o levantamento da cabeça'],
  ARRAY['Pratique 2-3 minutos de bruços por dia', 'Coloque brinquedos à frente para estimular', 'Consulte o pediatra se não houver progresso'],
  ARRAY['Observe durante as brincadeiras no tapete', 'Anote quando consegue levantar a cabeça', 'Teste em diferentes momentos do dia'],
  1
),
(
  'A criança consegue rolar da barriga para as costas?',
  'motor', 3, 6, 2,
  'Fantástico! Rolar é um grande marco do desenvolvimento motor.',
  'Este movimento geralmente aparece entre 3-6 meses. Vamos estimular!',
  'Continue observando. Alguns bebês demoram mais para desenvolver esta habilidade.',
  ARRAY['Incentive mais tempo de bruços', 'Coloque brinquedos ao lado para motivar o movimento'],
  ARRAY['Pratique o movimento gentilmente com a criança', 'Use brinquedos como motivação', 'Certifique-se de que há espaço seguro'],
  ARRAY['Observe se tenta se mover quando de bruços', 'Note se mostra interesse em objetos ao lado', 'Registre tentativas de movimento'],
  1
),

-- Dimensão: Linguagem (0-6 meses)
(
  'A criança faz sons de balbucios (ba-ba, ma-ma) mesmo que sem significado?',
  'language', 3, 6, 3,
  'Maravilhoso! Os balbucios são os primeiros passos para a fala.',
  'Os balbucios podem aparecer entre 4-6 meses. Vamos estimular a comunicação!',
  'Continue prestando atenção aos sons que a criança faz.',
  ARRAY['Continue conversando bastante com a criança', 'Repita os sons que ela faz', 'Cante músicas e cantigas'],
  ARRAY['Fale mais durante atividades diárias', 'Imite sons diferentes', 'Leia livros com vozes variadas'],
  ARRAY['Observe durante momentos de brincadeira', 'Note se responde quando você fala', 'Registre diferentes tipos de sons'],
  1
),
(
  'A criança responde ao seu nome virando a cabeça ou olhando?',
  'language', 4, 6, 4,
  'Excelente! Reconhecer o nome é um marco importante da comunicação.',
  'Este reconhecimento pode variar entre bebês. Vamos trabalhar nisso.',
  'Continue chamando pelo nome em diferentes situações.',
  ARRAY['Use o nome da criança frequentemente', 'Chame o nome em tom carinhoso', 'Sorria quando ela responder'],
  ARRAY['Chame o nome várias vezes ao dia', 'Use tom de voz diferente', 'Combine com toque gentil'],
  ARRAY['Teste em momentos diferentes', 'Observe se responde a outras palavras', 'Note reações a vozes familiares'],
  1
),

-- Dimensão: Social (0-6 meses)
(
  'A criança sorri em resposta ao seu sorriso?',
  'social', 1, 3, 5,
  'Que alegria! O sorriso social é um dos marcos mais emocionantes.',
  'O sorriso social geralmente aparece entre 6-8 semanas. Continue estimulando!',
  'Continue sorrindo para a criança e observe as reações.',
  ARRAY['Sorria frequentemente para a criança', 'Faça caretas engraçadas', 'Mantenha contato visual'],
  ARRAY['Passe mais tempo face a face', 'Use expressões exageradas', 'Fale em tom alegre'],
  ARRAY['Observe durante diferentes momentos', 'Note outras expressões faciais', 'Registre quando sorri espontaneamente'],
  1
),
(
  'A criança mantém contato visual por alguns segundos?',
  'social', 0, 4, 6,
  'Perfeito! O contato visual é fundamental para o desenvolvimento social.',
  'O contato visual se desenvolve gradualmente nos primeiros meses.',
  'Continue observando os momentos de maior atenção da criança.',
  ARRAY['Mantenha conversas face a face', 'Use expressões variadas', 'Posicione-se na linha de visão'],
  ARRAY['Aproxime seu rosto devagar', 'Fale em tom suave', 'Use objetos coloridos próximos ao rosto'],
  ARRAY['Teste em momentos de alerta', 'Observe durante a alimentação', 'Note duração do olhar'],
  1
),

-- Dimensão: Sensorial (0-6 meses)
(
  'A criança reage a sons altos virando a cabeça ou se assustando?',
  'sensory', 0, 2, 7,
  'Ótimo! A resposta a sons indica desenvolvimento auditivo adequado.',
  'Vamos estimular mais a audição com diferentes sons.',
  'Continue observando as reações a diferentes tipos de sons.',
  ARRAY['Use chocalhos e brinquedos sonoros', 'Varie tons de voz', 'Toque música suave'],
  ARRAY['Teste com diferentes volumes', 'Use objetos que fazem ruído', 'Fale de diferentes direções'],
  ARRAY['Observe durante ruídos cotidianos', 'Note se para de chorar com música', 'Registre reações a vozes'],
  2
),

-- Dimensão: Motor (6-12 meses)
(
  'A criança consegue sentar sem apoio por alguns minutos?',
  'motor', 6, 9, 8,
  'Excelente! Sentar sem apoio é um marco fundamental.',
  'O sentar independente geralmente acontece entre 6-8 meses. Continue praticando!',
  'Observe se consegue se equilibrar quando sentada com apoio.',
  ARRAY['Continue com brincadeiras no chão', 'Use almofadas para segurança', 'Incentive brincadeiras sentada'],
  ARRAY['Pratique sentar com apoio gradual', 'Fortaleça o core com exercícios', 'Use brinquedos como motivação'],
  ARRAY['Teste diferentes superfícies', 'Note tentativas de se equilibrar', 'Observe duração das tentativas'],
  1
),
(
  'A criança engatinha ou se desloca de alguma forma?',
  'motor', 7, 12, 9,
  'Fantástico! A mobilidade independente é um grande passo.',
  'Nem todas as crianças engatinham. Algumas vão direto para ficar de pé!',
  'Continue observando diferentes formas de movimento.',
  ARRAY['Crie espaços seguros para explorar', 'Use brinquedos como motivação', 'Incentive movimento no chão'],
  ARRAY['Estimule diferentes tipos de movimento', 'Pratique no tapete', 'Coloque objetos interessantes à distância'],
  ARRAY['Note se arrasta ou rola para se mover', 'Observe tentativas de movimento', 'Registre preferências de posição'],
  1
),

-- Dimensão: Linguagem (6-12 meses)
(
  'A criança diz pelo menos uma palavra com significado (mamã, papá, não)?',
  'language', 8, 12, 10,
  'Que maravilha! As primeiras palavras são um momento especial.',
  'As primeiras palavras aparecem entre 8-12 meses. Vamos estimular!',
  'Continue prestando atenção aos sons que parecem ter intenção.',
  ARRAY['Celebre cada tentativa de palavra', 'Repita palavras simples', 'Nomeie objetos durante brincadeiras'],
  ARRAY['Fale constantemente durante atividades', 'Use palavras simples e claras', 'Leia livros infantis'],
  ARRAY['Registre sons que parecem palavras', 'Observe contexto dos sons', 'Note tentativas de imitação'],
  1
),
(
  'A criança responde a comandos simples como "vem cá" ou "tchau"?',
  'language', 9, 12, 11,
  'Excelente! Compreender comandos mostra desenvolvimento da linguagem receptiva.',
  'A compreensão se desenvolve antes da fala. Continue praticando!',
  'Continue usando comandos simples no dia a dia.',
  ARRAY['Use gestos junto com palavras', 'Seja consistente com comandos', 'Comemore quando responder'],
  ARRAY['Pratique comandos durante brincadeiras', 'Use tom alegre', 'Combine palavras com ações'],
  ARRAY['Teste em diferentes contextos', 'Observe se entende sem gestos', 'Note preferência por certos comandos'],
  1
),

-- Dimensão: Social (6-12 meses)
(
  'A criança imita gestos simples como bater palmas ou acenar?',
  'social', 8, 12, 12,
  'Perfeito! A imitação é fundamental para o aprendizado social.',
  'A imitação se desenvolve gradualmente. Continue demonstrando!',
  'Continue observando se tenta copiar suas ações.',
  ARRAY['Faça gestos exagerados', 'Bata palmas durante músicas', 'Acene sempre ao se despedir'],
  ARRAY['Pratique gestos durante brincadeiras', 'Use espelho para mostrar movimentos', 'Repita várias vezes'],
  ARRAY['Note tentativas de imitação', 'Observe durante músicas', 'Registre quais gestos prefere'],
  1
),

-- Dimensão: Sensorial (6-12 meses)
(
  'A criança explora objetos levando à boca e manipulando com as mãos?',
  'sensory', 6, 10, 13,
  'Ótimo! A exploração oral e manual é normal e importante.',
  'Continue oferecendo objetos seguros para exploração.',
  'Observe como a criança interage com diferentes texturas.',
  ARRAY['Ofereça objetos de texturas variadas', 'Garanta que brinquedos sejam seguros', 'Varie tamanhos e formas'],
  ARRAY['Estimule com diferentes materiais', 'Supervisione exploração oral', 'Use brinquedos sensoriais'],
  ARRAY['Note preferências de textura', 'Observe duração da exploração', 'Registre objetos de interesse'],
  0
),

-- Dimensão: Motor (12-18 meses)
(
  'A criança consegue andar sozinha pelo menos alguns passos?',
  'motor', 10, 18, 14,
  'Excelente! Andar é um marco motor fundamental.',
  'O andar independente varia entre 9-18 meses. Cada criança tem seu tempo!',
  'Continue observando tentativas de equilibrio e passos.',
  ARRAY['Incentive andar descalça', 'Crie espaços seguros', 'Use brinquedos de empurrar'],
  ARRAY['Pratique ficar de pé', 'Segure as mãos para caminhar', 'Use móveis para apoio'],
  ARRAY['Observe se fica de pé sozinha', 'Note passos com apoio', 'Registre progresso no equilibrio'],
  1
),

-- Dimensão: Linguagem (12-18 meses)
(
  'A criança tem pelo menos 5 palavras diferentes que usa regularmente?',
  'language', 12, 18, 15,
  'Maravilhoso! O vocabulário está crescendo bem.',
  'O vocabulário explode nesta idade. Continue conversando muito!',
  'Continue prestando atenção a novas tentativas de palavras.',
  ARRAY['Nomeie tudo durante o dia', 'Leia livros juntos', 'Cante músicas infantis'],
  ARRAY['Repita palavras que tenta falar', 'Use frases simples', 'Descreva ações durante atividades'],
  ARRAY['Registre novas tentativas de palavras', 'Observe comunicação não-verbal', 'Note palavras mais usadas'],
  1
),

-- Dimensão: Social (12-18 meses)
(
  'A criança demonstra afeto abraçando, beijando ou fazendo carinho?',
  'social', 12, 18, 16,
  'Que lindo! Demonstrar afeto mostra desenvolvimento emocional saudável.',
  'Continue sendo carinhosa. O afeto se desenvolve através do exemplo.',
  'Continue observando diferentes formas de demonstrar carinho.',
  ARRAY['Seja carinhosa regularmente', 'Verbalize sentimentos', 'Aceite demonstrações de afeto'],
  ARRAY['Modele comportamentos carinhosos', 'Use palavras de afeto', 'Responda positivamente ao carinho'],
  ARRAY['Note diferentes formas de afeto', 'Observe com diferentes pessoas', 'Registre momentos espontâneos'],
  0
),

-- Dimensão: Sensorial (12-18 meses)
(
  'A criança reage adequadamente a diferentes texturas (áspera, lisa, macia)?',
  'sensory', 12, 18, 17,
  'Perfeito! A discriminação sensorial está se desenvolvendo bem.',
  'Continue expondo a diferentes texturas de forma gradual.',
  'Observe as reações e preferências da criança.',
  ARRAY['Continue oferecendo texturas variadas', 'Use brincadeiras sensoriais', 'Explore durante o banho'],
  ARRAY['Introduza texturas gradualmente', 'Respeite limites da criança', 'Use alimentos de texturas diferentes'],
  ARRAY['Note reações a cada textura', 'Observe preferências', 'Registre tolerância sensorial'],
  0
);
