'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quizzes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      creator_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      category: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM('assessment', 'survey', 'educational', 'developmental'),
        defaultValue: 'assessment',
        allowNull: false
      },
      age_range_min: {
        type: Sequelize.INTEGER,
        comment: 'Idade mínima em meses'
      },
      age_range_max: {
        type: Sequelize.INTEGER,
        comment: 'Idade máxima em meses'
      },
      estimated_time: {
        type: Sequelize.INTEGER,
        comment: 'Tempo estimado em minutos'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      requires_professional: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addIndex('quizzes', ['creator_id']);
    await queryInterface.addIndex('quizzes', ['category']);
    await queryInterface.addIndex('quizzes', ['type']);
    await queryInterface.addIndex('quizzes', ['is_active']);
    await queryInterface.addIndex('quizzes', ['is_public']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quizzes');
  }
};
