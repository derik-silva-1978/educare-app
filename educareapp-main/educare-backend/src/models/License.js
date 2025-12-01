const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const License = sequelize.define('License', {
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
    values: ['individual', 'team', 'enterprise', 'educational'],
    defaultValue: 'individual'
  },
  maxUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  maxChildren: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  features: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  restrictions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'licenses',
  timestamps: true
});

module.exports = License;
