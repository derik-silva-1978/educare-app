const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Journey = sequelize.define('Journey', {
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
    values: ['development', 'education', 'health', 'custom'],
    defaultValue: 'development'
  },
  category: {
    type: DataTypes.STRING
  },
  ageRangeMin: {
    type: DataTypes.INTEGER
  },
  ageRangeMax: {
    type: DataTypes.INTEGER
  },
  iconUrl: {
    type: DataTypes.STRING
  },
  coverImageUrl: {
    type: DataTypes.STRING
  },
  steps: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  duration: {
    type: DataTypes.INTEGER // em dias
  },
  difficulty: {
    type: DataTypes.ENUM,
    values: ['easy', 'medium', 'hard', 'variable'],
    defaultValue: 'medium'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'journeys',
  timestamps: true
});

module.exports = Journey;
