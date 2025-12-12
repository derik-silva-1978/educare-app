const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChildDevelopmentReport = sequelize.define('ChildDevelopmentReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  child_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  session_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  age_range_months: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  answered_questions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  completion_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  overall_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  dimension_scores: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  recommendations: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  concerns: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  report_data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'generated', 'reviewed', 'shared'],
    defaultValue: 'generated'
  },
  generated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  shared_with_professionals: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'child_development_reports',
  timestamps: true,
  underscored: true
});

module.exports = ChildDevelopmentReport;
