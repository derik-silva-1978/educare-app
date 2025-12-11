const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OfficialMilestone = sequelize.define('OfficialMilestone', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Título do marco (ex: "Sustenta a cabeça")'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descrição detalhada do marco'
  },
  category: {
    type: DataTypes.ENUM('motor', 'cognitivo', 'linguagem', 'social', 'emocional', 'sensorial'),
    allowNull: false,
    comment: 'Categoria/domínio do desenvolvimento'
  },
  target_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Mês alvo esperado para o marco (0-60)'
  },
  min_month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Mês mínimo da janela de desenvolvimento'
  },
  max_month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Mês máximo da janela de desenvolvimento'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'caderneta_crianca_ms',
    comment: 'Fonte oficial (caderneta_crianca_ms, denver, etc.)'
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Ordem de exibição dentro da categoria'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'official_milestones',
  timestamps: true,
  underscored: true
});

module.exports = OfficialMilestone;
