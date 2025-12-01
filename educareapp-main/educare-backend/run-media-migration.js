const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurar conexão
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

// Importar a migration
const migration = require('./migrations/20251014-create-media-resources.js');

async function runMigration() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado com sucesso!');

    console.log('🔄 Executando migration: 20251014-create-media-resources...');
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    console.log('✅ Migration executada com sucesso!');

    console.log('\n📊 Verificando tabela criada...');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'media_resources'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n✅ Tabela media_resources criada com as seguintes colunas:');
    console.table(results);

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n✅ Conexão fechada.');
  }
}

runMigration();
