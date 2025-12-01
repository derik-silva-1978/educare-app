const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: console.log
});

async function fixActivitiesEnum() {
  try {
    console.log('🔧 Iniciando correção do ENUM activities.category...');
    
    // Verificar dados existentes
    console.log('📊 Verificando dados existentes...');
    const [existingData] = await sequelize.query('SELECT DISTINCT category FROM activities;');
    console.log('Categorias existentes:', existingData);
    
    // Criar ENUM se não existir
    console.log('🆕 Criando ENUM enum_activities_category...');
    await sequelize.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_activities_category') THEN
              CREATE TYPE enum_activities_category AS ENUM(
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
          END IF;
      END$$;
    `);
    
    // Adicionar nova coluna temporária
    console.log('➕ Adicionando coluna temporária...');
    await sequelize.query('ALTER TABLE activities ADD COLUMN IF NOT EXISTS category_new enum_activities_category;');
    
    // Migrar dados existentes
    console.log('🔄 Migrando dados existentes...');
    await sequelize.query(`
      UPDATE activities SET category_new = 
          CASE 
              WHEN category::text = 'motor' THEN 'motor'::enum_activities_category
              WHEN category::text = 'cognitive' THEN 'cognitive'::enum_activities_category
              WHEN category::text = 'sensory' THEN 'sensory'::enum_activities_category
              WHEN category::text = 'communication' THEN 'communication'::enum_activities_category
              WHEN category::text = 'social_emotional' THEN 'social_emotional'::enum_activities_category
              WHEN category::text = 'nutrition' THEN 'nutrition'::enum_activities_category
              WHEN category::text = 'baby_health' THEN 'baby_health'::enum_activities_category
              WHEN category::text = 'maternal_health' THEN 'maternal_health'::enum_activities_category
              WHEN category::text = 'maternal_self_care' THEN 'maternal_self_care'::enum_activities_category
              ELSE 'motor'::enum_activities_category
          END
      WHERE category_new IS NULL;
    `);
    
    // Verificar migração
    const [migratedData] = await sequelize.query('SELECT COUNT(*) as total, COUNT(category_new) as migrated FROM activities;');
    console.log('📈 Dados migrados:', migratedData[0]);
    
    if (migratedData[0].total === migratedData[0].migrated) {
      // Remover coluna antiga e renomear nova
      console.log('🗑️ Removendo coluna antiga...');
      await sequelize.query('ALTER TABLE activities DROP COLUMN IF EXISTS category;');
      
      console.log('🔄 Renomeando nova coluna...');
      await sequelize.query('ALTER TABLE activities RENAME COLUMN category_new TO category;');
      
      // Adicionar NOT NULL constraint
      console.log('🔒 Adicionando constraint NOT NULL...');
      await sequelize.query('ALTER TABLE activities ALTER COLUMN category SET NOT NULL;');
      
      // Verificar resultado final
      const [finalData] = await sequelize.query('SELECT DISTINCT category FROM activities;');
      console.log('✅ Categorias finais:', finalData);
      
      console.log('🎉 Migration concluída com sucesso!');
    } else {
      console.error('❌ Erro: Nem todos os dados foram migrados!');
      throw new Error('Migration incompleta');
    }
    
  } catch (error) {
    console.error('❌ Erro na migration:', error);
    
    // Rollback: remover coluna temporária se existir
    try {
      await sequelize.query('ALTER TABLE activities DROP COLUMN IF EXISTS category_new;');
      console.log('🔄 Rollback realizado: coluna temporária removida');
    } catch (rollbackError) {
      console.error('❌ Erro no rollback:', rollbackError);
    }
    
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Executar migration
if (require.main === module) {
  fixActivitiesEnum()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na execução:', error);
      process.exit(1);
    });
}

module.exports = { fixActivitiesEnum };
