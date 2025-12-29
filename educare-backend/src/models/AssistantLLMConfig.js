const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssistantLLMConfig = sequelize.define('AssistantLLMConfig', {
  module_type: {
    type: DataTypes.ENUM('baby', 'mother', 'professional'),
    primaryKey: true,
    allowNull: false
  },
  provider: {
    type: DataTypes.ENUM('openai', 'gemini'),
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
      max: 8000
    }
  },
  additional_params: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Provider-specific additional parameters'
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

AssistantLLMConfig.AVAILABLE_MODELS = {
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Rápido e econômico', context_window: 128000 },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Mais capaz, maior custo', context_window: 128000 },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Versão turbo do GPT-4', context_window: 128000 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Econômico para tarefas simples', context_window: 16385 }
  ],
  gemini: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Modelo mais recente e rápido', context_window: 1000000 },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Rápido com grande contexto', context_window: 1000000 },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Mais capaz, melhor raciocínio', context_window: 2000000 }
  ]
};

module.exports = AssistantLLMConfig;
