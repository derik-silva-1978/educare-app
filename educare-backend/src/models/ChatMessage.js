const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chat_group_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'chat_groups',
      key: 'id'
    }
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sender_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sender_role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['parent', 'professional', 'ai_assistant']]
    }
  },
  message_content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message_type: {
    type: DataTypes.ENUM('text', 'file', 'image', 'ai_summary', 'system'),
    defaultValue: 'text'
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
    allowNull: true
  },
  reply_to_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'chat_messages',
      key: 'id'
    }
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
    defaultValue: 'sent'
  },
  is_ai_processed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'chat_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Definir associações
ChatMessage.associate = (models) => {
  // Associação com User (sender)
  ChatMessage.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender'
  });
  
  // Associação com ChatGroup
  ChatMessage.belongsTo(models.ChatGroup, {
    foreignKey: 'chat_group_id',
    as: 'chatGroup'
  });
  
  // Auto-associação para replies
  ChatMessage.belongsTo(ChatMessage, {
    foreignKey: 'reply_to_id',
    as: 'replyTo'
  });
  
  ChatMessage.hasMany(ChatMessage, {
    foreignKey: 'reply_to_id',
    as: 'replies'
  });
};

module.exports = ChatMessage;
