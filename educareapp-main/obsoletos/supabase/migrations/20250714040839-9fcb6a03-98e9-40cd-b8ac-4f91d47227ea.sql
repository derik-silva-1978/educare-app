-- Inserir perguntas para faixa 6-7 meses (semana 7)
INSERT INTO journey_bot_questions (
  dimension, 
  age_min_months, 
  age_max_months, 
  order_index, 
  question_text, 
  feedback_yes, 
  feedback_no, 
  feedback_unknown,
  tips_yes,
  tips_no,
  tips_unknown,
  active
) VALUES
-- Motor grosso - 6-7 meses
('motor_grosso', 6, 7, 1, 
 'Seu bebê já consegue se sentar com pouco ou nenhum apoio?',
 '🎉 Que avanço! Ele está conquistando mais autonomia e equilíbrio!',
 '💡 Continue estimulando o tempo no chão com segurança e supervisão.',
 '💡 Sente o bebê com almofadas ao redor e brinquedos ao alcance.',
 ARRAY['Sentar com estabilidade fortalece o tronco e permite explorar com as mãos.', 'Monte um "cantinho de exploração" com almofadas firmes e brinquedos variados ao alcance das mãos.'],
 ARRAY['Sentar com estabilidade fortalece o tronco e permite explorar com as mãos.', 'Monte um "cantinho de exploração" com almofadas firmes e brinquedos variados ao alcance das mãos.'],
 ARRAY['Sentar com estabilidade fortalece o tronco e permite explorar com as mãos.', 'Monte um "cantinho de exploração" com almofadas firmes e brinquedos variados ao alcance das mãos.'],
 true),

-- Cognitivo - 6-7 meses  
('cognitivo', 6, 7, 2,
 'Seu bebê demonstra surpresa ou curiosidade diante de sons ou objetos novos?',
 '🎉 Que bebê explorador! Ele está atento ao mundo ao redor!',
 '💡 Estimule a investigação em ambiente seguro e calmo.',
 '💡 Apresente novos brinquedos com sons diferentes e texturas variadas.',
 ARRAY['Curiosidade é um sinal de aprendizagem ativa e desenvolvimento da atenção.', 'Mostre um objeto diferente por dia (espelho, sino, pincel) e observe a reação dele.'],
 ARRAY['Curiosidade é um sinal de aprendizagem ativa e desenvolvimento da atenção.', 'Mostre um objeto diferente por dia (espelho, sino, pincel) e observe a reação dele.'],
 ARRAY['Curiosidade é um sinal de aprendizagem ativa e desenvolvimento da atenção.', 'Mostre um objeto diferente por dia (espelho, sino, pincel) e observe a reação dele.'],
 true),

-- Linguagem - 6-7 meses
('linguagem', 6, 7, 3,
 'Ele já faz sons repetitivos como ''ba-ba-ba'' ou ''ma-ma-ma''?',
 '🎉 Que lindo ouvir isso! Ele está brincando com a própria voz!',
 '💡 Use palavras simples como "mamãe", "papai", "água" apontando os objetos.',
 '💡 Reforce os sons que ele emite e associe a nomes ou objetos.',
 ARRAY['A repetição de sílabas é o início da comunicação verbal estruturada.', 'Brinque de imitar os sons do bebê: ele diz ''ba-ba'', você responde ''ba-ba-ba'', criando uma conversa divertida!'],
 ARRAY['A repetição de sílabas é o início da comunicação verbal estruturada.', 'Brinque de imitar os sons do bebê: ele diz ''ba-ba'', você responde ''ba-ba-ba'', criando uma conversa divertida!'],
 ARRAY['A repetição de sílabas é o início da comunicação verbal estruturada.', 'Brinque de imitar os sons do bebê: ele diz ''ba-ba'', você responde ''ba-ba-ba'', criando uma conversa divertida!'],
 true),

-- Social emocional - 6-7 meses
('social_emocional', 6, 7, 4,
 'Ele reage com empolgação quando vê rostos familiares?',
 '🎉 Que delícia! Ele está construindo conexões afetivas fortes!',
 '💡 Valorize momentos de afeto com toques, sorrisos e nomes.',
 '💡 Mantenha a rotina e o contato com pessoas queridas e cuidadoras.',
 ARRAY['Reconhecimento de rostos conhecidos é sinal de apego e vínculo afetivo.', 'Crie um ''álbum da família'' com fotos plastificadas ou impressas. Mostre os rostos e diga os nomes com alegria!'],
 ARRAY['Reconhecimento de rostos conhecidos é sinal de apego e vínculo afetivo.', 'Crie um ''álbum da família'' com fotos plastificadas ou impressas. Mostre os rostos e diga os nomes com alegria!'],
 ARRAY['Reconhecimento de rostos conhecidos é sinal de apego e vínculo afetivo.', 'Crie um ''álbum da família'' com fotos plastificadas ou impressas. Mostre os rostos e diga os nomes com alegria!'],
 true),

-- Autocuidado (maternal health) - 6-7 meses
('autocuidado', 6, 7, 5,
 'Você tem conseguido se alimentar bem e manter uma rotina mínima de cuidados com você?',
 '🎉 Muito bom! O seu equilíbrio ajuda a manter o do bebê também.',
 '💡 Deixe à vista alimentos práticos e nutritivos para facilitar seu cuidado.',
 '💡 Planeje lanches saudáveis e pausas rápidas entre as demandas.',
 ARRAY['A nutrição e o autocuidado da mãe/cuidador impactam diretamente o bem-estar do bebê.', 'Monte um ''kit autocuidado'' com snacks saudáveis, garrafinha de água, hidratante e um bilhete com palavras positivas. Use diariamente!'],
 ARRAY['A nutrição e o autocuidado da mãe/cuidador impactam diretamente o bem-estar do bebê.', 'Monte um ''kit autocuidado'' com snacks saudáveis, garrafinha de água, hidratante e um bilhete com palavras positivas. Use diariamente!'],
 ARRAY['A nutrição e o autocuidado da mãe/cuidador impactam diretamente o bem-estar do bebê.', 'Monte um ''kit autocuidado'' com snacks saudáveis, garrafinha de água, hidratante e um bilhete com palavras positivas. Use diariamente!'],
 true);

-- Inserir perguntas para faixa 7-8 meses (semana 8)
INSERT INTO journey_bot_questions (
  dimension, 
  age_min_months, 
  age_max_months, 
  order_index, 
  question_text, 
  feedback_yes, 
  feedback_no, 
  feedback_unknown,
  tips_yes,
  tips_no,
  tips_unknown,
  active
) VALUES
-- Motor grosso - 7-8 meses
('motor_grosso', 7, 8, 1,
 'Seu bebê já se arrasta, engatinha ou tenta se deslocar de algum modo?',
 '🎉 Uau! Que conquista maravilhosa! Ele está ganhando o mundo!',
 '💡 Dê tempo livre no chão com tapetes e supervisão constante.',
 '💡 Estimule em superfícies seguras, com brinquedos à frente como incentivo.',
 ARRAY['A locomoção autônoma marca a expansão da independência e da coordenação motora.', 'Crie um ''caminho sensorial'' com almofadas, brinquedos e espelhos para ele explorar com o corpo.'],
 ARRAY['A locomoção autônoma marca a expansão da independência e da coordenação motora.', 'Crie um ''caminho sensorial'' com almofadas, brinquedos e espelhos para ele explorar com o corpo.'],
 ARRAY['A locomoção autônoma marca a expansão da independência e da coordenação motora.', 'Crie um ''caminho sensorial'' com almofadas, brinquedos e espelhos para ele explorar com o corpo.'],
 true),

-- Cognitivo - 7-8 meses
('cognitivo', 7, 8, 2,
 'Seu bebê já procura por um brinquedo escondido parcialmente ou que caiu no chão?',
 '🎉 Que espertinho! Ele já entende que as coisas continuam existindo mesmo fora da vista.',
 '💡 Incentive a curiosidade com desafios simples e muita diversão.',
 '💡 Brinque de esconder brinquedos sob paninhos ou caixinhas.',
 ARRAY['Buscar objetos mostra compreensão de permanência — um marco cognitivo essencial.', 'Brinque de ''Cadê o urso?'' escondendo o brinquedo sob um paninho. Deixe que ele puxe para encontrar!'],
 ARRAY['Buscar objetos mostra compreensão de permanência — um marco cognitivo essencial.', 'Brinque de ''Cadê o urso?'' escondendo o brinquedo sob um paninho. Deixe que ele puxe para encontrar!'],
 ARRAY['Buscar objetos mostra compreensão de permanência — um marco cognitivo essencial.', 'Brinque de ''Cadê o urso?'' escondendo o brinquedo sob um paninho. Deixe que ele puxe para encontrar!'],
 true),

-- Linguagem - 7-8 meses
('linguagem', 7, 8, 3,
 'Ele responde quando você diz o nome dele?',
 '🎉 Muito bem! Ele já está reconhecendo quem ele é!',
 '💡 Repita o nome durante as brincadeiras e momentos do dia.',
 '💡 Fale o nome com voz alegre e associando a gestos e afeto.',
 ARRAY['Essa resposta mostra associação do som com identidade e atenção seletiva.', 'Chame o nome dele de pontos diferentes do ambiente e observe se ele vira para procurar você.'],
 ARRAY['Essa resposta mostra associação do som com identidade e atenção seletiva.', 'Chame o nome dele de pontos diferentes do ambiente e observe se ele vira para procurar você.'],
 ARRAY['Essa resposta mostra associação do som com identidade e atenção seletiva.', 'Chame o nome dele de pontos diferentes do ambiente e observe se ele vira para procurar você.'],
 true),

-- Social emocional - 7-8 meses
('social_emocional', 7, 8, 4,
 'Seu bebê demonstra ansiedade ou estranhamento com pessoas desconhecidas?',
 '🎉 Isso mostra que ele criou uma base de segurança afetiva!',
 '💡 Respeite os sinais de desconforto e acolha com afeto.',
 '💡 Apresente novas pessoas gradualmente, no colo ou próximo de você.',
 ARRAY['Essa reação é típica da fase e demonstra vínculo seguro com figuras conhecidas.', 'Apresente pessoas novas aos poucos, mantendo o bebê no colo, com falas suaves e objetos familiares por perto.'],
 ARRAY['Essa reação é típica da fase e demonstra vínculo seguro com figuras conhecidas.', 'Apresente pessoas novas aos poucos, mantendo o bebê no colo, com falas suaves e objetos familiares por perto.'],
 ARRAY['Essa reação é típica da fase e demonstra vínculo seguro com figuras conhecidas.', 'Apresente pessoas novas aos poucos, mantendo o bebê no colo, com falas suaves e objetos familiares por perto.'],
 true),

-- Autocuidado - 7-8 meses
('autocuidado', 7, 8, 5,
 'Você tem conseguido estabelecer limites para descansar ou cuidar do seu tempo?',
 '🎉 Parabéns! Isso mostra força e autoconhecimento.',
 '💡 Organize prioridades e negocie pausas com quem convive com você.',
 '💡 Pratique dizer ''hoje não posso'', sem culpa. Você também importa.',
 ARRAY['Saber dizer ''não'' e respeitar o próprio ritmo é essencial para o equilíbrio emocional e físico.', 'Crie uma ''agenda da pausa'': reserve ao menos 15 minutos por dia só para você. Avise à família e torne esse momento um compromisso de cuidado.'],
 ARRAY['Saber dizer ''não'' e respeitar o próprio ritmo é essencial para o equilíbrio emocional e físico.', 'Crie uma ''agenda da pausa'': reserve ao menos 15 minutos por dia só para você. Avise à família e torne esse momento um compromisso de cuidado.'],
 ARRAY['Saber dizer ''não'' e respeitar o próprio ritmo é essencial para o equilíbrio emocional e físico.', 'Crie uma ''agenda da pausa'': reserve ao menos 15 minutos por dia só para você. Avise à família e torne esse momento um compromisso de cuidado.'],
 true);

-- Inserir perguntas para faixa 8-9 meses (semana 9)
INSERT INTO journey_bot_questions (
  dimension, 
  age_min_months, 
  age_max_months, 
  order_index, 
  question_text, 
  feedback_yes, 
  feedback_no, 
  feedback_unknown,
  tips_yes,
  tips_no,
  tips_unknown,
  active
) VALUES
-- Motor grosso - 8-9 meses
('motor_grosso', 8, 9, 1,
 'Seu bebê consegue se apoiar para ficar de pé com ajuda de móveis ou de você?',
 '🎉 Incrível! Ele está se fortalecendo para caminhar!',
 '💡 Ofereça apoio com almofadas firmes, móveis seguros ou suas mãos.',
 '💡 Estimule com brinquedos em superfícies um pouco mais altas.',
 ARRAY['Ficar de pé com apoio mostra força nas pernas e preparação para os primeiros passos.', 'Crie um ''circuito'' com almofadas, sofás e objetos firmes para que ele possa se levantar com segurança.'],
 ARRAY['Ficar de pé com apoio mostra força nas pernas e preparação para os primeiros passos.', 'Crie um ''circuito'' com almofadas, sofás e objetos firmes para que ele possa se levantar com segurança.'],
 ARRAY['Ficar de pé com apoio mostra força nas pernas e preparação para os primeiros passos.', 'Crie um ''circuito'' com almofadas, sofás e objetos firmes para que ele possa se levantar com segurança.'],
 true),

-- Cognitivo - 8-9 meses
('cognitivo', 8, 9, 2,
 'Ele entende comandos simples como ''não'' ou ''vem cá''?',
 '🎉 Muito bem! Ele já está compreendendo o que você diz!',
 '💡 Dê tempo para ele responder aos comandos, mesmo que aos poucos.',
 '💡 Use frases curtas e consistentes, associadas a gestos.',
 ARRAY['Compreender comandos mostra evolução da linguagem receptiva e da atenção.', 'Diga ''cadê a bolinha?'' ou ''me dá o urso'' apontando o objeto, e comemore se ele tentar procurar!'],
 ARRAY['Compreender comandos mostra evolução da linguagem receptiva e da atenção.', 'Diga ''cadê a bolinha?'' ou ''me dá o urso'' apontando o objeto, e comemore se ele tentar procurar!'],
 ARRAY['Compreender comandos mostra evolução da linguagem receptiva e da atenção.', 'Diga ''cadê a bolinha?'' ou ''me dá o urso'' apontando o objeto, e comemore se ele tentar procurar!'],
 true),

-- Linguagem - 8-9 meses
('linguagem', 8, 9, 3,
 'Seu bebê já tenta imitar sons, gestos ou palavras que você faz?',
 '🎉 Isso é maravilhoso! Ele está aprendendo com você a se comunicar!',
 '💡 Repita os gestos e palavras simples em momentos do dia a dia.',
 '💡 Faça sons engraçados, palmas, beijos e espere ele tentar imitar.',
 ARRAY['A imitação é uma forma poderosa de aprendizado da linguagem e da interação social.', 'Faça caretas ou palminhas e diga: ''Faz igual ao papai/mamãe!''. Valorize qualquer tentativa de imitação com muito entusiasmo.'],
 ARRAY['A imitação é uma forma poderosa de aprendizado da linguagem e da interação social.', 'Faça caretas ou palminhas e diga: ''Faz igual ao papai/mamãe!''. Valorize qualquer tentativa de imitação com muito entusiasmo.'],
 ARRAY['A imitação é uma forma poderosa de aprendizado da linguagem e da interação social.', 'Faça caretas ou palminhas e diga: ''Faz igual ao papai/mamãe!''. Valorize qualquer tentativa de imitação com muito entusiasmo.'],
 true),

-- Social emocional - 8-9 meses
('social_emocional', 8, 9, 4,
 'Seu bebê demonstra preferência por alguns brinquedos ou pessoas?',
 '🎉 Que legal! Isso mostra que ele está criando vínculos e reconhecendo o que gosta!',
 '💡 Observe suas escolhas e ofereça espaço para ele explorar com segurança.',
 '💡 Dê nomes aos brinquedos e pessoas com quem ele convive para reforçar essa conexão.',
 ARRAY['Preferências indicam memória afetiva e vínculos em formação.', 'Ofereça dois brinquedos diferentes e observe qual ele escolhe. Diga: ''Você ama seu ursinho, né?'''],
 ARRAY['Preferências indicam memória afetiva e vínculos em formação.', 'Ofereça dois brinquedos diferentes e observe qual ele escolhe. Diga: ''Você ama seu ursinho, né?'''],
 ARRAY['Preferências indicam memória afetiva e vínculos em formação.', 'Ofereça dois brinquedos diferentes e observe qual ele escolhe. Diga: ''Você ama seu ursinho, né?'''],
 true),

-- Autocuidado - 8-9 meses
('autocuidado', 8, 9, 5,
 'Você tem conseguido celebrar pequenas conquistas do bebê e suas também?',
 '🎉 Isso é lindo! Reconhecer avanços fortalece o vínculo e a autoestima de ambos.',
 '💡 Valorize também o seu esforço! Cada passo é uma vitória sua também.',
 '💡 Registre momentos especiais num caderno ou app, mesmo que em poucas palavras.',
 ARRAY['Valorizar conquistas, mesmo pequenas, fortalece o vínculo e o bem-estar emocional.', 'Crie o ''momento conquista'': escolha 1 coisa do dia que o bebê aprendeu e 1 que você superou. Celebre com sorriso, foto ou um bilhetinho!'],
 ARRAY['Valorizar conquistas, mesmo pequenas, fortalece o vínculo e o bem-estar emocional.', 'Crie o ''momento conquista'': escolha 1 coisa do dia que o bebê aprendeu e 1 que você superou. Celebre com sorriso, foto ou um bilhetinho!'],
 ARRAY['Valorizar conquistas, mesmo pequenas, fortalece o vínculo e o bem-estar emocional.', 'Crie o ''momento conquista'': escolha 1 coisa do dia que o bebê aprendeu e 1 que você superou. Celebre com sorriso, foto ou um bilhetinho!'],
 true);