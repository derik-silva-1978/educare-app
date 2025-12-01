'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quiz_sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      quiz_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quizzes',
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
        type: Sequelize.ENUM('in_progress', 'completed', 'abandoned'),
        defaultValue: 'in_progress',
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER
      },
      max_score: {
        type: Sequelize.INTEGER
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      end_time: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.INTEGER,
        comment: 'Duração em segundos'
      },
      professional_notes: {
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
    await queryInterface.addIndex('quiz_sessions', ['quiz_id']);
    await queryInterface.addIndex('quiz_sessions', ['user_id']);
    await queryInterface.addIndex('quiz_sessions', ['child_id']);
    await queryInterface.addIndex('quiz_sessions', ['status']);
    await queryInterface.addIndex('quiz_sessions', ['start_time']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quiz_sessions');
  }
};
