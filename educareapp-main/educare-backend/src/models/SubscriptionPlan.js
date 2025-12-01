const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'BRL',
    allowNull: false
  },
  billing_cycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'semiannual', 'annual'),
    defaultValue: 'monthly',
    allowNull: false
  },
  trial_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  features: {
    type: DataTypes.JSONB,
    defaultValue: {
      tiriNautaWhatsapp: false,
      tiriNautaWeb: false,
      tiriNautaComplete: false,
      tiriNautaBusiness: false,
      basicReports: false,
      detailedReports: false,
      advancedReports: false,
      educareAcademy: false,
      educareAcademyComplete: false,
      progressNotifications: false,
      whatsappGroups: false,
      livesAndMentoring: false,
      monthlyMentoring: false,
      journeyDashboard: false,
      prioritySupport: false,
      chatSupport: false,
      blogAccess: false,
      basicAssessments: false,
      professionalSharing: false
    }
  },
  limits: {
    type: DataTypes.JSONB,
    defaultValue: {
      maxChildren: 1,
      maxQuizzes: 5,
      maxJourneys: 2,
      maxDocuments: 10,
      maxProfessionals: 0
    }
  }
}, {
  tableName: 'subscription_plans',
  timestamps: true
});

module.exports = SubscriptionPlan;
