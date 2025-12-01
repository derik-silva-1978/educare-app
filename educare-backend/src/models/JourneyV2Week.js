const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Week = sequelize.define('JourneyV2Week', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  journey_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  icon: {
    type: DataTypes.STRING(10)
  },
  is_summary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'journey_v2_weeks',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2Week;
