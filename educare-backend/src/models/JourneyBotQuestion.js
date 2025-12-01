const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyBotQuestion = sequelize.define('JourneyBotQuestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    
    // Metadados do módulo
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título do módulo/meta'
    },
    meta_min_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Idade mínima em meses (metadados)'
    },
    meta_max_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Idade máxima em meses (metadados)'
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição do módulo/meta'
    },
    
    // Dados da semana
    week: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Número da semana'
    },
    week_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título da semana'
    },
    week_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição da semana'
    },
    
    // Gamificação - Boas-vindas
    gamification_welcome_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título da mensagem de boas-vindas'
    },
    gamification_welcome_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem de boas-vindas'
    },
    
    // Gamificação - Badge
    gamification_badge_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nome do badge/conquista'
    },
    gamification_badge_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição do badge/conquista'
    },
    
    // Gamificação - Progresso
    gamification_progress_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem de progresso'
    },
    
    // Gamificação - Desafio semanal
    gamification_weekly_challenge_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título do desafio semanal'
    },
    gamification_weekly_challenge_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição do desafio semanal'
    },
    
    // Gamificação - Dicas
    gamification_tips: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Dicas de gamificação'
    },
    
    // Gamificação - Mensagem de encerramento
    gamification_closing_message_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título da mensagem de encerramento'
    },
    gamification_closing_message_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem de encerramento'
    },
    
    // Gamificação - Registro afetivo
    gamification_registro_afetivo_question: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Pergunta do registro afetivo'
    },
    gamification_registro_afetivo_options: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Opções do registro afetivo'
    },
    
    // Gamificação - Mensagem personalizada
    gamification_personalized_message_title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Título da mensagem personalizada'
    },
    gamification_personalized_message_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem personalizada'
    },
    
    // Dados da pergunta principal
    domain_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nome do domínio (communication, motor, etc.)'
    },
    domain_question: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Texto da pergunta principal'
    },
    domain_importance: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Importância/relevância da pergunta'
    },
    
    // Feedbacks
    domain_feedback_1: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Feedback para resposta 1 (geralmente positiva)'
    },
    domain_feedback_2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Feedback para resposta 2 (geralmente neutra)'
    },
    domain_feedback_3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Feedback para resposta 3 (geralmente negativa)'
    },
    
    // Atividades e alertas
    domain_activities: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Atividades sugeridas relacionadas ao domínio'
    },
    domain_alert_missing: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Alerta quando marco não é atingido'
    },
    
    // Campos de controle
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Ordem da pergunta'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Se a pergunta está ativa'
    },
    
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'journey_bot_questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['meta_min_months', 'meta_max_months']
      },
      {
        fields: ['domain_name']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['order_index']
      },
      {
        fields: ['week']
      }
    ]
  });

module.exports = JourneyBotQuestion;
