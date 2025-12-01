const { sequelize } = require('../src/config/database');
const JourneyBotQuestion = require('../src/models/JourneyBotQuestion');

async function verify() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco');
    
    const total = await JourneyBotQuestion.count();
    console.log(`📊 Total de perguntas importadas: ${total}`);
    
    if (total > 0) {
      const sample = await JourneyBotQuestion.findOne();
      console.log('\n📝 Campos disponíveis na tabela:');
      Object.keys(sample.dataValues).forEach(field => {
        console.log(`  - ${field}`);
      });
      
      console.log('\n🎯 Exemplo de pergunta:');
      console.log(`  - ID: ${sample.id}`);
      console.log(`  - Domínio: ${sample.domain_name}`);
      console.log(`  - Pergunta: ${sample.domain_question.substring(0, 80)}...`);
      console.log(`  - Idade: ${sample.meta_min_months}-${sample.meta_max_months} meses`);
      console.log(`  - Semana: ${sample.week}`);
      console.log(`  - Badge: ${sample.gamification_badge_name}`);
      console.log(`  - Ativo: ${sample.is_active}`);
      
      // Estatísticas por domínio
      const domains = await JourneyBotQuestion.findAll({
        attributes: ['domain_name', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['domain_name']
      });
      
      console.log('\n📊 Perguntas por domínio:');
      domains.forEach(domain => {
        console.log(`  - ${domain.domain_name}: ${domain.dataValues.count} perguntas`);
      });
    }
    
    await sequelize.close();
    console.log('\n🔌 Verificação concluída');
  } catch(e) {
    console.error('❌ Erro:', e.message);
  }
}

verify();
