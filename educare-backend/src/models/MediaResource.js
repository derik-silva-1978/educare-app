const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MediaResource = sequelize.define('MediaResource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resource_type: {
    type: DataTypes.ENUM('text', 'audio', 'image', 'pdf', 'video', 'link'),
    allowNull: false,
    validate: {
      isIn: [['text', 'audio', 'image', 'pdf', 'video', 'link']]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tts_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tts_endpoint: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tts_voice: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  age_range_min: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 216 // 18 anos em meses
    }
  },
  age_range_max: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 216
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'media_resources',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeValidate: (resource) => {
      // Validação customizada: se for TTS, deve ter endpoint
      if (resource.tts_enabled && !resource.tts_endpoint) {
        throw new Error('TTS endpoint é obrigatório quando TTS está habilitado');
      }
      
      // Validação: se for link, deve ter content
      if (resource.resource_type === 'link' && !resource.content) {
        throw new Error('URL é obrigatória para recursos do tipo link');
      }
      
      // Validação: se for arquivo, deve ter file_url
      if (['audio', 'image', 'pdf', 'video'].includes(resource.resource_type) && !resource.file_url) {
        throw new Error('Arquivo é obrigatório para este tipo de recurso');
      }
    }
  }
});

// Associações
MediaResource.associate = (models) => {
  MediaResource.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });
  
  MediaResource.belongsTo(models.User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });
};

module.exports = MediaResource;
