const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserEnrollment = sequelize.define('UserEnrollment', {
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
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active'
  },
  enrolled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripe_subscription_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'user_enrollments',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'content_id']
    }
  ]
});

module.exports = UserEnrollment;
