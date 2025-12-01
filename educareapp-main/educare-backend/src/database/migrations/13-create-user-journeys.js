'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_journeys', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      journey_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'journeys',
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
      child_id: {
        type: Sequelize.UUID,
        references: {
          model: 'children',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('not_started', 'in_progress', 'completed', 'abandoned'),
        defaultValue: 'not_started',
        allowNull: false
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Progresso em porcentagem (0-100)'
      },
      current_step: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      completion_date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      step_data: {
        type: Sequelize.JSONB,
        defaultValue: []
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
    await queryInterface.addIndex('user_journeys', ['journey_id']);
    await queryInterface.addIndex('user_journeys', ['user_id']);
    await queryInterface.addIndex('user_journeys', ['child_id']);
    await queryInterface.addIndex('user_journeys', ['status']);
    await queryInterface.addIndex('user_journeys', ['progress']);
    
    // Índice único para evitar jornadas duplicadas para o mesmo usuário/criança
    await queryInterface.addIndex('user_journeys', ['journey_id', 'user_id', 'child_id'], {
      unique: true,
      name: 'user_journeys_journey_user_child_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_journeys');
  }
};
