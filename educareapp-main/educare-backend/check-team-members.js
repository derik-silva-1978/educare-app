const { sequelize } = require('./src/config/database');
const TeamMember = require('./src/models/TeamMember');

async function checkTeamMembers() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Buscar todos os team_members sem include
    const teamMembers = await TeamMember.findAll();
    
    console.log('👥 Team Members encontrados:', teamMembers.length);
    teamMembers.forEach(member => {
      console.log('📋 Membro:', {
        id: member.id,
        team_id: member.team_id,
        user_id: member.user_id,
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

checkTeamMembers();
