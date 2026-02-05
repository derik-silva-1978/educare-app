const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaternalMentalHealth = sequelize.define('MaternalMentalHealth', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'profile_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  moodScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'mood_score'
  },
  anxietyLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'anxiety_level'
  },
  stressLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'stress_level'
  },
  sleepQuality: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'sleep_quality'
  },
  supportFeeling: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'support_feeling'
  },
  concerns: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  positiveMoments: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'positive_moments'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'maternal_mental_health',
  timestamps: true,
  underscored: true
});

module.exports = MaternalMentalHealth;
