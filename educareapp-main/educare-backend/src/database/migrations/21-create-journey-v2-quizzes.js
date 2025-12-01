'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('journey_v2_quizzes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      week_id: {
        type: Sequelize.UUID,
        references: {
          model: 'journey_v2_weeks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      domain: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      domain_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      feedback: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      knowledge: {
        type: Sequelize.JSONB,
        allowNull: false
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
    await queryInterface.dropTable('journey_v2_quizzes');
  }
};
