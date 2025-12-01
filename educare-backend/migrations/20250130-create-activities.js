const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

async function createActivitiesTable() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados PostgreSQL');

    // Criar extensão UUID se não existir
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('Extensão UUID habilitada');

    // Criar ENUM para categoria se não existir
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE activity_category AS ENUM (
          'motor',
          'cognitive', 
          'sensory',
          'communication',
          'social_emotional',
          'nutrition',
          'baby_health',
          'maternal_health',
          'maternal_self_care'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('ENUM activity_category criado/verificado');

    // Criar ENUM para dificuldade se não existir
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE activity_difficulty AS ENUM ('easy', 'medium', 'hard');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('ENUM activity_difficulty criado/verificado');

    // Criar tabela activities
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        min_age_months INTEGER NOT NULL CHECK (min_age_months >= 0 AND min_age_months <= 60),
        max_age_months INTEGER NOT NULL CHECK (max_age_months >= 1 AND max_age_months <= 60),
        category activity_category NOT NULL,
        difficulty_level activity_difficulty NOT NULL DEFAULT 'easy',
        duration_minutes INTEGER NOT NULL DEFAULT 15 CHECK (duration_minutes >= 1 AND duration_minutes <= 120),
        materials_needed JSONB NOT NULL DEFAULT '[]',
        instructions JSONB NOT NULL DEFAULT '[]',
        benefits JSONB NOT NULL DEFAULT '[]',
        safety_tips JSONB NOT NULL DEFAULT '[]',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT check_age_range CHECK (min_age_months < max_age_months)
      );
    `;

    await client.query(createTableQuery);
    console.log('Tabela activities criada com sucesso');

    // Criar índices para otimização
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);',
      'CREATE INDEX IF NOT EXISTS idx_activities_difficulty ON activities(difficulty_level);',
      'CREATE INDEX IF NOT EXISTS idx_activities_age_range ON activities(min_age_months, max_age_months);',
      'CREATE INDEX IF NOT EXISTS idx_activities_is_active ON activities(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);'
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }
    console.log('Índices criados com sucesso');

    // Inserir algumas atividades de exemplo
    const sampleActivities = [
      {
        title: 'Brincadeira com Chocalho',
        description: 'Atividade sensorial para desenvolver a coordenação motora e audição do bebê usando chocalhos coloridos.',
        min_age_months: 0,
        max_age_months: 6,
        category: 'sensory',
        difficulty_level: 'easy',
        duration_minutes: 10,
        materials_needed: '["Chocalho colorido", "Superfície macia"]',
        instructions: '["Posicione o bebê confortavelmente", "Balançar o chocalho suavemente", "Mover o chocalho para diferentes direções", "Observar a reação do bebê"]',
        benefits: '["Desenvolve coordenação motora", "Estimula a audição", "Melhora o foco visual"]',
        safety_tips: '["Sempre supervisionar o bebê", "Verificar se o chocalho não tem peças soltas", "Não deixar o bebê sozinho com o brinquedo"]'
      },
      {
        title: 'Massagem Relaxante',
        description: 'Técnica de massagem suave para promover relaxamento e fortalecer o vínculo entre mãe e bebê.',
        min_age_months: 0,
        max_age_months: 12,
        category: 'maternal_self_care',
        difficulty_level: 'easy',
        duration_minutes: 15,
        materials_needed: '["Óleo para bebê", "Toalha macia", "Ambiente aquecido"]',
        instructions: '["Aquecer as mãos", "Aplicar óleo suavemente", "Fazer movimentos circulares", "Massagear braços e pernas delicadamente"]',
        benefits: '["Promove relaxamento", "Fortalece vínculo", "Melhora a circulação", "Reduz cólicas"]',
        safety_tips: '["Usar óleo apropriado para bebês", "Manter ambiente aquecido", "Parar se o bebê demonstrar desconforto"]'
      },
      {
        title: 'Exercícios de Tummy Time',
        description: 'Exercícios para fortalecer músculos do pescoço e costas, essenciais para o desenvolvimento motor.',
        min_age_months: 1,
        max_age_months: 6,
        category: 'motor',
        difficulty_level: 'medium',
        duration_minutes: 5,
        materials_needed: '["Tapete de atividades", "Brinquedos coloridos"]',
        instructions: '["Colocar o bebê de barriga para baixo", "Posicionar brinquedos à frente", "Incentivar o bebê a levantar a cabeça", "Aumentar gradualmente o tempo"]',
        benefits: '["Fortalece músculos do pescoço", "Desenvolve coordenação", "Prepara para engatinhar"]',
        safety_tips: '["Sempre supervisionar", "Começar com períodos curtos", "Parar se o bebê ficar irritado"]'
      }
    ];

    for (const activity of sampleActivities) {
      const insertQuery = `
        INSERT INTO activities (
          title, description, min_age_months, max_age_months, category, 
          difficulty_level, duration_minutes, materials_needed, instructions, 
          benefits, safety_tips, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT DO NOTHING;
      `;

      await client.query(insertQuery, [
        activity.title,
        activity.description,
        activity.min_age_months,
        activity.max_age_months,
        activity.category,
        activity.difficulty_level,
        activity.duration_minutes,
        activity.materials_needed,
        activity.instructions,
        activity.benefits,
        activity.safety_tips,
        true
      ]);
    }

    console.log('Atividades de exemplo inseridas com sucesso');

    // Verificar quantas atividades foram criadas
    const result = await client.query('SELECT COUNT(*) FROM activities;');
    console.log(`Total de atividades na tabela: ${result.rows[0].count}`);

    console.log('✅ Migration de atividades executada com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Conexão com banco de dados encerrada');
  }
}

// Executar a migration
if (require.main === module) {
  createActivitiesTable()
    .then(() => {
      console.log('Migration concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Falha na migration:', error);
      process.exit(1);
    });
}

module.exports = createActivitiesTable;
