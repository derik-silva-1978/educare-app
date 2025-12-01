-- Inserir perguntas para o módulo 3-4 meses
INSERT INTO journey_bot_questions (
  dimension, age_min_months, age_max_months, order_index, 
  question_text, feedback_yes, feedback_unknown, feedback_no,
  tips_yes, tips_unknown, tips_no, concern_level, active
) VALUES 

-- 3-4 meses - Motor Grosso
('motor_grosso', 3, 4, 16,
 'Seu bebê já tenta apoiar-se nos braços quando está de bruços?',
 '🎉 Ótimo! Isso mostra que ele está ficando cada vez mais forte e curioso!',
 '💡 Incentive o tempo de bruços com brinquedos à frente, sempre supervisionando.',
 '💡 Faça pequenas sessões diárias, com paciência e estímulo.',
 ARRAY['Coloque um espelho ou brinquedo à frente do bebê durante o tempo de bruços para motivar o apoio com os braços.'],
 ARRAY['Coloque um espelho ou brinquedo à frente do bebê durante o tempo de bruços para motivar o apoio com os braços.'],
 ARRAY['Coloque um espelho ou brinquedo à frente do bebê durante o tempo de bruços para motivar o apoio com os braços.'],
 1, true),

-- 3-4 meses - Cognitivo
('cognitivo', 3, 4, 17,
 'O bebê demonstra interesse ao ver a própria mão ou movimentos dos dedos?',
 '🎉 Que gracinha! Isso mostra que ele está se descobrindo!',
 '💡 Estimule com pulseirinhas coloridas e movimentos lentos dos bracinhos.',
 '💡 Coloque luvas coloridas nas mãos do bebê para ele observar.',
 ARRAY['Durante a troca, mostre as mãozinhas para ele e diga: "Essas são suas mãos!".'],
 ARRAY['Durante a troca, mostre as mãozinhas para ele e diga: "Essas são suas mãos!".'],
 ARRAY['Durante a troca, mostre as mãozinhas para ele e diga: "Essas são suas mãos!".'],
 1, true),

-- 3-4 meses - Linguagem
('linguagem', 3, 4, 18,
 'Ele vocaliza com diferentes sons e entonações, como se estivesse conversando?',
 '🎉 Que tagarela fofo! Isso é sinal de ótimo desenvolvimento!',
 '💡 Responda como se fosse uma conversa. Ele está aprendendo com você!',
 '💡 Repita e varie os sons durante as interações.',
 ARRAY['Cante com sílabas repetidas: "ba-ba-ba", "da-da-da", esperando ele responder.'],
 ARRAY['Cante com sílabas repetidas: "ba-ba-ba", "da-da-da", esperando ele responder.'],
 ARRAY['Cante com sílabas repetidas: "ba-ba-ba", "da-da-da", esperando ele responder.'],
 1, true),

-- 3-4 meses - Social Emocional
('social_emocional', 3, 4, 19,
 'Ele sorri para outras pessoas além dos cuidadores principais?',
 '🎉 Que simpático! Isso mostra vínculo e interação social em expansão.',
 '💡 Estimule encontros com rostos diferentes em ambiente tranquilo.',
 '💡 Continue reforçando o vínculo com expressões faciais afetuosas.',
 ARRAY['Mostre o bebê no espelho e diga: "Quem está aqui? Olha o sorrisão!"'],
 ARRAY['Mostre o bebê no espelho e diga: "Quem está aqui? Olha o sorrisão!"'],
 ARRAY['Mostre o bebê no espelho e diga: "Quem está aqui? Olha o sorrisão!"'],
 1, true),

-- 3-4 meses - Autocuidado (Maternal Health)
('autocuidado', 3, 4, 20,
 'Você tem conseguido momentos de prazer, como ouvir música ou tomar um banho tranquilo?',
 '🎉 Maravilhoso! Pequenas pausas renovam o afeto e energia.',
 '💡 Reserve 10 minutos por dia para algo que te faz bem.',
 '💡 Planeje ajuda para ter pausas, mesmo curtas. Você merece.',
 ARRAY['Crie o ritual do "momento do autocuidado": chá, banho calmo, leitura ou música leve.'],
 ARRAY['Crie o ritual do "momento do autocuidado": chá, banho calmo, leitura ou música leve.'],
 ARRAY['Crie o ritual do "momento do autocuidado": chá, banho calmo, leitura ou música leve.'],
 2, true),

-- 4-5 meses - Motor Grosso
('motor_grosso', 4, 5, 21,
 'Seu bebê tenta rolar de barriga para o lado ou de costas para a barriga?',
 '🎉 Que avanço! Ele está descobrindo seu corpo e o espaço ao redor.',
 '💡 Estimule com brinquedos ao lado, chamando pelo nome.',
 '💡 Deixe o bebê livre sobre um tapetinho firme e seguro.',
 ARRAY['Coloque um brinquedo de um lado e incentive o movimento com aplausos e sorriso.'],
 ARRAY['Coloque um brinquedo de um lado e incentive o movimento com aplausos e sorriso.'],
 ARRAY['Coloque um brinquedo de um lado e incentive o movimento com aplausos e sorriso.'],
 1, true),

-- 4-5 meses - Cognitivo
('cognitivo', 4, 5, 22,
 'Ele já mostra expectativa quando ouve sua voz antes de aparecer?',
 '🎉 Maravilha! Isso é sinal de cognição ativa e reconhecimento!',
 '💡 Brinque de esconder o rosto com paninhos e volte com alegria.',
 '💡 Use sempre as mesmas frases para rituais diários, como "Hora do banho!"',
 ARRAY['Jogue o "Cadê? Achou!" usando uma fraldinha para esconder seu rosto ou o dele.'],
 ARRAY['Jogue o "Cadê? Achou!" usando uma fraldinha para esconder seu rosto ou o dele.'],
 ARRAY['Jogue o "Cadê? Achou!" usando uma fraldinha para esconder seu rosto ou o dele.'],
 1, true),

-- 4-5 meses - Linguagem
('linguagem', 4, 5, 23,
 'Seu bebê emite sons como "aaa", "ga", "ba" com variações?',
 '🎉 Que fofura! Ele está praticando para falar!',
 '💡 Repita os sons e varie os tons de voz. É quase um dueto!',
 '💡 Narre o que está fazendo, mesmo sem resposta ainda.',
 ARRAY['Cante "Brilha, Brilha Estrelinha" e pare em algumas partes para ver se ele vocaliza junto.'],
 ARRAY['Cante "Brilha, Brilha Estrelinha" e pare em algumas partes para ver se ele vocaliza junto.'],
 ARRAY['Cante "Brilha, Brilha Estrelinha" e pare em algumas partes para ver se ele vocaliza junto.'],
 1, true),

-- 4-5 meses - Social Emocional
('social_emocional', 4, 5, 24,
 'Ele demonstra frustração se um brinquedo cai ou não alcança algo?',
 '🎉 Isso é ótimo! Ele já entende que quer algo e expressa isso.',
 '💡 Mostre empatia, diga "Está tudo bem, vamos tentar de novo!".',
 '💡 Deixe-o tentar alcançar, mas ajude com leveza quando necessário.',
 ARRAY['Ofereça um brinquedo um pouco distante e incentive com alegria o esforço para alcançar.'],
 ARRAY['Ofereça um brinquedo um pouco distante e incentive com alegria o esforço para alcançar.'],
 ARRAY['Ofereça um brinquedo um pouco distante e incentive com alegria o esforço para alcançar.'],
 1, true),

-- 4-5 meses - Autocuidado (Maternal Health)
('autocuidado', 4, 5, 25,
 'Você tem conseguido conversar com outras mães, familiares ou amigos?',
 '🎉 Isso é maravilhoso! Compartilhar fortalece e acolhe.',
 '💡 Entre em um grupo online ou presencial de mães.',
 '💡 Envie uma mensagem carinhosa para alguém do seu círculo.',
 ARRAY['Combine uma videochamada curta com alguém que te faz sorrir.'],
 ARRAY['Combine uma videochamada curta com alguém que te faz sorrir.'],
 ARRAY['Combine uma videochamada curta com alguém que te faz sorrir.'],
 2, true),

-- 5-6 meses - Motor Grosso
('motor_grosso', 5, 6, 26,
 'Seu bebê já segura objetos com as duas mãos ao mesmo tempo?',
 '🎉 Excelente! Ele está desenvolvendo coordenação e atenção conjunta.',
 '💡 Ofereça brinquedos fáceis de segurar e coloridos.',
 '💡 Mostre como segurar, demonstrando com suas próprias mãos.',
 ARRAY['Ofereça dois chocalhos, um para cada mão, e observe se ele tenta segurar os dois.'],
 ARRAY['Ofereça dois chocalhos, um para cada mão, e observe se ele tenta segurar os dois.'],
 ARRAY['Ofereça dois chocalhos, um para cada mão, e observe se ele tenta segurar os dois.'],
 1, true),

-- 5-6 meses - Cognitivo
('cognitivo', 5, 6, 27,
 'Ele observa atentamente quando algo cai ou desaparece?',
 '🎉 Ótimo sinal! Ele já sabe que o mundo não some quando some da vista!',
 '💡 Brinque de esconder objetos parcialmente com panos.',
 '💡 Diga onde o objeto está escondido e ajude a encontrar.',
 ARRAY['Esconda um brinquedo sob um paninho e pergunte: "Cadê?" Incentive ele a procurar!'],
 ARRAY['Esconda um brinquedo sob um paninho e pergunte: "Cadê?" Incentive ele a procurar!'],
 ARRAY['Esconda um brinquedo sob um paninho e pergunte: "Cadê?" Incentive ele a procurar!'],
 1, true),

-- 5-6 meses - Linguagem
('linguagem', 5, 6, 28,
 'Seu bebê parece reagir ao ouvir seu nome?',
 '🎉 Que esperto! Ele já reconhece que você está chamando ele.',
 '💡 Fale o nome sempre com entonação alegre e positiva.',
 '💡 Associe o nome com ações: "João, vem com a mamãe!"',
 ARRAY['Chame o nome dele de diferentes direções e veja se ele vira o rostinho.'],
 ARRAY['Chame o nome dele de diferentes direções e veja se ele vira o rostinho.'],
 ARRAY['Chame o nome dele de diferentes direções e veja se ele vira o rostinho.'],
 1, true),

-- 5-6 meses - Social Emocional
('social_emocional', 5, 6, 29,
 'Ele ri ou vocaliza alto quando está feliz?',
 '🎉 Que delícia! O riso é o sinal de que ele está se divertindo e se sentindo seguro.',
 '💡 Brinque com sons, cócegas e expressões exageradas.',
 '💡 Continue interagindo com alegria. O humor também se aprende!',
 ARRAY['Faça cócegas leves dizendo "cadê o pezinho?", "achou!" e observe o riso.'],
 ARRAY['Faça cócegas leves dizendo "cadê o pezinho?", "achou!" e observe o riso.'],
 ARRAY['Faça cócegas leves dizendo "cadê o pezinho?", "achou!" e observe o riso.'],
 1, true),

-- 5-6 meses - Autocuidado (Maternal Health)
('autocuidado', 5, 6, 30,
 'Você sente que tem conseguido equilibrar momentos com o bebê e momentos só seus?',
 '🎉 Maravilha! Esse equilíbrio é essencial para o bem-estar de ambos.',
 '💡 Peça ajuda para garantir momentos só seus.',
 '💡 Planeje pausas semanais com coisas que recarregam sua energia emocional.',
 ARRAY['Escreva 3 coisas simples que gostaria de fazer por você nesta semana e tente realizar pelo menos uma.'],
 ARRAY['Escreva 3 coisas simples que gostaria de fazer por você nesta semana e tente realizar pelo menos uma.'],
 ARRAY['Escreva 3 coisas simples que gostaria de fazer por você nesta semana e tente realizar pelo menos uma.'],
 2, true);