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

async function forceRecreateTable() {
  try {
    console.log('🚀 FORÇANDO recriação da tabela journey_bot_questions...');
    
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');
    
    // 1. DROPAR TABELA COMPLETAMENTE (sem usar Sequelize)
    console.log('🗑️ Dropando tabela existente via SQL puro...');
    await sequelize.query('DROP TABLE IF EXISTS journey_bot_questions CASCADE;');
    console.log('✅ Tabela dropada completamente');
    
    // 2. HABILITAR EXTENSÃO UUID
    console.log('🔧 Habilitando extensão UUID...');
    try {
      await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      console.log('✅ Extensão UUID habilitada');
    } catch (e) {
      console.log('⚠️ Extensão UUID já existe');
    }
    
    // 3. CRIAR TABELA NOVA VIA SQL PURO (SEM SEQUELIZE)
    console.log('🏗️ Criando tabela com TODOS os campos do CSV via SQL puro...');
    
    const createTableSQL = `
      CREATE TABLE journey_bot_questions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        
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
    console.log('✅ Tabela criada com TODOS os campos do CSV!');
    
    // 4. CRIAR ÍNDICES
    console.log('📊 Criando índices otimizados...');
    
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
    
    // 5. VERIFICAR ESTRUTURA DA TABELA
    console.log('🔍 Verificando estrutura da nova tabela...');
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'journey_bot_questions' 
      ORDER BY ordinal_position
    `);
    
    console.log(`📝 Campos criados (${columns.length} campos):`);
    columns.forEach((col, i) => {
      console.log(`  ${(i+1).toString().padStart(2, '0')}. ${col.column_name}`);
    });
    
    // 6. IMPORTAR DADOS DO CSV
    console.log('\n📁 Importando dados do CSV...');
    
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
      
      // Usar uma abordagem mais simples com valores diretos
      const insertSQL = `
        INSERT INTO journey_bot_questions (
          meta_title, meta_min_months, meta_max_months, meta_description,
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
          '${(row.meta_title || '').replace(/'/g, "''")}'::VARCHAR,
          ${parseInt(row.meta_min_months) || 0}::INTEGER,
          ${parseInt(row.meta_max_months) || 12}::INTEGER,
          '${(row.meta_description || '').replace(/'/g, "''")}'::TEXT,
          ${parseInt(row.week) || 'NULL'}::INTEGER,
          '${(row.week_title || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.week_description || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_welcome_title || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.gamification_welcome_message || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_badge_name || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.gamification_badge_description || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_progress_message || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_weekly_challenge_title || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.gamification_weekly_challenge_description || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_tips || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_closing_message_title || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.gamification_closing_message_message || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_registro_afetivo_question || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_registro_afetivo_options || '').replace(/'/g, "''")}'::TEXT,
          '${(row.gamification_personalized_message_title || '').replace(/'/g, "''")}'::VARCHAR,
          '${(row.gamification_personalized_message_message || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_name || 'geral').replace(/'/g, "''")}'::VARCHAR,
          '${(row.domain_question || 'Pergunta não especificada').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_importance || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_feedback_1 || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_feedback_2 || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_feedback_3 || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_activities || '').replace(/'/g, "''")}'::TEXT,
          '${(row.domain_alert_missing || '').replace(/'/g, "''")}'::TEXT,
          ${i}::INTEGER,
          true::BOOLEAN
        )
      `;
      
      try {
        await sequelize.query(insertSQL);
        importedCount++;
        if (importedCount % 10 === 0 || importedCount <= 5) {
          console.log(`✅ Pergunta ${importedCount}: ${row.domain_question.substring(0, 50)}...`);
        }
      } catch (error) {
        console.error(`❌ Erro na pergunta ${i + 1}:`, error.message);
      }
    }
    
    // 7. MOSTRAR ESTATÍSTICAS FINAIS
    console.log(`\n🎉 IMPORTAÇÃO CONCLUÍDA! ${importedCount} perguntas importadas`);
    
    const [totalResult] = await sequelize.query('SELECT COUNT(*) as total FROM journey_bot_questions');
    console.log(`📊 Total final na tabela: ${totalResult[0].total}`);
    
    // Verificar campos com dados
    const [sampleResult] = await sequelize.query('SELECT * FROM journey_bot_questions LIMIT 1');
    if (sampleResult.length > 0) {
      const sample = sampleResult[0];
      console.log('\n🎯 Exemplo de dados importados:');
      console.log(`  - ID: ${sample.id}`);
      console.log(`  - Meta Title: ${sample.meta_title}`);
      console.log(`  - Semana: ${sample.week}`);
      console.log(`  - Domínio: ${sample.domain_name}`);
      console.log(`  - Pergunta: ${sample.domain_question.substring(0, 60)}...`);
      console.log(`  - Badge: ${sample.gamification_badge_name}`);
      console.log(`  - Idade: ${sample.meta_min_months}-${sample.meta_max_months} meses`);
    }
    
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
    
    await sequelize.close();
    console.log('\n🔌 RECRIAÇÃO FORÇADA CONCLUÍDA COM SUCESSO! 🎉');
    
  } catch (error) {
    console.error('❌ Erro durante a recriação forçada:', error);
    await sequelize.close();
  }
}

forceRecreateTable();
