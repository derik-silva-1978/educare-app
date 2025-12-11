const { sequelize, BiometricsLog, SleepLog, Appointment, VaccineHistory } = require('../models');

async function syncN8nTables() {
  try {
    console.log('🔄 Sincronizando tabelas do n8n v3.0...\n');

    // Sync individual tables with alter: true to avoid data loss
    console.log('📊 Criando/atualizando biometrics_logs...');
    await BiometricsLog.sync({ alter: true });
    console.log('✅ biometrics_logs OK');

    console.log('😴 Criando/atualizando sleep_logs...');
    await SleepLog.sync({ alter: true });
    console.log('✅ sleep_logs OK');

    console.log('🏥 Criando/atualizando appointments...');
    await Appointment.sync({ alter: true });
    console.log('✅ appointments OK');

    console.log('💉 Criando/atualizando vaccine_history...');
    await VaccineHistory.sync({ alter: true });
    console.log('✅ vaccine_history OK');

    console.log('\n🎉 Todas as tabelas do n8n v3.0 sincronizadas com sucesso!');

    // Verify tables exist
    const [tables] = await sequelize.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('biometrics_logs', 'sleep_logs', 'appointments', 'vaccine_history')
    `);
    
    console.log('\n📋 Tabelas verificadas no banco:');
    tables.forEach(t => console.log(`  - ${t.tablename}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar tabelas:', error);
    process.exit(1);
  }
}

syncN8nTables();
