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
  dev_domain: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: 'Domínio de desenvolvimento (motor, cognitivo, linguagem, social, emocional, sensorial para baby; nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado para mother)'
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
  },
  content_hash: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: 'SHA-256 hash do conteúdo normalizado para anti-duplicidade'
  },
  classification_source: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Fonte da classificação: rule, ai, manual'
  },
  classification_confidence: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    comment: 'Confiança da classificação (0.0 a 1.0)'
  }
}, {
  tableName: 'journey_v2_quizzes',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Quiz;
