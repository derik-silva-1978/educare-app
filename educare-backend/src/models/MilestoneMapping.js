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
    allowNull: false,
    comment: 'FK para journey_bot_questions'
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
      unique: true,
      fields: ['official_milestone_id', 'journey_question_id'],
      name: 'unique_milestone_question_mapping'
    },
    {
      fields: ['verified_by_curator'],
      name: 'idx_milestone_mappings_verified'
    },
    {
      fields: ['is_auto_generated'],
      name: 'idx_milestone_mappings_auto'
    }
  ]
});

module.exports = MilestoneMapping;
