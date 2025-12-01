'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('licenses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      license_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.ENUM('standard', 'professional', 'enterprise', 'trial'),
        defaultValue: 'standard',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'expired', 'revoked'),
        defaultValue: 'active',
        allowNull: false
      },
      features: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      max_users: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      max_children: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.addIndex('licenses', ['license_key']);
    await queryInterface.addIndex('licenses', ['user_id']);
    await queryInterface.addIndex('licenses', ['type']);
    await queryInterface.addIndex('licenses', ['status']);
    await queryInterface.addIndex('licenses', ['expiry_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('licenses');
  }
};
