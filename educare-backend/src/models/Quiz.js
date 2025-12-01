const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  ageRangeMin: {
    type: DataTypes.INTEGER
  },
  ageRangeMax: {
    type: DataTypes.INTEGER
  },
  difficulty: {
    type: DataTypes.ENUM,
    values: ['easy', 'medium', 'hard', 'variable'],
    defaultValue: 'medium'
  },
  estimatedTime: {
    type: DataTypes.INTEGER // em minutos
  },
  instructions: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  questionOrder: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  passingScore: {
    type: DataTypes.FLOAT,
    defaultValue: 60
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;
