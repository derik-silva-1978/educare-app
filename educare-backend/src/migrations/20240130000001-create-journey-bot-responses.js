'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('journey_bot_responses', {
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
      question_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      answer: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      answer_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    await queryInterface.addIndex('journey_bot_responses', ['user_id']);
    await queryInterface.addIndex('journey_bot_responses', ['child_id']);
    await queryInterface.addIndex('journey_bot_responses', ['question_id']);
    await queryInterface.addIndex('journey_bot_responses', ['user_id', 'child_id']);
    await queryInterface.addIndex('journey_bot_responses', ['responded_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('journey_bot_responses');
  }
};
