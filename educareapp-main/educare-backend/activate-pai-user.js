const { sequelize } = require('./src/config/database');
const TeamMember = require('./src/models/TeamMember');

async function activatePaiUser() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Buscar o team_member do usuário pai@gmail.com
    const paiUserId = '265be8c9-70c0-4d40-b73b-93406d594865';
    
    const teamMember = await TeamMember.findOne({
      where: { userId: paiUserId }
    });
    
    if (!teamMember) {
      console.log('❌ Team member não encontrado para pai@gmail.com');
      process.exit(1);
    }
    
    console.log('📋 Team member atual:', {
      id: teamMember.id,
      userId: teamMember.userId,
      status: teamMember.status,
      role: teamMember.role
    });
    
    // Atualizar status para active
    await teamMember.update({
      status: 'active',
      role: 'admin',
      joinedAt: new Date()
    });
    
    console.log('✅ Status atualizado para active!');
    
    // Verificar resultado
    const updated = await TeamMember.findByPk(teamMember.id);
    console.log('📋 Resultado:', {
      id: updated.id,
      userId: updated.userId,
      status: updated.status,
      role: updated.role,
      joinedAt: updated.joinedAt
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

activatePaiUser();
