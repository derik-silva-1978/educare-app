const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContentItem = sequelize.define('ContentItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('news', 'training', 'course'),
    allowNull: false,
    validate: {
      isIn: [['news', 'training', 'course']]
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('iniciante', 'intermediário', 'avançado'),
    allowNull: true,
    defaultValue: 'iniciante'
  },
  cta_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  cta_text: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Saiba mais'
  },
  target_audience: {
    type: DataTypes.ENUM('all', 'parents', 'professionals'),
    allowNull: false,
    defaultValue: 'all'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'content_items',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

ContentItem.associate = (models) => {
  ContentItem.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });
  
  ContentItem.belongsTo(models.User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });
};

module.exports = ContentItem;
