const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KbMother = sequelize.define('KbMother', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  embedding: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true
  },
  source_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['educare', 'oms', 'bncc', 'ministerio_saude', 'outro']]
    }
  },
  file_search_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  original_filename: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  },
  trimester: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  domain: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true
  },
  migrated_from: {
    type: DataTypes.UUID,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'kb_mother',
  timestamps: true,
  underscored: true
});

module.exports = KbMother;
