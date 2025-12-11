const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VaccineHistory = sequelize.define('VaccineHistory', {
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
  vaccineName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'vaccine_name',
    comment: 'Nome da vacina (BCG, Hepatite B, etc)'
  },
  vaccineCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'vaccine_code',
    comment: 'Código padronizado da vacina'
  },
  doseNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'dose_number',
    comment: 'Número da dose (1ª, 2ª, 3ª, reforço)'
  },
  takenAt: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'taken_at',
    comment: 'Data de aplicação'
  },
  scheduledAt: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'scheduled_at',
    comment: 'Data prevista (se ainda não tomou)'
  },
  status: {
    type: DataTypes.ENUM('taken', 'scheduled', 'pending', 'delayed', 'skipped'),
    defaultValue: 'pending'
  },
  ageWeeksWhenTaken: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'age_weeks_when_taken',
    comment: 'Idade em semanas quando tomou'
  },
  rawInput: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'raw_input'
  },
  source: {
    type: DataTypes.ENUM('whatsapp', 'app', 'manual', 'import'),
    defaultValue: 'app'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'batch_number',
    comment: 'Número do lote da vacina'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Local de aplicação (UBS, clínica, etc)'
  }
}, {
  tableName: 'vaccine_history',
  timestamps: true,
  underscored: true
});

module.exports = VaccineHistory;
