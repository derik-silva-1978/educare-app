const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Topic = sequelize.define('JourneyV2Topic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  week_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2_weeks',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'journey_v2_topics',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Topic;
