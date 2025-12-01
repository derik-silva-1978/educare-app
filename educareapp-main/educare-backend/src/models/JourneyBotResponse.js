const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyBotResponse = sequelize.define('JourneyBotResponse', {
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
  question_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  answer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answer_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  responded_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'journey_bot_responses',
  timestamps: true,
  underscored: true
});

module.exports = JourneyBotResponse;
