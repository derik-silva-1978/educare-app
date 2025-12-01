const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserJourneyV2Badge = sequelize.define('UserJourneyV2Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  child_id: {
    type: DataTypes.UUID,
    references: {
      model: 'children',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  badge_id: {
    type: DataTypes.STRING(50),
    references: {
      model: 'journey_v2_badges',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_journey_v2_badges',
  timestamps: true,
  underscored: true
});

module.exports = UserJourneyV2Badge;
