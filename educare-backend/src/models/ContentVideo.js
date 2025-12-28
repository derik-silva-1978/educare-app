const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContentVideo = sequelize.define('ContentVideo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'content_items',
      key: 'id'
    }
  },
  vimeo_video_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  vimeo_embed_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  transcription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'content_videos',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ContentVideo;
