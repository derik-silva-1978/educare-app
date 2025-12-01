'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('team_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      team_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('owner', 'admin', 'member', 'viewer'),
        defaultValue: 'member',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'pending', 'inactive'),
        defaultValue: 'pending',
        allowNull: false
      },
      invitation_token: {
        type: Sequelize.STRING
      },
      invitation_expires: {
        type: Sequelize.DATE
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices
    await queryInterface.addIndex('team_members', ['team_id']);
    await queryInterface.addIndex('team_members', ['user_id']);
    await queryInterface.addIndex('team_members', ['role']);
    await queryInterface.addIndex('team_members', ['status']);
    
    // Índice único para evitar duplicação de membros na mesma equipe
    await queryInterface.addIndex('team_members', ['team_id', 'user_id'], {
      unique: true,
      name: 'team_members_team_user_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('team_members');
  }
};
