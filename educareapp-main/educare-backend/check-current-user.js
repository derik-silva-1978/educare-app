const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const TeamMember = require('./src/models/TeamMember');

async function checkCurrentUser() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Buscar todos os usuários
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role']
    });
    
    console.log('👥 Usuários encontrados:', users.length);
    users.forEach(user => {
      console.log('👤 Usuário:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    });
    
    // Buscar team_members com status active
    const teamMembers = await TeamMember.findAll({
      where: { status: 'active' }
    });
    
    console.log('\n👥 Team Members ativos:', teamMembers.length);
    teamMembers.forEach(member => {
      console.log('📋 Membro:', {
        id: member.id,
        teamId: member.teamId,
        userId: member.userId,
        status: member.status,
        role: member.role
      });
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

checkCurrentUser();
