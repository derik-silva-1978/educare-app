const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Quiz = sequelize.define('JourneyV2Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  week_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2_weeks',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  domain: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  domain_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  feedback: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  knowledge: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'journey_v2_quizzes',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Quiz;
