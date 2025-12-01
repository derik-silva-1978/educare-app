const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: console.log
});

async function updateChatGroupNames() {
  try {
    console.log('🔧 Iniciando atualização dos nomes dos grupos de chat...');
    
    // Buscar todos os grupos de chat que têm child_id e nome com UUID
    const [chatGroups] = await sequelize.query(`
      SELECT cg.id, cg.name, cg.child_id, c.name as child_name
      FROM chat_groups cg
      LEFT JOIN children c ON cg.child_id = c.id
      WHERE cg.child_id IS NOT NULL 
      AND cg.name LIKE '%cad8f05b%'
      OR cg.name LIKE '%Chat - Criança %'
    `);
    
    console.log(`📊 Encontrados ${chatGroups.length} grupos para atualizar:`);
    
    for (const group of chatGroups) {
      console.log(`\n🔄 Atualizando grupo: ${group.id}`);
      console.log(`   Nome atual: ${group.name}`);
      console.log(`   Child ID: ${group.child_id}`);
      console.log(`   Nome da criança: ${group.child_name}`);
      
      let newName;
      if (group.child_name) {
        newName = `Chat - ${group.child_name}`;
      } else {
        newName = 'Chat da Equipe';
      }
      
      // Atualizar o nome do grupo
      await sequelize.query(`
        UPDATE chat_groups 
        SET name = :newName, updated_at = NOW()
        WHERE id = :groupId
      `, {
        replacements: { 
          newName: newName,
          groupId: group.id 
        }
      });
      
      console.log(`   ✅ Nome atualizado para: ${newName}`);
    }
    
    console.log('\n🎉 Atualização concluída com sucesso!');
    
    // Verificar resultado
    const [updatedGroups] = await sequelize.query(`
      SELECT id, name, child_id 
      FROM chat_groups 
      WHERE child_id IS NOT NULL
    `);
    
    console.log('\n📋 Grupos atualizados:');
    updatedGroups.forEach(group => {
      console.log(`   ${group.id}: ${group.name}`);
    });
    
  } catch (error) {
    console.error('❌ Erro na atualização:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Executar atualização
if (require.main === module) {
  updateChatGroupNames()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na execução:', error);
      process.exit(1);
    });
}

module.exports = { updateChatGroupNames };
