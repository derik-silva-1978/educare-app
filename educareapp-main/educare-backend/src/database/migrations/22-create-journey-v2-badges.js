'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('journey_v2_badges', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING(10)
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING(50)
      },
      week_id: {
        type: Sequelize.UUID,
        references: {
          model: 'journey_v2_weeks',
          key: 'id'
        },
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('journey_v2_badges');
  }
};
