const { sequelize } = require('./src/config/database');

async function fixTeamMembersRaw() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Usar query SQL direta para atualizar
    const [results] = await sequelize.query(`
      UPDATE team_members 
      SET 
        team_id = (SELECT id FROM teams LIMIT 1),
        user_id = (SELECT id FROM users LIMIT 1)
      WHERE status = 'active'
      RETURNING id, team_id, user_id, status, role;
    `);
    
    console.log('✅ Team members atualizados:', results);
    
    // Verificar resultado com query direta
    const [verification] = await sequelize.query(`
      SELECT id, team_id, user_id, status, role 
      FROM team_members 
      WHERE status = 'active'
      LIMIT 1;
    `);
    
    console.log('📋 Verificação:', verification);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixTeamMembersRaw();
