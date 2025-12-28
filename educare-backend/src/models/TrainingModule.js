const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingModule = sequelize.define('TrainingModule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  training_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'content_items',
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
  description: {
    type: DataTypes.TEXT,
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
  tableName: 'training_modules',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TrainingModule;
