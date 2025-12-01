-- Inserir perguntas dos módulos 0-1, 1-2 e 2-3 meses do JSON para o banco

-- Perguntas do módulo 0-1 meses
INSERT INTO public.journey_bot_questions (
  dimension, age_min_months, age_max_months, order_index, question_text, 
  feedback_yes, feedback_no, feedback_unknown, tips_yes, tips_no, tips_unknown, active
) VALUES 
(
  'motor_grosso', 0, 1, 1,
  'O {childName} consegue manter a cabeça erguida por alguns segundos quando está de bruços?',
  '🎉 Que incrível {motherName}! O {childName} está desenvolvendo o controle da cabeça, um passo essencial para futuros movimentos.',
  '💪 Não se preocupe {motherName}! Cada bebê tem seu ritmo. Continue estimulando com carinho.',
  '💡 Perfeito {motherName}! Isso é completamente normal. O controle da cabeça se desenvolve gradualmente.',
  ARRAY['Coloque o {childName} de bruços por 2-3 min por dia em uma superfície segura com brinquedos coloridos à frente.'],
  ARRAY['Coloque o {childName} de bruços por 2-3 min por dia em uma superfície segura com brinquedos coloridos à frente.'],
  ARRAY['Coloque o {childName} de bruços por 2-3 min por dia em uma superfície segura com brinquedos coloridos à frente.'],
  true
),
(
  'cognitivo', 0, 1, 2,
  'O {childName} observa seu rosto ou objetos em movimento perto do campo visual dele?',
  '👀 Excelente {motherName}! O {childName} está desenvolvendo bem o foco visual e atenção.',
  '👁️ Tranquila {motherName}! A visão do bebê ainda está se desenvolvendo. Use contrastes fortes para ajudar.',
  '🔍 Normal {motherName}! Isso mostra que ele está começando a perceber o mundo ao redor.',
  ARRAY['Use um móbile ou chocalho preto e branco e mova suavemente para que o {childName} acompanhe com os olhos!'],
  ARRAY['Use um móbile ou chocalho preto e branco e mova suavemente para que o {childName} acompanhe com os olhos!'],
  ARRAY['Use um móbile ou chocalho preto e branco e mova suavemente para que o {childName} acompanhe com os olhos!'],
  true
),
(
  'linguagem', 0, 1, 3,
  'O {childName} emite algum som além do choro, como grunhidos ou suspiros?',
  '🎵 Que fofura {motherName}! Esses sons são formas iniciais de expressão e vínculo.',
  '🗣️ Normal {motherName}! Mantenha momentos de contato olho no olho e vá narrando as ações do dia a dia.',
  '🎶 Ótimo {motherName}! Continue conversando bastante com ele usando voz suave e pausada.',
  ARRAY['Fale e cante para o {childName} várias vezes ao dia. Isso estimula a escuta e a produção vocal.'],
  ARRAY['Fale e cante para o {childName} várias vezes ao dia. Isso estimula a escuta e a produção vocal.'],
  ARRAY['Fale e cante para o {childName} várias vezes ao dia. Isso estimula a escuta e a produção vocal.'],
  true
),
(
  'social_emocional', 0, 1, 4,
  'O {childName} para de chorar quando ouve sua voz?',
  '🎧 Que maravilhoso {motherName}! O {childName} já reconhece sua voz como algo familiar e tranquilizador.',
  '🔊 Tranquila {motherName}! Faça experiências como mudar o tom da voz e observe como ele reage.',
  '👂 Ótimo sinal {motherName}! Continue conversando com ele mesmo fora do campo visual.',
  ARRAY['Converse, cante ou conte histórias curtas enquanto troca a fralda ou dá banho. Ele vai adorar sua voz!'],
  ARRAY['Converse, cante ou conte histórias curtas enquanto troca a fralda ou dá banho. Ele vai adorar sua voz!'],
  ARRAY['Converse, cante ou conte histórias curtas enquanto troca a fralda ou dá banho. Ele vai adorar sua voz!'],
  true
),
(
  'autocuidado', 0, 1, 5,
  '{motherName}, você tem conseguido descansar um pouco e pedir ajuda quando precisa?',
  '💆‍♀️ Que bom saber disso {motherName}! Cuidar de você é cuidar do {childName} também. Continue assim!',
  '😓 Compreendo perfeitamente! Fale com alguém de confiança sobre como está se sentindo. Você não está sozinha!',
  '☕ Entendo {motherName}! Peça ajuda a quem confia. Uma pausa para descansar faz toda diferença.',
  ARRAY['Escolha um momento por dia para cuidar de você: banho tranquilo, respiração profunda ou uma xícara de chá em silêncio.'],
  ARRAY['Escolha um momento por dia para cuidar de você: banho tranquilo, respiração profunda ou uma xícara de chá em silêncio.'],
  ARRAY['Escolha um momento por dia para cuidar de você: banho tranquilo, respiração profunda ou uma xícara de chá em silêncio.'],
  true
),

-- Perguntas do módulo 1-2 meses
(
  'motor_grosso', 1, 2, 1,
  'Seu bebê consegue mover a cabeça de um lado para o outro quando está de bruços?',
  '🎉 Que maravilha! Seu bebê está ficando cada vez mais forte!',
  '💪 Faça esse exercício diariamente e observe o progresso, com muita paciência.',
  '💡 Estimule colocando brinquedos chamativos de um lado e depois do outro.',
  ARRAY['Coloque o bebê de bruços por 3-5 minutos, com brinquedos coloridos próximos, alternando os lados.'],
  ARRAY['Coloque o bebê de bruços por 3-5 minutos, com brinquedos coloridos próximos, alternando os lados.'],
  ARRAY['Coloque o bebê de bruços por 3-5 minutos, com brinquedos coloridos próximos, alternando os lados.'],
  true
),
(
  'cognitivo', 1, 2, 2,
  'Ele parece se interessar por novos objetos ou sons no ambiente?',
  '🎉 Que bebê curioso! Isso mostra que ele já está aprendendo com o ambiente.',
  '💡 Estimule com brinquedos simples e observação compartilhada com o cuidador.',
  '💡 Varie os estímulos: cores, sons suaves e objetos de diferentes texturas.',
  ARRAY['Mostre objetos com texturas variadas e sons diferentes, uma vez por dia.'],
  ARRAY['Mostre objetos com texturas variadas e sons diferentes, uma vez por dia.'],
  ARRAY['Mostre objetos com texturas variadas e sons diferentes, uma vez por dia.'],
  true
),
(
  'linguagem', 1, 2, 3,
  'Seu bebê vocaliza sons como "aaa", "eeeh" ou balbucios?',
  '🎉 Que lindo ouvir isso! Ele está descobrindo sua própria voz.',
  '💡 Faça silêncio após falar com ele e observe se tenta responder com sons.',
  '💡 Repita os sons que ele faz e estimule com cantigas e falas lentas.',
  ARRAY['Durante a troca de fralda, fale pausadamente e cante músicas curtas, olhando nos olhos dele.'],
  ARRAY['Durante a troca de fralda, fale pausadamente e cante músicas curtas, olhando nos olhos dele.'],
  ARRAY['Durante a troca de fralda, fale pausadamente e cante músicas curtas, olhando nos olhos dele.'],
  true
),
(
  'social_emocional', 1, 2, 4,
  'Seu bebê já responde com sorrisos sociais quando você sorri?',
  '🎉 Que conexão maravilhosa! Ele já responde às suas emoções!',
  '💡 Fique frente a frente com ele várias vezes ao dia para estimular esse vínculo.',
  '💡 Continue sorrindo, falando com suavidade e fazendo expressões faciais marcantes.',
  ARRAY['Faça "caras e bocas" e sorria para ele após o banho. Espere para ver se ele responde!'],
  ARRAY['Faça "caras e bocas" e sorria para ele após o banho. Espere para ver se ele responde!'],
  ARRAY['Faça "caras e bocas" e sorria para ele após o banho. Espere para ver se ele responde!'],
  true
),
(
  'autocuidado', 1, 2, 5,
  'Você tem alguém com quem conversar sobre como tem se sentido nos últimos dias?',
  '🎉 Que bom! Ter com quem contar faz toda diferença.',
  '💡 Procure uma roda de mães ou grupo de apoio. Você não está sozinha!',
  '💡 Fale com alguém de confiança, mesmo que por mensagem ou chamada.',
  ARRAY['Escreva como se sente em um diário. Isso ajuda a organizar os pensamentos e emoções.'],
  ARRAY['Escreva como se sente em um diário. Isso ajuda a organizar os pensamentos e emoções.'],
  ARRAY['Escreva como se sente em um diário. Isso ajuda a organizar os pensamentos e emoções.'],
  true
),

-- Perguntas do módulo 2-3 meses
(
  'motor_grosso', 2, 3, 1,
  'Seu bebê já consegue manter a cabeça mais firme quando está sentado com apoio?',
  '🎉 Que força! Ele está se preparando para explorar ainda mais o mundo.',
  '💡 Continue incentivando o tempo de bruços, respeitando o tempo dele.',
  '💡 Apoie o bebê sentado no seu colo e incentive movimentos suaves com brinquedos chamativos.',
  ARRAY['Sente-se com o bebê no colo, dando apoio no tronco, e brinque com chocalhos ou rostos sorridentes à frente.'],
  ARRAY['Sente-se com o bebê no colo, dando apoio no tronco, e brinque com chocalhos ou rostos sorridentes à frente.'],
  ARRAY['Sente-se com o bebê no colo, dando apoio no tronco, e brinque com chocalhos ou rostos sorridentes à frente.'],
  true
),
(
  'cognitivo', 2, 3, 2,
  'O bebê parece reconhecer padrões ou reage de forma diferente a vozes e sons familiares?',
  '🎉 Que bebê atento! Isso mostra que ele está começando a entender o ambiente.',
  '💡 Reforce a rotina com músicas, vozes e objetos que ele já conhece.',
  '💡 Use sempre as mesmas canções e expressões em momentos do dia.',
  ARRAY['Toque uma música tranquila sempre no mesmo horário e observe se ele se acalma ao ouvir.'],
  ARRAY['Toque uma música tranquila sempre no mesmo horário e observe se ele se acalma ao ouvir.'],
  ARRAY['Toque uma música tranquila sempre no mesmo horário e observe se ele se acalma ao ouvir.'],
  true
),
(
  'social_emocional', 2, 3, 3,
  'O bebê sorri para você de forma espontânea, mesmo sem estímulo direto?',
  '🎉 Que amor! Ele já reconhece você como fonte de alegria!',
  '💡 Crie momentos de brincadeira leve e expressiva, olhando nos olhos dele.',
  '💡 Continue sorrindo, tocando e falando com carinho ao interagir.',
  ARRAY['Jogue o jogo do "cadê?" com as mãos ou um paninho, e sorria muito nas interações!'],
  ARRAY['Jogue o jogo do "cadê?" com as mãos ou um paninho, e sorria muito nas interações!'],
  ARRAY['Jogue o jogo do "cadê?" com as mãos ou um paninho, e sorria muito nas interações!'],
  true
),
(
  'linguagem', 2, 3, 4,
  'Seu bebê faz sons em resposta quando você fala ou canta para ele?',
  '🎉 Que delícia de conversa! Ele está começando o diálogo afetivo!',
  '💡 Use expressões faciais e repita sons que ele fizer como se estivessem conversando.',
  '💡 Espere a vez dele após falar e responda aos balbucios com entusiasmo.',
  ARRAY['Converse com ele durante o banho ou a troca de roupa e pause esperando respostas sonoras.'],
  ARRAY['Converse com ele durante o banho ou a troca de roupa e pause esperando respostas sonoras.'],
  ARRAY['Converse com ele durante o banho ou a troca de roupa e pause esperando respostas sonoras.'],
  true
),
(
  'autocuidado', 2, 3, 5,
  'Você tem conseguido dormir um pouco mais ou dividir tarefas com alguém?',
  '🎉 Que bom! Compartilhar tarefas fortalece o bem-estar da família toda.',
  '💡 Peça ajuda sem culpa. Cuidar de si é parte do cuidar do bebê.',
  '💡 Delegue tarefas sempre que possível. Você também merece descanso!',
  ARRAY['Tente dormir ou relaxar ao menos uma vez ao dia, mesmo que por 20 minutos. Se precisar, peça esse tempo.'],
  ARRAY['Tente dormir ou relaxar ao menos uma vez ao dia, mesmo que por 20 minutos. Se precisar, peça esse tempo.'],
  ARRAY['Tente dormir ou relaxar ao menos uma vez ao dia, mesmo que por 20 minutos. Se precisar, peça esse tempo.'],
  true
);