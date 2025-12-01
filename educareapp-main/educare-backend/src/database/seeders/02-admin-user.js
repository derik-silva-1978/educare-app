'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const adminId = uuidv4();
    const ownerId = uuidv4();
    
    // Hash da senha 'admin123' e 'owner123'
    const adminPassword = await bcrypt.hash('admin123', 10);
    const ownerPassword = await bcrypt.hash('owner123', 10);
    
    return queryInterface.bulkInsert('users', [
      {
        id: adminId,
        email: 'admin@educareapp.com',
        password: adminPassword,
        name: 'Administrador',
        role: 'admin',
        status: 'active',
        email_verified: true,
        last_login: now,
        created_at: now,
        updated_at: now
      },
      {
        id: ownerId,
        email: 'owner@educareapp.com',
        password: ownerPassword,
        name: 'Proprietário',
        role: 'owner',
        status: 'active',
        email_verified: true,
        last_login: now,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@educareapp.com', 'owner@educareapp.com']
      }
    }, {});
  }
};
