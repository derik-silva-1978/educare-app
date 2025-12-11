const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo AppFaq - FAQ Dinâmica Contextual
 * 
 * Tabela que armazena perguntas frequentes contextualizadas por idade da criança.
 * Utiliza algoritmo de ranqueamento para sugerir FAQs relevantes baseado em:
 * - Idade da criança (semanas)
 * - Uso e feedback dos usuários (upvotes/downvotes)
 * - Categorias de conteúdo (bebê, mãe, sistema)
 */
const AppFaq = sequelize.define('AppFaq', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'UUID único da FAQ'
  },
  
  // Categorização de conteúdo
  category: {
    type: DataTypes.ENUM('child', 'mother', 'system'),
    allowNull: false,
    defaultValue: 'child',
    comment: 'Categoria: child (bebê), mother (mãe), system (sistema)'
  },
  
  // Conteúdo da pergunta
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Texto da pergunta em primeira pessoa (ex: "Meu bebê dorme pouco")'
  },
  
  // Contexto para RAG (injetar no prompt da IA)
  answer_rag_context: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Contexto opcional para injetar no prompt da IA/RAG'
  },
  
  // Intervalo de vigência (em semanas)
  min_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Semana mínima de vigência (ex: 0 para recém-nascido)'
  },
  
  max_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 999,
    comment: 'Semana máxima de vigência (ex: 24 para 6 meses)'
  },
  
  // Flag de dados semente
  is_seed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'TRUE = inserida pelo sistema (seed), FALSE = inserida por admin/usuário'
  },
  
  // Métricas de engajamento (utilizadas no score de ranqueamento)
  usage_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Quantas vezes esta FAQ foi acessada/clicada'
  },
  
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de upvotes (avaliação positiva)'
  },
  
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de downvotes (avaliação negativa)'
  },
  
  // Soft Delete
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    comment: 'Data de exclusão (soft delete) - NULL significa ativo'
  },
  
  // Auditoria
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
  tableName: 'app_faqs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false, // Usamos deleted_at manual, não paranoid do Sequelize
  indexes: [
    // Índice composto para filtro por intervalo de semanas (Performance crítica)
    {
      name: 'idx_faqs_weeks',
      fields: ['min_week', 'max_week']
    },
    // Índice para ordenação por score de ranqueamento
    {
      name: 'idx_faqs_ranking',
      fields: ['usage_count', 'upvotes']
    },
    // Índice para filtro por categoria
    {
      name: 'idx_faqs_category',
      fields: ['category']
    },
    // Índice para filtro por seed data
    {
      name: 'idx_faqs_seed',
      fields: ['is_seed']
    },
    // Índice para soft delete
    {
      name: 'idx_faqs_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = AppFaq;
