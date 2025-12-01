const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quizType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM,
    values: ['multiple_choice', 'single_choice', 'text', 'scale', 'boolean', 'image_selection'],
    defaultValue: 'multiple_choice'
  },
  options: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  correctAnswer: {
    type: DataTypes.JSONB
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  category: {
    type: DataTypes.STRING
  },
  difficulty: {
    type: DataTypes.ENUM,
    values: ['easy', 'medium', 'hard'],
    defaultValue: 'medium'
  },
  ageRangeMin: {
    type: DataTypes.INTEGER
  },
  ageRangeMax: {
    type: DataTypes.INTEGER
  },
  developmentArea: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;
