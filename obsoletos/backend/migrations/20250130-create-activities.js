'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      age_min_months: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 72 // até 6 anos
        }
      },
      age_max_months: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 72 // até 6 anos
        }
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          isIn: [['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial']]
        }
      },
      difficulty_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 3
        }
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 120
        }
      },
      materials_needed: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: []
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      benefits: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      safety_tips: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      variations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    // Índices para otimizar consultas
    await queryInterface.addIndex('activities', ['age_min_months', 'age_max_months']);
    await queryInterface.addIndex('activities', ['category']);
    await queryInterface.addIndex('activities', ['is_active']);
    await queryInterface.addIndex('activities', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('activities');
  }
};
