const { sequelize } = require('../src/config/database');
const { JourneyBotQuestion } = require('../src/models');

async function checkAndCreateTable() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');

    console.log('🔍 Verificando se a tabela journey_bot_questions existe...');
    
    // Verificar se a tabela existe
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'journey_bot_questions'
      );
    `);
    
    const tableExists = results[0].exists;
    console.log(`📋 Tabela journey_bot_questions existe: ${tableExists}`);

    if (!tableExists) {
      console.log('🚀 Criando tabela journey_bot_questions...');
      await JourneyBotQuestion.sync({ force: false });
      console.log('✅ Tabela journey_bot_questions criada com sucesso!');
    } else {
      console.log('✅ Tabela journey_bot_questions já existe!');
    }

    // Verificar estrutura da tabela
    console.log('🔍 Verificando estrutura da tabela...');
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'journey_bot_questions'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colunas da tabela:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Verificar se há dados na tabela
    const count = await JourneyBotQuestion.count();
    console.log(`📊 Total de perguntas na tabela: ${count}`);

    if (count === 0) {
      console.log('💡 A tabela está vazia. Você pode adicionar perguntas através da interface admin.');
    }

    console.log('🎉 Verificação concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('💡 Verifique se o PostgreSQL está rodando e as credenciais estão corretas no .env');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('💡 Erro no banco de dados. Verifique se o banco "educare_db" existe.');
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Executar verificação
checkAndCreateTable();
