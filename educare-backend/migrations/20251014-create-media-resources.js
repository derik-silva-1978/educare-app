'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('media_resources', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Título do recurso'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descrição detalhada do recurso'
      },
      resource_type: {
        type: Sequelize.ENUM('text', 'audio', 'image', 'pdf', 'video', 'link'),
        allowNull: false,
        comment: 'Tipo do recurso'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Conteúdo textual ou URL do link'
      },
      file_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL do arquivo uploadado (S3, local storage, etc)'
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Nome original do arquivo'
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tamanho do arquivo em bytes'
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Tipo MIME do arquivo'
      },
      tts_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Se deve usar TTS para gerar áudio'
      },
      tts_endpoint: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Endpoint da ferramenta TTS'
      },
      tts_voice: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Voz a ser usada no TTS'
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Categoria do recurso (educacional, terapêutico, etc)'
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
        comment: 'Tags para busca e organização'
      },
      age_range_min: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Idade mínima recomendada em meses'
      },
      age_range_max: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Idade máxima recomendada em meses'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Se o recurso está ativo'
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Se o recurso é público ou restrito'
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Número de visualizações'
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Usuário que criou o recurso'
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Último usuário que atualizou'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices para melhor performance
    await queryInterface.addIndex('media_resources', ['resource_type']);
    await queryInterface.addIndex('media_resources', ['category']);
    await queryInterface.addIndex('media_resources', ['is_active']);
    await queryInterface.addIndex('media_resources', ['created_by']);
    await queryInterface.addIndex('media_resources', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('media_resources');
  }
};
