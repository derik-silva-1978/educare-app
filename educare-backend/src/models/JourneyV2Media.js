const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JourneyV2Media = sequelize.define('JourneyV2Media', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  journey_v2_topic_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'journey_v2_topics', key: 'id' },
    onDelete: 'CASCADE',
    comment: 'FK para journey_v2_topics'
  },
  journey_v2_quiz_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'journey_v2_quizzes', key: 'id' },
    onDelete: 'CASCADE',
    comment: 'FK para journey_v2_quizzes'
  },
  media_resource_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Referência lógica para media_resources (sem FK por restrição de permissão)'
  },
  block_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'attachment',
    comment: 'Tipo do bloco: audio, image, video, pdf, link, attachment'
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Posição do media dentro do conteúdo'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Metadados adicionais (ex: tts_provider, voice_id)'
  }
}, {
  tableName: 'journey_v2_media',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['journey_v2_topic_id'],
      name: 'idx_v2_media_topic'
    },
    {
      fields: ['journey_v2_quiz_id'],
      name: 'idx_v2_media_quiz'
    },
    {
      fields: ['media_resource_id'],
      name: 'idx_v2_media_resource'
    }
  ]
});

module.exports = JourneyV2Media;
