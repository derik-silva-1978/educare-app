const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaternalAppointment = sequelize.define('MaternalAppointment', {
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
  appointmentType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'appointment_type'
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'doctor_name'
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
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'maternal_appointments',
  timestamps: true,
  underscored: true
});

module.exports = MaternalAppointment;
