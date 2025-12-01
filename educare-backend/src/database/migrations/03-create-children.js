'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('children', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false
      },
      photo: {
        type: Sequelize.STRING
      },
      blood_type: {
        type: Sequelize.STRING
      },
      allergies: {
        type: Sequelize.TEXT
      },
      medical_conditions: {
        type: Sequelize.TEXT
      },
      school: {
        type: Sequelize.STRING
      },
      school_grade: {
        type: Sequelize.STRING
      },
      special_needs: {
        type: Sequelize.TEXT
      },
      development_notes: {
        type: Sequelize.TEXT
      },
      documents: {
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
    await queryInterface.addIndex('children', ['profile_id']);
    await queryInterface.addIndex('children', ['birth_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('children');
  }
};
