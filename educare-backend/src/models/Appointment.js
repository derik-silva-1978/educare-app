const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
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
  doctorName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'doctor_name'
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Especialidade médica (pediatra, neurologista, etc)'
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'appointment_date'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'canceled', 'rescheduled'),
    defaultValue: 'scheduled'
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
  },
  reminder: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Se deve enviar lembrete'
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true
});

module.exports = Appointment;
