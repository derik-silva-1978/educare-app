/**
 * Script para criar manualmente as tabelas da Jornada 2.0
 * 
 * Este script cria as tabelas necessárias para a Jornada 2.0 diretamente via SQL,
 * contornando os problemas com as migrações do Sequelize.
 * 
 * Uso: node create-journey-v2-tables.js
 */

const { sequelize } = require('../src/config/database');

async function createTables() {
  try {
    console.log('Iniciando criação das tabelas da Jornada 2.0...');
    
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Criar tabela journey_v2
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS journey_v2 (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        trail VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10),
        month INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela journey_v2 criada com sucesso.');
    
    // Criar tabela journey_v2_weeks
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS journey_v2_weeks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        journey_id UUID REFERENCES journey_v2(id) ON DELETE CASCADE,
        week INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(10),
        is_summary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela journey_v2_weeks criada com sucesso.');
    
    // Criar tabela journey_v2_topics
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS journey_v2_topics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        week_id UUID REFERENCES journey_v2_weeks(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content JSONB NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela journey_v2_topics criada com sucesso.');
    
    // Criar tabela journey_v2_quizzes
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS journey_v2_quizzes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        week_id UUID REFERENCES journey_v2_weeks(id) ON DELETE CASCADE,
        domain VARCHAR(50) NOT NULL,
        domain_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        feedback JSONB NOT NULL,
        knowledge JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela journey_v2_quizzes criada com sucesso.');
    
    // Criar tabela journey_v2_badges
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS journey_v2_badges (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(10),
        description TEXT,
        type VARCHAR(50),
        week_id UUID REFERENCES journey_v2_weeks(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela journey_v2_badges criada com sucesso.');
    
    // Criar tabela user_journey_v2_progress
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_journey_v2_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        child_id UUID REFERENCES children(id) ON DELETE CASCADE,
        journey_id UUID REFERENCES journey_v2(id) ON DELETE CASCADE,
        week_id UUID REFERENCES journey_v2_weeks(id) ON DELETE CASCADE,
        completed_topics JSONB DEFAULT '[]',
        completed_quizzes JSONB DEFAULT '[]',
        progress FLOAT DEFAULT 0,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela user_journey_v2_progress criada com sucesso.');
    
    // Criar tabela user_journey_v2_badges
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_journey_v2_badges (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        child_id UUID REFERENCES children(id) ON DELETE CASCADE,
        badge_id VARCHAR(50) REFERENCES journey_v2_badges(id) ON DELETE CASCADE,
        earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela user_journey_v2_badges criada com sucesso.');
    
    console.log('Todas as tabelas da Jornada 2.0 foram criadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a criação das tabelas:', error);
    process.exit(1);
  }
}

// Executar o script
createTables();
