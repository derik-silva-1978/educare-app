'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questions', {
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('multiple_choice', 'single_choice', 'text', 'scale', 'boolean', 'date'),
        defaultValue: 'multiple_choice',
        allowNull: false
      },
      options: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      correct_answer: {
        type: Sequelize.JSONB,
        comment: 'Resposta correta para questões com resposta definida'
      },
      explanation: {
        type: Sequelize.TEXT,
        comment: 'Explicação da resposta correta'
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
    await queryInterface.addIndex('questions', ['quiz_id']);
    await queryInterface.addIndex('questions', ['type']);
    await queryInterface.addIndex('questions', ['order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('questions');
  }
};
