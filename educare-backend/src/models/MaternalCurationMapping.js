const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaternalCurationMapping = sequelize.define('MaternalCurationMapping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  maternal_domain: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['nutricao', 'saude_mental', 'recuperacao', 'amamentacao', 'saude_fisica', 'autocuidado', 'unknown']]
    },
    comment: 'Domínio materno de classificação'
  },
  journey_v2_quiz_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK para journey_v2_quizzes'
  },
  journey_v2_topic_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK para journey_v2_topics'
  },
  relevance_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 0, max: 5 },
    comment: 'Score de relevância 0-5 atribuído pelo TitiNauta Materna'
  },
  ai_reasoning: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Justificativa da IA para o score'
  },
  weight: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 1.0,
    comment: 'Peso do vínculo (0.0 a 1.0)'
  },
  is_auto_generated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Se foi gerado automaticamente pelo TitiNauta Materna'
  },
  verified_by_curator: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Se foi verificado/aprovado por um curador'
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data da verificação'
  },
  verified_by: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID do usuário curador que verificou'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas do curador sobre o mapeamento'
  },
  source_type: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'v2',
    comment: 'Tipo de origem'
  }
}, {
  tableName: 'maternal_curation_mappings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['maternal_domain'],
      name: 'idx_maternal_curation_domain'
    },
    {
      fields: ['journey_v2_quiz_id'],
      name: 'idx_maternal_curation_quiz'
    },
    {
      fields: ['journey_v2_topic_id'],
      name: 'idx_maternal_curation_topic'
    },
    {
      fields: ['verified_by_curator'],
      name: 'idx_maternal_curation_verified'
    }
  ]
});

module.exports = MaternalCurationMapping;
