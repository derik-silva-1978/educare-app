const { sequelize } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

// Função para converter CSV para array de objetos
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(';');
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = lines[i].split(';');
    const question = {};
    
    headers.forEach((header, index) => {
      question[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    questions.push(question);
  }
  
  return questions;
}

async function recreateTable() {
  try {
    console.log('🚀 Iniciando recriação da tabela journey_bot_questions...');
    
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');
    
    // 1. DROPAR TABELA EXISTENTE COMPLETAMENTE
    console.log('🗑️ Dropando tabela existente...');
    await sequelize.query('DROP TABLE IF EXISTS journey_bot_questions CASCADE;');
    console.log('✅ Tabela dropada');
    
    // 2. HABILITAR EXTENSÃO UUID (se necessário)
    console.log('🔧 Habilitando extensão UUID...');
    try {
      await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    } catch (e) {
      console.log('⚠️ Extensão UUID já existe ou não disponível, usando abordagem alternativa');
    }
    
    // 3. CRIAR NOVA TABELA COM TODOS OS CAMPOS DO CSV
    console.log('🏗️ Criando nova tabela com estrutura completa...');
    
    const createTableSQL = `
      CREATE TABLE journey_bot_questions (
        id UUID PRIMARY KEY,
        
        -- Metadados do módulo
        meta_title VARCHAR(255),
        meta_min_months INTEGER NOT NULL DEFAULT 0,
        meta_max_months INTEGER NOT NULL DEFAULT 12,
        meta_description TEXT,
        
        -- Dados da semana
        week INTEGER,
        week_title VARCHAR(255),
        week_description TEXT,
        
        -- Gamificação - Boas-vindas
        gamification_welcome_title VARCHAR(255),
        gamification_welcome_message TEXT,
        
        -- Gamificação - Badge
        gamification_badge_name VARCHAR(255),
        gamification_badge_description TEXT,
        
        -- Gamificação - Progresso
        gamification_progress_message TEXT,
        
        -- Gamificação - Desafio semanal
        gamification_weekly_challenge_title VARCHAR(255),
        gamification_weekly_challenge_description TEXT,
        
        -- Gamificação - Dicas
        gamification_tips TEXT,
        
        -- Gamificação - Mensagem de encerramento
        gamification_closing_message_title VARCHAR(255),
        gamification_closing_message_message TEXT,
        
        -- Gamificação - Registro afetivo
        gamification_registro_afetivo_question TEXT,
        gamification_registro_afetivo_options TEXT,
        
        -- Gamificação - Mensagem personalizada
        gamification_personalized_message_title VARCHAR(255),
        gamification_personalized_message_message TEXT,
        
        -- Dados da pergunta principal
        domain_name VARCHAR(255) NOT NULL DEFAULT 'geral',
        domain_question TEXT NOT NULL,
        domain_importance TEXT,
        
        -- Feedbacks
        domain_feedback_1 TEXT,
        domain_feedback_2 TEXT,
        domain_feedback_3 TEXT,
        
        -- Atividades e alertas
        domain_activities TEXT,
        domain_alert_missing TEXT,
        
        -- Campos de controle
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    
    await sequelize.query(createTableSQL);
    console.log('✅ Nova tabela criada com todos os campos');
    
    // 4. CRIAR ÍNDICES
    console.log('📊 Criando índices...');
    
    const indexes = [
      'CREATE INDEX idx_journey_meta_age ON journey_bot_questions (meta_min_months, meta_max_months);',
      'CREATE INDEX idx_journey_domain ON journey_bot_questions (domain_name);',
      'CREATE INDEX idx_journey_active ON journey_bot_questions (is_active);',
      'CREATE INDEX idx_journey_week ON journey_bot_questions (week);',
      'CREATE INDEX idx_journey_order ON journey_bot_questions (order_index);'
    ];
    
    for (const indexSQL of indexes) {
      await sequelize.query(indexSQL);
    }
    console.log('✅ Índices criados');
    
    // 5. IMPORTAR DADOS DO CSV
    console.log('📁 Importando dados do CSV...');
    
    const csvPath = path.join(__dirname, '../../docs/EXEMPLODE DE PERGUNTAS E JORNADAS.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvData = parseCSV(csvContent);
    
    console.log(`📊 ${csvData.length} registros encontrados no CSV`);
    
    let importedCount = 0;
    
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      
      if (!row.domain_question || row.domain_question.trim() === '') {
        continue;
      }
      
      const insertSQL = `
        INSERT INTO journey_bot_questions (
          id, meta_title, meta_min_months, meta_max_months, meta_description,
          week, week_title, week_description,
          gamification_welcome_title, gamification_welcome_message,
          gamification_badge_name, gamification_badge_description,
          gamification_progress_message,
          gamification_weekly_challenge_title, gamification_weekly_challenge_description,
          gamification_tips,
          gamification_closing_message_title, gamification_closing_message_message,
          gamification_registro_afetivo_question, gamification_registro_afetivo_options,
          gamification_personalized_message_title, gamification_personalized_message_message,
          domain_name, domain_question, domain_importance,
          domain_feedback_1, domain_feedback_2, domain_feedback_3,
          domain_activities, domain_alert_missing,
          order_index, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
        )
      `;
      
      const values = [
        require('crypto').randomUUID(), // Gerar UUID manualmente
        row.meta_title || null,
        parseInt(row.meta_min_months) || 0,
        parseInt(row.meta_max_months) || 12,
        row.meta_description || null,
        parseInt(row.week) || null,
        row.week_title || null,
        row.week_description || null,
        row.gamification_welcome_title || null,
        row.gamification_welcome_message || null,
        row.gamification_badge_name || null,
        row.gamification_badge_description || null,
        row.gamification_progress_message || null,
        row.gamification_weekly_challenge_title || null,
        row.gamification_weekly_challenge_description || null,
        row.gamification_tips || null,
        row.gamification_closing_message_title || null,
        row.gamification_closing_message_message || null,
        row.gamification_registro_afetivo_question || null,
        row.gamification_registro_afetivo_options || null,
        row.gamification_personalized_message_title || null,
        row.gamification_personalized_message_message || null,
        row.domain_name || 'geral',
        row.domain_question || 'Pergunta não especificada',
        row.domain_importance || null,
        row.domain_feedback_1 || null,
        row.domain_feedback_2 || null,
        row.domain_feedback_3 || null,
        row.domain_activities || null,
        row.domain_alert_missing || null,
        i,
        true
      ];
      
      try {
        await sequelize.query(insertSQL, { replacements: values });
        importedCount++;
        console.log(`✅ Pergunta ${importedCount}: ${row.domain_question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Erro na pergunta ${i + 1}:`, error.message);
      }
    }
    
    // 6. MOSTRAR ESTATÍSTICAS
    console.log(`\n🎉 Importação concluída! ${importedCount} perguntas importadas`);
    
    const [totalResult] = await sequelize.query('SELECT COUNT(*) as total FROM journey_bot_questions');
    console.log(`📊 Total final na tabela: ${totalResult[0].total}`);
    
    const [domainsResult] = await sequelize.query(`
      SELECT domain_name, COUNT(*) as count 
      FROM journey_bot_questions 
      GROUP BY domain_name 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Perguntas por domínio:');
    domainsResult.forEach(domain => {
      console.log(`  - ${domain.domain_name}: ${domain.count} perguntas`);
    });
    
    const [weeksResult] = await sequelize.query(`
      SELECT week, COUNT(*) as count 
      FROM journey_bot_questions 
      WHERE week IS NOT NULL
      GROUP BY week 
      ORDER BY week
    `);
    
    console.log('\n📅 Perguntas por semana:');
    weeksResult.forEach(week => {
      console.log(`  - Semana ${week.week}: ${week.count} perguntas`);
    });
    
    await sequelize.close();
    console.log('\n🔌 Recriação concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a recriação:', error);
    await sequelize.close();
  }
}

recreateTable();
