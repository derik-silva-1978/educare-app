const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MilestoneMapping = sequelize.define('MilestoneMapping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  official_milestone_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'FK para official_milestones'
  },
  journey_question_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK para journey_bot_questions (legado)'
  },
  journey_v2_quiz_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK para journey_v2_quizzes (V2)'
  },
  source_type: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'legacy',
    comment: 'Tipo de origem: legacy (JourneyBotQuestion) ou v2 (JourneyV2Quiz)'
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
    comment: 'Se foi gerado automaticamente pelo Auto-Linker'
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
  }
}, {
  tableName: 'milestone_mappings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['verified_by_curator'],
      name: 'idx_milestone_mappings_verified'
    },
    {
      fields: ['is_auto_generated'],
      name: 'idx_milestone_mappings_auto'
    },
    {
      fields: ['journey_v2_quiz_id'],
      name: 'idx_milestone_mappings_v2_quiz'
    },
    {
      fields: ['source_type'],
      name: 'idx_milestone_mappings_source_type'
    }
  ]
});

module.exports = MilestoneMapping;
