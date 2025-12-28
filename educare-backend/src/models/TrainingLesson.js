const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingLesson = sequelize.define('TrainingLesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  module_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'training_modules',
      key: 'id'
    }
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'video'
  },
  video_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'content_videos',
      key: 'id'
    }
  },
  content_data: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'training_lessons',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TrainingLesson;
