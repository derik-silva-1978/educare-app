const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
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
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 2000]
    }
  },
  age_min_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'age_min_months',
    validate: {
      min: 0,
      max: 72,
      isInt: true
    }
  },
  age_max_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'age_max_months',
    validate: {
      min: 0,
      max: 72,
      isInt: true,
      isGreaterThanMin(value) {
        if (value < this.age_min_months) {
          throw new Error('Idade máxima deve ser maior ou igual à idade mínima');
        }
      }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isIn: [['motor_grosso', 'motor_fino', 'cognitivo', 'linguagem', 'social', 'sensorial']]
    }
  },
  difficulty_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'difficulty_level',
    validate: {
      min: 1,
      max: 3,
      isInt: true
    }
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'duration_minutes',
    validate: {
      min: 1,
      max: 120,
      isInt: true
    }
  },
  materials_needed: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
    field: 'materials_needed'
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 5000]
    }
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  safety_tips: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'safety_tips',
    validate: {
      len: [0, 2000]
    }
  },
  variations: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
    validate: {
      isUrl: true
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'activities',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['age_min_months', 'age_max_months']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Associações
Activity.associate = (models) => {
  Activity.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });
};

// Métodos de instância
Activity.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  // Converter snake_case para camelCase para o frontend
  return {
    id: values.id,
    title: values.title,
    description: values.description,
    ageMinMonths: values.age_min_months,
    ageMaxMonths: values.age_max_months,
    category: values.category,
    difficultyLevel: values.difficulty_level,
    durationMinutes: values.duration_minutes,
    materialsNeeded: values.materials_needed || [],
    instructions: values.instructions,
    benefits: values.benefits,
    safetyTips: values.safety_tips,
    variations: values.variations,
    imageUrl: values.image_url,
    isActive: values.is_active,
    createdBy: values.created_by,
    createdAt: values.created_at,
    updatedAt: values.updated_at
  };
};

// Métodos estáticos
Activity.findByAgeRange = async function(ageMonths, options = {}) {
  const { category, limit = 10, offset = 0 } = options;
  
  const whereClause = {
    age_min_months: { [sequelize.Sequelize.Op.lte]: ageMonths },
    age_max_months: { [sequelize.Sequelize.Op.gte]: ageMonths },
    is_active: true
  };
  
  if (category) {
    whereClause.category = category;
  }
  
  return await Activity.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [{
      model: sequelize.models.User,
      as: 'creator',
      attributes: ['id', 'name', 'email']
    }]
  });
};

Activity.getCategories = function() {
  return [
    { value: 'motor_grosso', label: 'Motor Grosso' },
    { value: 'motor_fino', label: 'Motor Fino' },
    { value: 'cognitivo', label: 'Cognitivo' },
    { value: 'linguagem', label: 'Linguagem' },
    { value: 'social', label: 'Social' },
    { value: 'sensorial', label: 'Sensorial' }
  ];
};

Activity.getDifficultyLevels = function() {
  return [
    { value: 1, label: 'Fácil' },
    { value: 2, label: 'Médio' },
    { value: 3, label: 'Difícil' }
  ];
};

module.exports = Activity;
