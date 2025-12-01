const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM,
    values: ['milestone', 'quiz', 'activity', 'login', 'streak', 'special'],
    defaultValue: 'milestone'
  },
  category: {
    type: DataTypes.STRING
  },
  iconUrl: {
    type: DataTypes.STRING
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'achievements',
  timestamps: true
});

module.exports = Achievement;
