const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaternalDailyHealth = sequelize.define('MaternalDailyHealth', {
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
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bloodPressureSystolic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'blood_pressure_systolic'
  },
  bloodPressureDiastolic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'blood_pressure_diastolic'
  },
  bloodGlucose: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'blood_glucose'
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sleepHours: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    field: 'sleep_hours'
  },
  energyLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'energy_level'
  },
  nauseaLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'nausea_level'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'maternal_daily_health',
  timestamps: true,
  underscored: true
});

module.exports = MaternalDailyHealth;
