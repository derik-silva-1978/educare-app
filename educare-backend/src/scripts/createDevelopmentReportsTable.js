const { sequelize } = require('../config/database');

async function createDevelopmentReportsTable() {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida.');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS child_development_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        child_id UUID NOT NULL,
        user_id UUID NOT NULL,
        session_id UUID,
        age_range_months VARCHAR(20),
        total_questions INTEGER NOT NULL DEFAULT 0,
        answered_questions INTEGER NOT NULL DEFAULT 0,
        completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
        overall_score DECIMAL(5,2) NOT NULL DEFAULT 0,
        dimension_scores JSONB DEFAULT '{}',
        recommendations JSONB DEFAULT '[]',
        concerns JSONB DEFAULT '[]',
        report_data JSONB DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'generated',
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        shared_with_professionals BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Tabela child_development_reports criada com sucesso!');
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_dev_reports_child_id ON child_development_reports(child_id);
      CREATE INDEX IF NOT EXISTS idx_dev_reports_user_id ON child_development_reports(user_id);
      CREATE INDEX IF NOT EXISTS idx_dev_reports_session_id ON child_development_reports(session_id);
    `);
    
    console.log('Índices criados com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    process.exit(1);
  }
}

createDevelopmentReportsTable();
