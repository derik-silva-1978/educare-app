'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Buscar IDs dos usuários admin e owner
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@educareapp.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const ownerUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'owner@educareapp.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!adminUser.length || !ownerUser.length) {
      console.log('Usuários admin ou owner não encontrados. Execute o seeder de usuários primeiro.');
      return Promise.resolve();
    }
    
    const adminUserId = adminUser[0].id;
    const ownerUserId = ownerUser[0].id;
    
    return queryInterface.bulkInsert('profiles', [
      {
        id: uuidv4(),
        user_id: adminUserId,
        name: 'Perfil Administrador',
        type: 'professional',
        phone: '+5511999999999',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zip_code: '01310-100',
        bio: 'Administrador do sistema EducareApp',
        professional_id: 'ADM-001',
        professional_specialty: 'Administração de Sistemas',
        is_primary: true,
        is_verified: true,
        metadata: JSON.stringify({
          department: 'TI',
          access_level: 'full'
        }),
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        user_id: ownerUserId,
        name: 'Perfil Proprietário',
        type: 'professional',
        phone: '+5511988888888',
        address: 'Av. Brigadeiro Faria Lima, 3900',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zip_code: '04538-132',
        bio: 'Proprietário e gestor do sistema EducareApp',
        professional_id: 'OWN-001',
        professional_specialty: 'Gestão Executiva',
        is_primary: true,
        is_verified: true,
        metadata: JSON.stringify({
          department: 'Diretoria',
          access_level: 'full'
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Buscar IDs dos usuários admin e owner
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email IN ('admin@educareapp.com', 'owner@educareapp.com')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const userIds = users.map(user => user.id);
    
    return queryInterface.bulkDelete('profiles', {
      user_id: {
        [Sequelize.Op.in]: userIds
      }
    }, {});
  }
};
