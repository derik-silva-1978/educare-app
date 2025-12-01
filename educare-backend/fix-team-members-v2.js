const { sequelize } = require('./src/config/database');
const TeamMember = require('./src/models/TeamMember');
const Team = require('./src/models/Team');
const User = require('./src/models/User');

async function fixTeamMembers() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado ao banco!');
    
    // Buscar primeira equipe
    const team = await Team.findOne();
    console.log('🏢 Primeira equipe:', team ? team.id : 'Nenhuma equipe encontrada');
    
    // Buscar primeiro usuário
    const user = await User.findOne();
    console.log('👤 Primeiro usuário:', user ? user.id : 'Nenhum usuário encontrado');
    
    if (!team || !user) {
      console.log('❌ Não foi possível encontrar equipe ou usuário');
      process.exit(1);
    }
    
    // Buscar primeiro team_member com status active
    const teamMember = await TeamMember.findOne({
      where: { status: 'active' }
    });
    
    if (teamMember) {
      console.log('🔧 Atualizando team_member:', teamMember.id);
      
      // Atualizar usando os nomes corretos das propriedades do modelo
      await teamMember.update({
        teamId: team.id,
        userId: user.id
      });
      
      console.log('✅ Team member atualizado com sucesso!');
      
      // Verificar resultado
      const updated = await TeamMember.findByPk(teamMember.id);
      console.log('📋 Resultado:', {
        id: updated.id,
        teamId: updated.teamId,
        userId: updated.userId,
        status: updated.status,
        role: updated.role
      });
    } else {
      console.log('❌ Nenhum team_member ativo encontrado');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixTeamMembers();
