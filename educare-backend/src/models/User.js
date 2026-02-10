const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      // Aceitar números com ou sem o caractere + no início (para compatibilidade internacional)
      is: /^\+?[0-9]{10,15}$/
    }
  },
  cpf_cnpj: {
    type: DataTypes.STRING(18),
    allowNull: true,
    unique: true,
    validate: {
      isValidCpfCnpj(value) {
        if (!value) return; // Permitir null/undefined
        
        // Remover caracteres não numéricos
        const cleanValue = value.replace(/[^\d]/g, '');
        
        // Validar tamanho (CPF: 11 dígitos, CNPJ: 14 dígitos)
        if (cleanValue.length !== 11 && cleanValue.length !== 14) {
          throw new Error('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
        }
        
        // Validar CPF
        if (cleanValue.length === 11) {
          // Verificar se todos os dígitos são iguais
          if (/^(\d)\1{10}$/.test(cleanValue)) {
            throw new Error('CPF inválido');
          }
          
          // Validar dígitos verificadores do CPF
          let sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanValue.charAt(i)) * (10 - i);
          }
          let digit = 11 - (sum % 11);
          if (digit >= 10) digit = 0;
          if (digit !== parseInt(cleanValue.charAt(9))) {
            throw new Error('CPF inválido');
          }
          
          sum = 0;
          for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanValue.charAt(i)) * (11 - i);
          }
          digit = 11 - (sum % 11);
          if (digit >= 10) digit = 0;
          if (digit !== parseInt(cleanValue.charAt(10))) {
            throw new Error('CPF inválido');
          }
        }
        
        // Validar CNPJ
        if (cleanValue.length === 14) {
          // Verificar se todos os dígitos são iguais
          if (/^(\d)\1{13}$/.test(cleanValue)) {
            throw new Error('CNPJ inválido');
          }
          
          // Validar primeiro dígito verificador do CNPJ
          let sum = 0;
          let weight = 5;
          for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanValue.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
          }
          let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
          if (digit !== parseInt(cleanValue.charAt(12))) {
            throw new Error('CNPJ inválido');
          }
          
          // Validar segundo dígito verificador do CNPJ
          sum = 0;
          weight = 6;
          for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanValue.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
          }
          digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
          if (digit !== parseInt(cleanValue.charAt(13))) {
            throw new Error('CNPJ inválido');
          }
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'professional', 'admin', 'owner', 'curator'),
    defaultValue: 'user',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending',
    allowNull: false
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE
  },
  reset_token: {
    type: DataTypes.STRING
  },
  reset_token_expires: {
    type: DataTypes.DATE
  },
  phone_verification_code: {
    type: DataTypes.STRING
  },
  phone_verification_expires: {
    type: DataTypes.DATE
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'stripe_customer_id'
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'stripe_subscription_id'
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, authConfig.saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, authConfig.saltRounds);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(password) {
  try {
    console.log(`Verificando senha para usuário: ${this.id}`);
    
    if (!password || !this.password) {
      console.log('Senha fornecida ou hash armazenado está vazio');
      return false;
    }
    
    // Usar bcrypt.compare para verificar a senha
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
};

module.exports = User;
