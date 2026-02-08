const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AgentModelRanking = sequelize.define('AgentModelRanking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  module_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['baby', 'mother', 'professional', 'landing_chat', 'quiz_baby', 'quiz_mother', 'content_generator', 'curation_baby_quiz', 'curation_mother_quiz', 'curation_baby_content', 'curation_mother_content', 'media_metadata', 'nlp_biometric', 'nlp_sleep', 'nlp_appointment', 'nlp_vaccine']]
    }
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  model_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  stars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 5
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cost_rating: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'medium'
  },
  speed_rating: {
    type: DataTypes.ENUM('slow', 'medium', 'fast'),
    allowNull: true,
    defaultValue: 'medium'
  },
  quality_rating: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'medium'
  },
  rated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'agent_model_rankings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['module_type', 'provider', 'model_name'],
      name: 'unique_ranking_per_model_agent'
    }
  ]
});

module.exports = AgentModelRanking;
