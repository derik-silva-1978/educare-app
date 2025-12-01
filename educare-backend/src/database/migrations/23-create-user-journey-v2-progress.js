'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_journey_v2_progress', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      child_id: {
        type: Sequelize.UUID,
        references: {
          model: 'children',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      journey_id: {
        type: Sequelize.UUID,
        references: {
          model: 'journey_v2',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      week_id: {
        type: Sequelize.UUID,
        references: {
          model: 'journey_v2_weeks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      completed_topics: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      completed_quizzes: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      progress: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      started_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      completed_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_journey_v2_progress');
  }
};
