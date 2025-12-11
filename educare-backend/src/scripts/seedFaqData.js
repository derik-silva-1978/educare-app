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
  { category: 'child', question_text: 'Como reconhecer e aliviar cólicas de gases?', answer_rag_context: 'Gases causam desconforto abdominal. Oferece posições diferentes, massagem circular no abdômen, bactérias probióticas orientadas.', min_week: 4, max_week: 12 }
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
