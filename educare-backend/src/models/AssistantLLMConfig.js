const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssistantLLMConfig = sequelize.define('AssistantLLMConfig', {
  module_type: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    validate: {
      isIn: [['baby', 'mother', 'professional', 'landing_chat', 'quiz_baby', 'quiz_mother', 'content_generator', 'curation_baby_quiz', 'curation_mother_quiz', 'curation_baby_content', 'curation_mother_content', 'media_metadata', 'nlp_biometric', 'nlp_sleep', 'nlp_appointment', 'nlp_vaccine']]
    }
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
  rag_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this agent uses RAG (vector database queries)'
  },
  rag_knowledge_base: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
    validate: {
      isIn: [['kb_baby', 'kb_mother', 'kb_professional', 'landing', null]]
    },
    comment: 'Which knowledge base this agent queries (null = none)'
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
