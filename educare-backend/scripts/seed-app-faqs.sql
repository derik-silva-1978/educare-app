-- Seed Data: FAQ Dinâmica Contextual (app_faqs)
-- Status: Safe (INSERT ... ON CONFLICT DO NOTHING para idempotência)
-- Data: Dezembro 2025
-- Descrição: 35 FAQs distribuídas em 3 períodos (0-4, 4-12, 12-24 semanas)
-- Balanceamento: 60% foco Bebê, 40% foco Mãe

BEGIN;

-- Deletar FAQs seed existentes (opcional - comentar se não desejar)
-- DELETE FROM app_faqs WHERE is_seed = TRUE;

-- PERÍODO 1: 0-4 semanas (Recém-nascido)
INSERT INTO app_faqs (category, question_text, answer_rag_context, min_week, max_week, is_seed, usage_count, upvotes, downvotes)
VALUES
  ('child', 'Meu bebê chora muito à noite', 'Recém-nascidos choram como forma de comunicação. Pode ser fome, desconforto ou cólica.', 0, 4, TRUE, 0, 0, 0),
  ('child', 'Como saber se meu bebê está comendo o suficiente?', 'Sinais de que o bebê está satisfeito: ganha peso, faz xixi e cocô regularmente, dorme após mamar.', 0, 4, TRUE, 0, 0, 0),
  ('child', 'Qual é a posição correta para dormir?', 'Bebês devem dormir de costas em superfície firme para reduzir risco de SIDS.', 0, 4, TRUE, 0, 0, 0),
  ('child', 'Meu bebê tem refluxo, o que fazer?', 'Manter bebê na vertical após mamar, usar travesseiro elevado, oferecer refeições menores e frequentes.', 0, 4, TRUE, 0, 0, 0),
  ('child', 'O cordão umbilical ainda não caiu, está normal?', 'Normal cair entre 7-14 dias. Se não cair, mantém higiene e consulta pediatra se houver sinais de infecção.', 0, 4, TRUE, 0, 0, 0),
  
  ('mother', 'Estou muito cansada após o parto', 'Cansaço pós-parto é normal. Busca ajuda com tarefas domésticas, descansa quando bebê dorme, comunica ao obstetra.', 0, 4, TRUE, 0, 0, 0),
  ('mother', 'Tenho dúvidas sobre amamentação', 'Procura consultora de lactação, liga para "disque lactação", participa de grupos de apoio ao aleitamento.', 0, 4, TRUE, 0, 0, 0),
  ('mother', 'Sinto-me triste e ansiosa após o nascimento', 'Possível depressão pós-parto ou puerpério. Fala com médico, procura apoio emocional, não é fraqueza.', 0, 4, TRUE, 0, 0, 0),
  ('mother', 'Quando posso retomar atividades sexuais?', 'Após avaliação médica (6 semanas). Comunica com parceiro, não há pressa, retorno gradual é normal.', 0, 4, TRUE, 0, 0, 0),

-- PERÍODO 2: 4-12 semanas (Primeiros meses)
  ('child', 'Meu bebê tem cólicas, o que ajuda?', 'Massagem na barriguinha, posições diferentes, temperatura morna, sons rítmicos podem aliviar cólicas.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Quando começa a sorrir e reconhecer pessoas?', 'Sorrisos sociais começam por volta de 6-8 semanas. Reconhece vozes e começa a seguir objetos.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Meu bebê ainda não sustenta a cabeça bem', 'Desenvolvimento normal. Oferece tummy time (barriguinha para baixo) diariamente para fortalecer pescoço.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Como saber se a febre é perigosa?', 'Busca pediatra se febre > 38.5°C, se comportamento muda muito ou se dura mais de 3 dias.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Meu bebê tem eczema/ressecamento de pele', 'Use hidratantes suaves, banho morno, roupas de algodão. Se piora, pediatra pode prescrever pomada.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Quando começar tummy time?', 'Desde primeiros dias em pequenos períodos (1-2 min). Aumenta gradualmente conforme bebê cresce.', 4, 12, TRUE, 0, 0, 0),
  ('child', 'Meu bebê não dorme durante o dia', 'Newborns dormem muito. Se não dorme nada, verifica conforto, temperatura, possível dor ou fome.', 4, 12, TRUE, 0, 0, 0),
  
  ('mother', 'Quando posso voltar a trabalhar?', 'Depende da legislação local. Planeja transição gradual, comunica com empregador, considera opções de flexibilidade.', 4, 12, TRUE, 0, 0, 0),
  ('mother', 'Tenho pouco apoio, como lidar?', 'Procura grupos de mães, apps de comunidade, terapia se necessário. Pede ajuda quando possível, delega tarefas.', 4, 12, TRUE, 0, 0, 0),
  ('mother', 'Como mantém energia para cuidar do bebê?', 'Prioriza sono, hidratação, refeições regulares. Pede parceiro para "turno noturno" alguns dias na semana.', 4, 12, TRUE, 0, 0, 0),

-- PERÍODO 3: 12-24 semanas (4-6 meses)
  ('child', 'Quando começar a introduzir sólidos?', 'Por volta de 6 meses (24 semanas) quando bebê senta com apoio e mostra interesse por comida.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Meu bebê ainda não senta sozinho', 'Desenvolvimento normal. Oferece apoio, coloca em posição semi-sentada, fortalecerá gradualmente.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Ele está começando a rolar, é seguro?', 'Sim, é marco importante. Coloca em superfícies seguras, nunca deixa sozinho em altura, supervision constante.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Meu bebê quer tudo na boca, é normal?', 'Completamente normal! Está explorando mundo e aliviando incômodo de dentes. Oferece brinquedos seguros de roer.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Quando cortam o cabelo do bebê pela primeira vez?', 'Sem pressa. Pode cortar quando preferir, não há regra fixa. Alguns esperam 1 ano, outros cortam antes.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Meu bebê dorme pouco ainda, é preocupante?', 'Verificar se dorme total 14-17 horas/dia. Se menos, consulta pediatra. Pode ser normal ou indicar desconforto.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Que brinquedos são adequados nesta idade?', 'Brinquedos que estimulam: espelhos, chocalhos, bolas coloridas, livros de pano. Seguro sem peças pequenas.', 12, 24, TRUE, 0, 0, 0),
  ('child', 'Meu bebê está atrasado no desenvolvimento?', 'Cada bebê desenvolve no seu ritmo. Consulta pediatra se há preocupações específicas ou atraso muito significativo.', 12, 24, TRUE, 0, 0, 0),
  
  ('mother', 'Sinto culpa por não poder ficar sempre com bebê', 'Culpa é comum mas não produtiva. Mãe saudável = bebê saudável. Tempo de qualidade importa mais que quantidade.', 12, 24, TRUE, 0, 0, 0),
  ('mother', 'Como equilibra trabalho e maternidade?', 'Não há fórmula perfeita. Ajusta expectativas, busca apoio, comunica limites, prioriza o que importa.', 12, 24, TRUE, 0, 0, 0),
  ('mother', 'Meu leite está acabando, quando parar?', 'Desmame pode ser gradual. Reduz frequências, substitui por sólidos ou fórmula. Consulta consultora lactação.', 12, 24, TRUE, 0, 0, 0),
  ('mother', 'Tenho ansiedade sobre educação do bebê', 'Normal e comum. Foca em amar e responder às necessidades. Técnicas parentais vêm depois, o resto segue.', 12, 24, TRUE, 0, 0, 0),
  ('mother', 'Como criar rotina com bebê tão pequeno?', 'Começa com padrões simples: observa sinais, agrupa atividades (fralda, banho, amamentação), gradualmente mais estruturado.', 12, 24, TRUE, 0, 0, 0),

ON CONFLICT DO NOTHING;

COMMIT;
