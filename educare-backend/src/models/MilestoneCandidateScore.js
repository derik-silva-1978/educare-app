const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MilestoneCandidateScore = sequelize.define('MilestoneCandidateScore', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  official_milestone_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'FK para official_milestones'
  },
  journey_question_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'FK para journey_bot_questions'
  },
  relevance_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    },
    comment: 'Score de relevância 0-5 estrelas atribuído pela IA'
  },
  ai_reasoning: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Justificativa da IA para o score atribuído'
  }
}, {
  tableName: 'milestone_candidate_scores',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['official_milestone_id', 'journey_question_id'],
      name: 'unique_milestone_question_score'
    },
    {
      fields: ['relevance_score'],
      name: 'idx_candidate_scores_relevance'
    },
    {
      fields: ['official_milestone_id'],
      name: 'idx_candidate_scores_milestone'
    }
  ]
});

module.exports = MilestoneCandidateScore;
