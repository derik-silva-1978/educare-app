const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserJourney = sequelize.define('UserJourney', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  childId: {
    type: DataTypes.UUID,
    references: {
      model: 'children',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  journeyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'journeys',
      key: 'id'
    }
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE
  },
  currentStep: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM,
    values: ['not_started', 'in_progress', 'completed', 'abandoned'],
    defaultValue: 'not_started'
  },
  notes: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'user_journeys',
  timestamps: true
});

module.exports = UserJourney;
