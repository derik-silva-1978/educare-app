const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizSession = sequelize.define('QuizSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  childId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'children',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  quizType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM,
    values: ['in_progress', 'completed', 'abandoned'],
    defaultValue: 'in_progress'
  },
  score: {
    type: DataTypes.FLOAT
  },
  duration: {
    type: DataTypes.INTEGER // em segundos
  },
  answers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  results: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  feedback: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'quiz_sessions',
  timestamps: true
});

module.exports = QuizSession;
