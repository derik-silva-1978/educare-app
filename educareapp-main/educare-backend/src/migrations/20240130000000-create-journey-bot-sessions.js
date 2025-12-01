'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('journey_bot_sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      child_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'children',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      total_questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      answered_questions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'paused'),
        defaultValue: 'active'
      },
      session_data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('journey_bot_sessions', ['user_id']);
    await queryInterface.addIndex('journey_bot_sessions', ['child_id']);
    await queryInterface.addIndex('journey_bot_sessions', ['status']);
    await queryInterface.addIndex('journey_bot_sessions', ['user_id', 'child_id', 'status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('journey_bot_sessions');
  }
};
