const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Topic = sequelize.define('JourneyV2Topic', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dev_domain: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: 'Domínio de desenvolvimento (motor, cognitivo, etc. para baby; nutricao, saude_mental, etc. para mother)'
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
  tableName: 'journey_v2_topics',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Topic;
