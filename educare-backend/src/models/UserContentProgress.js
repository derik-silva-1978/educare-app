const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserContentProgress = sequelize.define('UserContentProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'content_items',
      key: 'id'
    }
  },
  lesson_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'training_lessons',
      key: 'id'
    }
  },
  progress_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  watched_duration_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_content_progress',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'content_id', 'lesson_id']
    }
  ]
});

module.exports = UserContentProgress;
