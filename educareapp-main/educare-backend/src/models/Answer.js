const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quiz_sessions',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  answer: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  timeSpent: {
    type: DataTypes.INTEGER // em segundos
  },
  feedback: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'answers',
  timestamps: true
});

module.exports = Answer;
