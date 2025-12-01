const fs = require('fs');
const path = require('path');
const sequelize = require('../src/config/database.js');
const JourneyBotQuestion = require('../src/models/JourneyBotQuestion.js')(require('../src/config/database.js'), require('sequelize'));

// Função para converter CSV para array de objetos
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(';');
  const questions = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = lines[i].split(';');
    const row = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    questions.push(row);
  }
  
  return questions;
}

// Função para mapear dados do CSV para modelo do banco (TODOS OS CAMPOS)
function mapCSVToQuestion(csvRow, orderIndex) {
  return {
    // Metadados do módulo
    meta_title: csvRow.meta_title || null,
    meta_min_months: parseInt(csvRow.meta_min_months) || 0,
    meta_max_months: parseInt(csvRow.meta_max_months) || 12,
    meta_description: csvRow.meta_description || null,
    
    // Dados da semana
    week: parseInt(csvRow.week) || null,
    week_title: csvRow.week_title || null,
    week_description: csvRow.week_description || null,
    
    // Gamificação - Boas-vindas
    gamification_welcome_title: csvRow.gamification_welcome_title || null,
    gamification_welcome_message: csvRow.gamification_welcome_message || null,
    
    // Gamificação - Badge
    gamification_badge_name: csvRow.gamification_badge_name || null,
    gamification_badge_description: csvRow.gamification_badge_description || null,
    
    // Gamificação - Progresso
    gamification_progress_message: csvRow.gamification_progress_message || null,
    
    // Gamificação - Desafio semanal
    gamification_weekly_challenge_title: csvRow.gamification_weekly_challenge_title || null,
    gamification_weekly_challenge_description: csvRow.gamification_weekly_challenge_description || null,
    
    // Gamificação - Dicas
    gamification_tips: csvRow.gamification_tips || null,
    
    // Gamificação - Mensagem de encerramento
    gamification_closing_message_title: csvRow.gamification_closing_message_title || null,
    gamification_closing_message_message: csvRow.gamification_closing_message_message || null,
    
    // Gamificação - Registro afetivo
    gamification_registro_afetivo_question: csvRow.gamification_registro_afetivo_question || null,
    gamification_registro_afetivo_options: csvRow.gamification_registro_afetivo_options || null,
    
    // Gamificação - Mensagem personalizada
    gamification_personalized_message_title: csvRow.gamification_personalized_message_title || null,
    gamification_personalized_message_message: csvRow.gamification_personalized_message_message || null,
    
    // Dados da pergunta principal
    domain_name: csvRow.domain_name || 'geral',
    domain_question: csvRow.domain_question || 'Pergunta não especificada',
    domain_importance: csvRow.domain_importance || null,
    
    // Feedbacks
    domain_feedback_1: csvRow.domain_feedback_1 || null,
    domain_feedback_2: csvRow.domain_feedback_2 || null,
    domain_feedback_3: csvRow.domain_feedback_3 || null,
    
    // Atividades e alertas
    domain_activities: csvRow.domain_activities || null,
    domain_alert_missing: csvRow.domain_alert_missing || null,
    
    // Campos de controle
    order_index: orderIndex,
    is_active: true
  };
}

async function importJourneyQuestions() {
  try {
    console.log('🚀 Iniciando importação das perguntas da jornada...');
    
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');
    
    // Dropar e recriar tabela com nova estrutura
    console.log('🔄 Dropando tabela existente...');
    await sequelize.query('DROP TABLE IF EXISTS journey_bot_questions CASCADE;');
    
    console.log('🏗️ Recriando tabela com nova estrutura...');
    await sequelize.sync({ force: true });
    console.log('✅ Tabela recriada com sucesso');
    
    // Ler arquivo CSV
    const csvPath = path.join(__dirname, '../../docs/EXEMPLODE DE PERGUNTAS E JORNADAS.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    console.log('📄 Arquivo CSV lido');
    
    // Parsear CSV
    const csvData = parseCSV(csvContent);
    console.log(`📊 ${csvData.length} registros encontrados no CSV`);
    
    // Processar todas as linhas do CSV (sem filtrar duplicatas para manter gamificação)
    const allQuestions = [];
    
    csvData.forEach((row, index) => {
      if (row.domain_question && row.domain_question.trim() !== '') {
        allQuestions.push(mapCSVToQuestion(row, index));
      }
    });
    
    console.log(`🎯 ${allQuestions.length} perguntas para importar`);
    
    // Inserir perguntas no banco
    for (let i = 0; i < allQuestions.length; i++) {
      const question = allQuestions[i];
      try {
        await JourneyBotQuestion.create(question);
        console.log(`✅ Pergunta ${i + 1}/${allQuestions.length}: ${question.domain_question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Erro na pergunta ${i + 1}:`, error.message);
        console.error('Dados da pergunta:', JSON.stringify(question, null, 2));
      }
    }
    
    // Verificar resultado
    const totalQuestions = await JourneyBotQuestion.count();
    console.log(`🎉 Importação concluída! ${totalQuestions} perguntas importadas`);
    
    // Mostrar estatísticas
    const domains = await JourneyBotQuestion.findAll({
      attributes: ['domain_name', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['domain_name']
    });
    
    console.log('\n📊 Perguntas por domínio:');
    domains.forEach(domain => {
      console.log(`  - ${domain.domain_name}: ${domain.dataValues.count} perguntas`);
    });
    
    const ageRanges = await JourneyBotQuestion.findAll({
      attributes: ['meta_min_months', 'meta_max_months', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['meta_min_months', 'meta_max_months']
    });
    
    console.log('\n📅 Perguntas por faixa etária:');
    ageRanges.forEach(range => {
      console.log(`  - ${range.meta_min_months}-${range.meta_max_months} meses: ${range.dataValues.count} perguntas`);
    });
    
    const weeks = await JourneyBotQuestion.findAll({
      attributes: ['week', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['week'],
      where: {
        week: { [require('sequelize').Op.not]: null }
      }
    });
    
    console.log('\n📅 Perguntas por semana:');
    weeks.forEach(week => {
      console.log(`  - Semana ${week.week}: ${week.dataValues.count} perguntas`);
    });
    
  } catch (error) {
    console.error('❌ Erro na importação:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão fechada');
  }
}

// Executar importação
if (require.main === module) {
  importJourneyQuestions();
}

module.exports = { importJourneyQuestions };
