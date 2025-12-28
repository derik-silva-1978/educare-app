const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContentPricing = sequelize.define('ContentPricing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'content_items',
      key: 'id'
    }
  },
  price_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'free'
  },
  price_brl: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  price_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  billing_period: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  stripe_price_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  stripe_product_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'content_pricing',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ContentPricing;
