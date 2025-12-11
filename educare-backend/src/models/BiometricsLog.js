const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BiometricsLog = sequelize.define('BiometricsLog', {
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
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Peso em kg'
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Altura em cm'
  },
  headCircumference: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'head_circumference',
    comment: 'Perímetro cefálico em cm'
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
  recordedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'recorded_at'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'biometrics_logs',
  timestamps: true,
  underscored: true
});

module.exports = BiometricsLog;
