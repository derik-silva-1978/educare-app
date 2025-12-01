const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'subscription_plans',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'trial', 'canceled', 'expired', 'pending'],
    defaultValue: 'pending'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE
  },
  lastBillingDate: {
    type: DataTypes.DATE
  },
  nextBillingDate: {
    type: DataTypes.DATE
  },
  canceledAt: {
    type: DataTypes.DATE
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  childrenCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usageStats: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

module.exports = Subscription;
