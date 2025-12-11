/**
 * Script para popular dados seed das FAQs
 * Uso: node src/scripts/seedFaqData.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const AppFaq = require('../models/AppFaq');

const seedFaqs = [
  { category: 'child', question_text: 'Meu bebê chora muito à noite', answer_rag_context: 'Recém-nascidos choram como forma de comunicação. Pode ser fome, desconforto ou cólica.', min_week: 0, max_week: 4 },
  { category: 'child', question_text: 'Como saber se meu bebê está comendo o suficiente?', answer_rag_context: 'Sinais de que o bebê está satisfeito: ganha peso, faz xixi e cocô regularmente, dorme após mamar.', min_week: 0, max_week: 4 },
  { category: 'child', question_text: 'Qual é a posição correta para dormir?', answer_rag_context: 'Bebês devem dormir de costas em superfície firme para reduzir risco de SIDS.', min_week: 0, max_week: 4 },
  { category: 'child', question_text: 'Meu bebê tem refluxo, o que fazer?', answer_rag_context: 'Manter bebê na vertical após mamar, usar travesseiro elevado, oferecer refeições menores e frequentes.', min_week: 0, max_week: 4 },
  { category: 'child', question_text: 'O cordão umbilical ainda não caiu, está normal?', answer_rag_context: 'Normal cair entre 7-14 dias. Se não cair, mantém higiene e consulta pediatra se houver sinais de infecção.', min_week: 0, max_week: 4 },
  
  { category: 'mother', question_text: 'Estou muito cansada após o parto', answer_rag_context: 'Cansaço pós-parto é normal. Busca ajuda com tarefas domésticas, descansa quando bebê dorme, comunica ao obstetra.', min_week: 0, max_week: 4 },
  { category: 'mother', question_text: 'Tenho dúvidas sobre amamentação', answer_rag_context: 'Procura consultora de lactação, liga para disque lactação, participa de grupos de apoio ao aleitamento.', min_week: 0, max_week: 4 },
  { category: 'mother', question_text: 'Sinto-me triste e ansiosa após o nascimento', answer_rag_context: 'Possível depressão pós-parto ou puerpério. Fala com médico, procura apoio emocional, não é fraqueza.', min_week: 0, max_week: 4 },
  { category: 'mother', question_text: 'Quando posso retomar atividades sexuais?', answer_rag_context: 'Após avaliação médica (6 semanas). Comunica com parceiro, não há pressa, retorno gradual é normal.', min_week: 0, max_week: 4 },

  { category: 'child', question_text: 'Meu bebê tem cólicas, o que ajuda?', answer_rag_context: 'Massagem na barriguinha, posições diferentes, temperatura morna, sons rítmicos podem aliviar cólicas.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Quando começa a sorrir e reconhecer pessoas?', answer_rag_context: 'Sorrisos sociais começam por volta de 6-8 semanas. Reconhece vozes e começa a seguir objetos.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Meu bebê ainda não sustenta a cabeça bem', answer_rag_context: 'Desenvolvimento normal. Oferece tummy time (barriguinha para baixo) diariamente para fortalecer pescoço.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Como saber se a febre é perigosa?', answer_rag_context: 'Busca pediatra se febre > 38.5°C, se comportamento muda muito ou se dura mais de 3 dias.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Meu bebê tem eczema/ressecamento de pele', answer_rag_context: 'Use hidratantes suaves, banho morno, roupas de algodão. Se piora, pediatra pode prescrever pomada.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Quando começar tummy time?', answer_rag_context: 'Desde primeiros dias em pequenos períodos (1-2 min). Aumenta gradualmente conforme bebê cresce.', min_week: 4, max_week: 12 },
  { category: 'child', question_text: 'Meu bebê não dorme durante o dia', answer_rag_context: 'Newborns dormem muito. Se não dorme nada, verifica conforto, temperatura, possível dor ou fome.', min_week: 4, max_week: 12 },
  
  { category: 'mother', question_text: 'Quando posso voltar a trabalhar?', answer_rag_context: 'Depende da legislação local. Planeja transição gradual, comunica com empregador, considera opções de flexibilidade.', min_week: 4, max_week: 12 },
  { category: 'mother', question_text: 'Tenho pouco apoio, como lidar?', answer_rag_context: 'Procura grupos de mães, apps de comunidade, terapia se necessário. Pede ajuda quando possível, delega tarefas.', min_week: 4, max_week: 12 },
  { category: 'mother', question_text: 'Como mantém energia para cuidar do bebê?', answer_rag_context: 'Prioriza sono, hidratação, refeições regulares. Pede parceiro para turno noturno alguns dias na semana.', min_week: 4, max_week: 12 },

  { category: 'child', question_text: 'Quando começar a introduzir sólidos?', answer_rag_context: 'Por volta de 6 meses (24 semanas) quando bebê senta com apoio e mostra interesse por comida.', min_week: 12, max_week: 24 },
  { category: 'child', question_text: 'Meu bebê ainda não senta sozinho', answer_rag_context: 'Desenvolvimento normal. Oferece apoio, coloca em posição semi-sentada, fortalecerá gradualmente.', min_week: 12, max_week: 24 },
  { category: 'child', question_text: 'Ele está começando a rolar, é seguro?', answer_rag_context: 'Sim, é marco importante. Coloca em superfícies seguras, nunca deixa sozinho em altura, supervision constante.', min_week: 12, max_week: 24 },
  { category: 'child', question_text: 'Meu bebê quer tudo na boca, é normal?', answer_rag_context: 'Completamente normal! Está explorando mundo e aliviando incômodo de dentes. Oferece brinquedos seguros de roer.', min_week: 12, max_week: 24 },
  { category: 'child', question_text: 'Quando cortam o cabelo do bebê pela primeira vez?', answer_rag_context: 'Sem pressa. Pode cortar quando preferir, não há regra fixa. Alguns esperam 1 ano, outros cortam antes.', min_week: 12, max_week: 24 },
  
  { category: 'mother', question_text: 'Sinto culpa por não poder ficar sempre com bebê', answer_rag_context: 'Culpa é comum mas não produtiva. Mãe saudável = bebê saudável. Tempo de qualidade importa mais que quantidade.', min_week: 12, max_week: 24 },
  { category: 'mother', question_text: 'Como equilibra trabalho e maternidade?', answer_rag_context: 'Não há fórmula perfeita. Ajusta expectativas, busca apoio, comunica limites, prioriza o que importa.', min_week: 12, max_week: 24 },
  
  // Semana 0-4: FAQs adicionais para completar especificação
  { category: 'mother', question_text: 'Como cuidar dos pontos da episiotomia ou cesariana?', answer_rag_context: 'Higiene com água morna, evita infeccionar, secagem suave, repousa bem. Procura médico se sinais de infecção.', min_week: 0, max_week: 4 },
  { category: 'mother', question_text: 'É normal ter sangramento abundante pós-parto?', answer_rag_context: 'Sangramento intenso nos primeiros dias é normal. Reduz gradualmente. Avisa médico se aumenta ou tem odor.', min_week: 0, max_week: 4 },
  
  // Semana 4-12: FAQs adicionais
  { category: 'mother', question_text: 'Como lidar com hormônios flutuantes e irritabilidade?', answer_rag_context: 'Hormônios mudam rapidamente pós-parto. Comunicação com parceiro, tempo para si, ajuda profissional se persiste.', min_week: 4, max_week: 12 },
  { category: 'mother', question_text: 'Posso amamentar se estou tomando medicação?', answer_rag_context: 'Maioria dos medicamentos é segura na amamentação. Consulta pediatra e obstetra, eles orientam sobre compatibilidade.', min_week: 4, max_week: 12 },
  { category: 'mother', question_text: 'Quando voltar a fazer exercícios e atividades físicas?', answer_rag_context: 'Após 6 semanas e aprovação médica. Começa com exercícios leves, caminhadas, fortalecimento gradual.', min_week: 4, max_week: 12 },
  
  // Semana 12-24: FAQs adicionais
  { category: 'mother', question_text: 'Como preparar-se para desmamar gradualmente?', answer_rag_context: 'Começa removendo uma mamada por vez a cada 3-5 dias. Oferece alternativas (leite artificial), acompanha desconforto físico.', min_week: 12, max_week: 24 },
  { category: 'mother', question_text: 'Sinto que estou perdendo minha identidade', answer_rag_context: 'Comum durante transição à maternidade. Reserva tempo para hobbies, hobby, amigos. Identidade mãe + pessoa coexistem.', min_week: 12, max_week: 24 },
  
  // FAQs child adicionais para atingir especificação 35+
  { category: 'child', question_text: 'Quando começam os primeiros dentes a nascer?', answer_rag_context: 'Geralmente entre 4-7 meses. Sinais: babação, coceira nas gengivas, inchaço. Mordedor frio ajuda.', min_week: 16, max_week: 26 },
  { category: 'child', question_text: 'Como reconhecer e aliviar cólicas de gases?', answer_rag_context: 'Gases causam desconforto abdominal. Oferece posições diferentes, massagem circular no abdômen, bactérias probióticas orientadas.', min_week: 4, max_week: 12 },
  
  // Semana 26-52 (6-12 meses)
  { category: 'child', question_text: 'Meu bebê engatinha, mas algumas crianças não engatinham. É preocupante?', answer_rag_context: 'Nem todo bebê engatinha. Alguns pulam essa fase. O importante é que explore e se mova. Avalia pediatra se muito sedentário.', min_week: 26, max_week: 52 },
  { category: 'child', question_text: 'Como oferecer água ao bebê enquanto ainda amamenta?', answer_rag_context: 'Ofereça água em copo ou colher durante refeições. Pequenas quantidades, sem forçar. Leite materno ainda é principal.', min_week: 26, max_week: 52 },
  { category: 'child', question_text: 'Quantas refeições sólidas por dia aos 8 meses?', answer_rag_context: 'Começar com 1-2 vezes, aumentar para 3 refeições aos 9-10 meses. Ofereça variedade de texturas e sabores.', min_week: 26, max_week: 52 },
  { category: 'child', question_text: 'Como lidar com alergias alimentares no bebê?', answer_rag_context: 'Introduz alimentos novos um por vez, espera 3-5 dias. Sinais: coceira, inchação, dificuldade respirar. Procura pediatra.', min_week: 26, max_week: 52 },
  { category: 'child', question_text: 'Quantos dentes meu bebê deve ter aos 12 meses?', answer_rag_context: 'Varia muito: pode ter 0 a 8 dentes. Desenvolvimento dental é muito individual. Não é atraso se chegar mais tarde.', min_week: 26, max_week: 52 },
  { category: 'child', question_text: 'Como desestimular o uso de chupeta?', answer_rag_context: 'Não há pressa. Maioria deixa entre 2-4 anos. Pode oferecer gradualmente menos ou usar técnicas de redução lenta.', min_week: 26, max_week: 52 },
  
  { category: 'mother', question_text: 'Como manter a amamentação enquanto introduz sólidos?', answer_rag_context: 'Continua amamentando normalmente. Sólidos complementam, não substituem. Ofereça peito antes dos sólidos inicialmente.', min_week: 26, max_week: 52 },
  { category: 'mother', question_text: 'Quando é seguro deixar bebê com babá ou avós?', answer_rag_context: 'Depende da confiança e preparação. Muitos esperam 6+ meses. Deixe instruções claras, comece com períodos curtos.', min_week: 26, max_week: 52 },
  { category: 'mother', question_text: 'Como recuperar intimidade com parceiro pós-parto?', answer_rag_context: 'Comunicação é essencial. Cansaço é normal. Comece devagar, peça ajuda com bebê para momentos de casal.', min_week: 26, max_week: 52 },
  { category: 'mother', question_text: 'Tenho ansiedade ao deixar bebê com outras pessoas', answer_rag_context: 'Ansiedade de separação é comum. Comece com ausências curtas, confie em quem cuida, progressivamente aumente tempo.', min_week: 26, max_week: 52 },
  
  // Semana 52-104 (1-2 anos)
  { category: 'child', question_text: 'Meu filho não come bem, como oferecer alimentos mais interessantes?', answer_rag_context: 'Oferece alimentos coloridos, envolve em preparação, come junto. Respeita preferências mas continua oferecendo novos.', min_week: 52, max_week: 104 },
  { category: 'child', question_text: 'Quando devo esperar as primeiras palavras?', answer_rag_context: 'Entre 12-18 meses geralmente. Fala com bebê frequentemente, aponta objetos, lê histórias. Atraso relativo pode ser normal.', min_week: 52, max_week: 104 },
  { category: 'child', question_text: 'Como lidar com birras e comportamentos desafiadores?', answer_rag_context: 'Birras são normais nesta idade. Mantenha calma, estabeleça limites consistentes, oferece conforto quando termina.', min_week: 52, max_week: 104 },
  { category: 'child', question_text: 'Meu filho caiu e bateu a cabeça, devo procurar hospital?', answer_rag_context: 'Procure se: perda de consciência, vômito persistente, convulsão, sangramento. Se apenas bump, observe por 24h.', min_week: 52, max_week: 104 },
  { category: 'child', question_text: 'Como começar o treinamento para usar o banheiro?', answer_rag_context: 'Aguarde sinais de prontidão (18-36 meses). Criança deve demonstrar interesse e controle. Paciência e consistência.', min_week: 52, max_week: 104 },
  { category: 'child', question_text: 'Quantas horas de sono meu filho de 1-2 anos precisa?', answer_rag_context: 'Cerca de 11-14 horas por dia. Geralmente 1 cochilo diurno e 10-11 horas noturnas. Rotina consistente ajuda.', min_week: 52, max_week: 104 },
  
  { category: 'mother', question_text: 'Como lidar com esgotamento emocional na maternidade?', answer_rag_context: 'Normal sentir-se esgotada. Pede apoio, delega tarefas, cuida da saúde mental. Terapia é válida e recomendada.', min_week: 52, max_week: 104 },
  { category: 'mother', question_text: 'Posso ter outro filho enquanto ainda estou amamentando?', answer_rag_context: 'Sim, é possível. A amamentação pode reduzir fertilidade mas não é contraceptivo. Planeja conforme desejo familiar.', min_week: 52, max_week: 104 },
  { category: 'mother', question_text: 'Como gerenciar volta ao trabalho em tempo integral?', answer_rag_context: 'Organize cuidador confiável, expresse leite se deseja continuar amamentando, foque em qualidade do tempo com filho.', min_week: 52, max_week: 104 },
  { category: 'mother', question_text: 'Sinto culpa ao priorizar minha carreira', answer_rag_context: 'Mãe realizada é melhor para filho. Trabalho oferece satisfação pessoal, identidade. Cuidado compartilhado é saudável.', min_week: 52, max_week: 104 },
  
  // Semana 104-156 (2-3 anos)
  { category: 'child', question_text: 'Meu filho é muito tímido com estranhos, é preocupante?', answer_rag_context: 'Timidez é temperamento. Exponha gradualmente a novas situações, valide sentimentos, nunca force interação social.', min_week: 104, max_week: 156 },
  { category: 'child', question_text: 'Como ensinar compartilhamento sem forçar?', answer_rag_context: 'Compartilhamento é habilidade que se desenvolve. Modela, oferece rodízio de brinquedos, premia comportamentos generosos.', min_week: 104, max_week: 156 },
  { category: 'child', question_text: 'Meu filho agora fala muito, quando procuro fonoaudiólogo?', answer_rag_context: 'Se aos 3 anos tem dificuldade significativa em ser entendido ou perda auditiva, consulte especialista.', min_week: 104, max_week: 156 },
  { category: 'child', question_text: 'Como preparar para entrada na creche ou pré-escola?', answer_rag_context: 'Visite local, converse sobre experiência positiva, mantenha rotina, diga que voltará, deixe objeto confortável.', min_week: 104, max_week: 156 },
  { category: 'child', question_text: 'Seu filho tem medos normais ou fobias?', answer_rag_context: 'Medos são normais nesta idade (escuro, animais). Valide sentimento, ofereça segurança, exponha gradualmente.', min_week: 104, max_week: 156 },
  
  { category: 'mother', question_text: 'Como encontrar balanço entre disciplina e compaixão?', answer_rag_context: 'Disciplina é ensino, não punição. Estabeleça limites claros, seja consistente, sempre ofereça respeito e amor.', min_week: 104, max_week: 156 },
  { category: 'mother', question_text: 'Tenho dificuldade em dizer não, como melhorar?', answer_rag_context: 'Praticar dizer não firmemente mas amorosamente. Filho precisa de limites para se sentir seguro. Você faz bem em estabelecê-los.', min_week: 104, max_week: 156 },
  { category: 'mother', question_text: 'Como comparação com outras mães me afeta?', answer_rag_context: 'Comparação rouба alegria. Seu filho é único, tem seu próprio ritmo. Foque em progresso próprio, não competição.', min_week: 104, max_week: 156 },
  
  // Semana 156-208 (3-4 anos)
  { category: 'child', question_text: 'Meu filho ainda molha a cama à noite, é normal?', answer_rag_context: 'Muito normal até aos 5-6 anos. Não puna. Use fraldas noturnas, limite líquidos antes de dormir, ofereça apoio.', min_week: 156, max_week: 208 },
  { category: 'child', question_text: 'Como estimular a criatividade e imaginação?', answer_rag_context: 'Ofereça materiais abertos (blocos, arte), tempo livre para brincar, leia muito. Criatividade floresce em ambiente seguro.', min_week: 156, max_week: 208 },
  { category: 'child', question_text: 'Meu filho é muito ativo, pode ser TDAH?', answer_rag_context: 'Atividade excessiva é normal aos 3-4 anos. TDAH é diagnosticado depois dos 6 anos geralmente. Ofereça atividades e movimento.', min_week: 156, max_week: 208 },
  { category: 'child', question_text: 'Como lidar com agressão ou comportamento violento?', answer_rag_context: 'Comum nesta idade, especialmente se não consegue expressar emoções. Ensina palavras para sentimentos, oferece alternativas.', min_week: 156, max_week: 208 },
  { category: 'child', question_text: 'Quando começar a ler com meu filho?', answer_rag_context: 'Nunca é cedo demais! Leia desde bebê. Aos 3-4 anos, criança pode começar a reconhecer letras e sons.', min_week: 156, max_week: 208 },
  
  { category: 'mother', question_text: 'Como preparar-se para irmão ou irmã chegar?', answer_rag_context: 'Converse sobre mudanças, envolva na preparação, valide sentimentos de inveja. Mantenha rotinas, ofereça atenção especial.', min_week: 156, max_week: 208 },
  { category: 'mother', question_text: 'Estou tendo outro filho, como explicar para o atual?', answer_rag_context: 'Usa livros, conversas honestas adaptadas à idade. Explica que precisará compartilhar você mas o amor não diminui.', min_week: 156, max_week: 208 },
  
  // Semana 208-260 (4-5 anos)
  { category: 'child', question_text: 'Meu filho começa a fazer perguntas sobre a morte', answer_rag_context: 'Normal e saudável. Responde com verdade adaptada à idade. Oferece conforto, aborda com calma e honestidade.', min_week: 208, max_week: 260 },
  { category: 'child', question_text: 'Como preparar para entrada no ensino fundamental?', answer_rag_context: 'Visite escola, leia livros sobre tema, desenvolva independência (usar banheiro, comer sozinho), ofereça segurança emocional.', min_week: 208, max_week: 260 },
  { category: 'child', question_text: 'Meu filho tem dificuldade de atenção em tarefas', answer_rag_context: 'Capacidade de atenção ainda limitada. Quebra tarefas em passos pequenos, oferece recompensas, minimiza distrações.', min_week: 208, max_week: 260 },
  { category: 'child', question_text: 'Como lidar com mentiras nesta idade?', answer_rag_context: 'Mentiras não significam mau caráter. Ensin diferença entre fantasia e realidade, premia honestidade, modelá verdade.', min_week: 208, max_week: 260 },
  
  { category: 'mother', question_text: 'Tenho dúvidas sobre educação sexual infantil', answer_rag_context: 'Use nomes corretos para partes do corpo desde cedo. Responda perguntas com verdade simples. Proteja privacidade e consent.', min_week: 208, max_week: 260 },
  { category: 'mother', question_text: 'Como estabelecer regras e consequências consistentes?', answer_rag_context: 'Regras devem ser claras, justas, consistentes. Consequências lógicas e relacionadas ao comportamento. Explique o porquê.', min_week: 208, max_week: 260 },
  
  // Semana 260-312 (5-6 anos)
  { category: 'child', question_text: 'Meu filho está se comparando com outras crianças', answer_rag_context: 'Normal em idade escolar. Reforce qualidades únicas, comparação não é negativa se usada para aprendizado positivo.', min_week: 260, max_week: 312 },
  { category: 'child', question_text: 'Como ajudar em dificuldades de aprendizagem?', answer_rag_context: 'Observe padrões, comunique com professor, procure avaliação se suspeita dificuldade específica. Apoie sem pressão.', min_week: 260, max_week: 312 },
  { category: 'child', question_text: 'Meu filho quer sempre estar comigo, é dependência?', answer_rag_context: 'Até aos 6 anos é normal buscar proximidade. Oferece segurança, gradualmente encoraja independência através de brincadeiras.', min_week: 260, max_week: 312 },
  { category: 'child', question_text: 'Como lidar com amizades e conflitos sociais?', answer_rag_context: 'Ajuda a resolver conflitos conversando, ensina comunicação não-agressiva, oferece apoio emocional em rejeições.', min_week: 260, max_week: 312 },
  
  { category: 'mother', question_text: 'Como manter parenting consistente com parceiro?', answer_rag_context: 'Converse sobre valores, expectativas, disciplina. Apoiem-se mutuamente, apresentem frente unida, resolvam desacordos em privado.', min_week: 260, max_week: 312 },
  { category: 'mother', question_text: 'Sinto que estou perdendo a relação com meu filho à medida que cresce', answer_rag_context: 'Relacionamento evolui à medida que criança cresce. Mantenha conversas, mostre interesse genuíno, seja disponível e conectada.', min_week: 260, max_week: 312 }
];

async function seedFaqData() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
    
    console.log(`\nInserindo ${seedFaqs.length} FAQs...`);
    
    for (const faq of seedFaqs) {
      await AppFaq.create({
        ...faq,
        is_seed: true,
        usage_count: 0,
        upvotes: 0,
        downvotes: 0
      });
    }
    
    console.log(`\n✅ ${seedFaqs.length} FAQs inseridas com sucesso!`);
    
    const count = await AppFaq.count();
    console.log(`Total de FAQs no banco: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inserir FAQs:', error);
    process.exit(1);
  }
}

seedFaqData();
