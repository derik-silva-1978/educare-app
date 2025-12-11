const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SleepLog = sequelize.define('SleepLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  childId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'child_id'
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'start_time',
    comment: 'Hora que começou a dormir'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'end_time',
    comment: 'Hora que acordou'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'duration_minutes',
    comment: 'Duração em minutos'
  },
  sleepType: {
    type: DataTypes.ENUM('night', 'nap', 'unknown'),
    defaultValue: 'unknown',
    field: 'sleep_type'
  },
  quality: {
    type: DataTypes.ENUM('good', 'regular', 'poor', 'unknown'),
    defaultValue: 'unknown'
  },
  rawInput: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'raw_input',
    comment: 'Texto original enviado pelo usuário'
  },
  source: {
    type: DataTypes.ENUM('whatsapp', 'app', 'manual'),
    defaultValue: 'app'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sleep_logs',
  timestamps: true,
  underscored: true
});

module.exports = SleepLog;
