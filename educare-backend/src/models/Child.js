const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Child = sequelize.define('Child', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'profiles',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM,
    values: ['male', 'female', 'other', 'not_specified'],
    defaultValue: 'not_specified'
  },
  avatarUrl: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  specialNeeds: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  medicalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  educationalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  developmentMilestones: {
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
  tableName: 'children',
  timestamps: true
});

module.exports = Child;
