const { sequelize } = require('../src/config/database');

async function checkTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco');
    
    // Verificar estrutura da tabela
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'journey_bot_questions' 
      ORDER BY ordinal_position
    `);
    
    console.log(`\n📝 Campos na nova tabela (${columns.length} campos):`);
    columns.forEach((col, i) => {
      console.log(`  ${(i+1).toString().padStart(2, '0')}. ${col.column_name}`);
    });
    
    // Verificar total de registros
    const [count] = await sequelize.query('SELECT COUNT(*) as total FROM journey_bot_questions');
    console.log(`\n📊 Total de registros: ${count[0].total}`);
    
    if (count[0].total > 0) {
      const [sample] = await sequelize.query('SELECT * FROM journey_bot_questions LIMIT 1');
      console.log('\n🎯 Exemplo de dados:');
      console.log(`  - ID: ${sample[0].id}`);
      console.log(`  - Domínio: ${sample[0].domain_name}`);
      console.log(`  - Pergunta: ${sample[0].domain_question.substring(0, 60)}...`);
      console.log(`  - Semana: ${sample[0].week}`);
      console.log(`  - Badge: ${sample[0].gamification_badge_name}`);
      console.log(`  - Meta Min: ${sample[0].meta_min_months} meses`);
      console.log(`  - Meta Max: ${sample[0].meta_max_months} meses`);
    }
    
    await sequelize.close();
    console.log('\n🔌 Verificação concluída');
    
  } catch(e) {
    console.error('❌ Erro:', e.message);
    await sequelize.close();
  }
}

checkTable();
