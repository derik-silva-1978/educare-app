const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaternalHealthProfile = sequelize.define('MaternalHealthProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date'
  },
  lastPeriodDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'last_period_date'
  },
  pregnancyWeek: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'pregnancy_week'
  },
  highRisk: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'high_risk'
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'doctor_name'
  },
  nextAppointment: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'next_appointment'
  },
  bloodType: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'blood_type'
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  prePregnancyWeight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'pre_pregnancy_weight'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stage: {
    type: DataTypes.ENUM('pregnancy', 'postpartum', 'planning'),
    defaultValue: 'pregnancy'
  }
}, {
  tableName: 'maternal_health_profiles',
  timestamps: true,
  underscored: true
});

module.exports = MaternalHealthProfile;
