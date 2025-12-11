const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo FaqUserFeedback - Rastreamento de votos únicos por usuário/IP
 * 
 * Impede que o mesmo usuário/IP vote múltiplas vezes na mesma FAQ.
 * Permite alterar o voto (trocar upvote por downvote).
 */
const FaqUserFeedback = sequelize.define('FaqUserFeedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  faq_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Referência à FAQ votada'
  },
  
  user_identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'IP ou userId para identificar votante único'
  },
  
  identifier_type: {
    type: DataTypes.ENUM('ip', 'user_id', 'session'),
    allowNull: false,
    defaultValue: 'ip',
    comment: 'Tipo de identificador usado'
  },
  
  feedback_type: {
    type: DataTypes.ENUM('upvote', 'downvote'),
    allowNull: false,
    comment: 'Tipo de voto dado'
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
  tableName: 'faq_user_feedback',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    // Índice único composto para evitar votos duplicados
    {
      name: 'idx_unique_faq_user_vote',
      unique: true,
      fields: ['faq_id', 'user_identifier']
    },
    // Índice para consultas por FAQ
    {
      name: 'idx_feedback_faq_id',
      fields: ['faq_id']
    },
    // Índice para consultas por usuário
    {
      name: 'idx_feedback_user',
      fields: ['user_identifier']
    }
  ]
});

module.exports = FaqUserFeedback;
