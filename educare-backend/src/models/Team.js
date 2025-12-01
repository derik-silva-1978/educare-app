const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  licenseId: {
    type: DataTypes.UUID,
    references: {
      model: 'licenses',
      key: 'id'
    }
  },
  logoUrl: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM,
    values: ['professional', 'educational', 'family', 'other'],
    defaultValue: 'professional'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'teams',
  timestamps: true
});

// Definir associações
Team.associate = function(models) {
  // Team pertence a um User (owner)
  Team.belongsTo(models.User, {
    foreignKey: 'ownerId',
    as: 'owner'
  });
  
  // Team tem muitos TeamMembers
  Team.hasMany(models.TeamMember, {
    foreignKey: 'teamId',
    as: 'members'
  });
};

module.exports = Team;
