const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2 = sequelize.define('JourneyV2', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  trail: {
    type: DataTypes.STRING(50),
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
  month: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'journey_v2',
  timestamps: true,
  underscored: true
});

module.exports = JourneyV2;
