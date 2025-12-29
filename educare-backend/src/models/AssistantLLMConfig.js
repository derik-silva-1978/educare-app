const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssistantLLMConfig = sequelize.define('AssistantLLMConfig', {
  module_type: {
    type: DataTypes.ENUM('baby', 'mother', 'professional'),
    primaryKey: true,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'openai'
  },
  model_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'gpt-4o-mini'
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.7,
    validate: {
      min: 0,
      max: 2
    }
  },
  max_tokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1500,
    validate: {
      min: 100,
      max: 16000
    }
  },
  additional_params: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Provider-specific additional parameters like base_url for custom endpoints'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'assistant_llm_configs',
  timestamps: true,
  underscored: true
});

module.exports = AssistantLLMConfig;
