/**
 * Script para popular a tabela official_milestones com dados da Caderneta da Criança
 * Uso: node src/scripts/seedOfficialMilestones.js
 */

const { sequelize } = require('../config/database');
const OfficialMilestone = require('../models/OfficialMilestone');
const officialMilestonesData = require('../seeds/officialMilestones');

async function seedOfficialMilestones() {
  console.log('=== SEED: Marcos Oficiais do Desenvolvimento ===\n');
  
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados estabelecida.\n');

    const existingCount = await OfficialMilestone.count();
    console.log(`Marcos existentes no banco: ${existingCount}`);

    if (existingCount > 0) {
      console.log('Tabela já possui dados. Pulando seed para evitar duplicação.');
      console.log('Use --force para recriar todos os marcos.\n');
      
      if (process.argv.includes('--force')) {
        console.log('Flag --force detectada. Removendo marcos existentes...');
        await OfficialMilestone.destroy({ where: {}, truncate: true });
        console.log('Marcos removidos com sucesso.\n');
      } else {
        const byCategory = await sequelize.query(`
          SELECT category, COUNT(*) as count 
          FROM official_milestones 
          GROUP BY category 
          ORDER BY category
        `, { type: sequelize.QueryTypes.SELECT });
        
        console.log('\nDistribuição por categoria:');
        byCategory.forEach(c => console.log(`  - ${c.category}: ${c.count} marcos`));
        
        process.exit(0);
      }
    }

    console.log(`Inserindo ${officialMilestonesData.length} marcos oficiais...\n`);

    const created = await OfficialMilestone.bulkCreate(
      officialMilestonesData.map(m => ({
        ...m,
        is_active: true
      })),
      { 
        ignoreDuplicates: true,
        validate: true
      }
    );

    console.log(`${created.length} marcos inseridos com sucesso!\n`);

    const byCategory = await sequelize.query(`
      SELECT category, COUNT(*) as count 
      FROM official_milestones 
      GROUP BY category 
      ORDER BY category
    `, { type: sequelize.QueryTypes.SELECT });

    console.log('Distribuição por categoria:');
    byCategory.forEach(c => console.log(`  - ${c.category}: ${c.count} marcos`));

    const totalInserted = await OfficialMilestone.count();
    console.log(`\nTotal de marcos no banco: ${totalInserted}`);
    console.log('\n=== Seed concluído com sucesso! ===');

  } catch (error) {
    console.error('Erro durante o seed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedOfficialMilestones();
