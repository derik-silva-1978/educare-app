const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserJourneyV2Progress = sequelize.define('UserJourneyV2Progress', {
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
  journey_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  week_id: {
    type: DataTypes.UUID,
    references: {
      model: 'journey_v2_weeks',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  completed_topics: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  completed_quizzes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'user_journey_v2_progress',
  timestamps: true,
  underscored: true
});

module.exports = UserJourneyV2Progress;
