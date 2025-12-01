const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyBotSession = sequelize.define('JourneyBotSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  child_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'children',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  answered_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'completed', 'paused'],
    defaultValue: 'active'
  },
  session_data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'journey_bot_sessions',
  timestamps: true,
  underscored: true
});

module.exports = JourneyBotSession;
