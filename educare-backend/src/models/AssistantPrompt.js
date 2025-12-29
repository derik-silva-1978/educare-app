const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssistantPrompt = sequelize.define('AssistantPrompt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  module_type: {
    type: DataTypes.ENUM('baby', 'mother', 'professional'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  system_prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  variables_schema: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Schema JSON das variáveis dinâmicas disponíveis no prompt'
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'assistant_prompts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['module_type', 'is_active'],
      where: { is_active: true },
      name: 'unique_active_prompt_per_module'
    }
  ]
});

module.exports = AssistantPrompt;
