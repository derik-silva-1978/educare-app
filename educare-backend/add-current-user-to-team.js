const { sequelize } = require('./src/config/database');
const TeamMember = require('./src/models/TeamMember');
const Team = require('./src/models/Team');
const User = require('./src/models/User');

async function addCurrentUserToTeam() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Buscar usuário prf1@gmail.com
    const user = await User.findOne({
      where: { email: 'prf1@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário prf1@gmail.com não encontrado');
      process.exit(1);
    }
    
    console.log('👤 Usuário encontrado:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Buscar primeira equipe
    const team = await Team.findOne();
    
    if (!team) {
      console.log('❌ Nenhuma equipe encontrada');
      process.exit(1);
    }
    
    console.log('🏢 Equipe encontrada:', {
      id: team.id,
      name: team.name
    });
    
    // Verificar se já existe
    const existingMember = await TeamMember.findOne({
      where: { 
        teamId: team.id,
        userId: user.id 
      }
    });
    
    if (existingMember) {
      console.log('⚠️ Usuário já é membro da equipe, atualizando status...');
      await existingMember.update({
        status: 'active',
        role: 'admin'
      });
      console.log('✅ Status atualizado para active!');
    } else {
      console.log('➕ Adicionando usuário à equipe...');
      const newMember = await TeamMember.create({
        teamId: team.id,
        userId: user.id,
        status: 'active',
        role: 'admin'
      });
      console.log('✅ Usuário adicionado à equipe:', newMember.id);
    }
    
    // Verificar resultado
    const members = await TeamMember.findAll({
      where: { status: 'active' }
    });
    
    console.log('\n👥 Membros ativos da equipe:');
    members.forEach(member => {
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

addCurrentUserToTeam();
