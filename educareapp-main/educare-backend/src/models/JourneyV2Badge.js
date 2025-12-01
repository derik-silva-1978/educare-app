const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Badge = sequelize.define('JourneyV2Badge', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(10)
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING(50)
  },
  week_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2_weeks',
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'journey_v2_badges',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Badge;
