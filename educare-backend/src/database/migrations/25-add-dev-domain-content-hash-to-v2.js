'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const [quizColumns] = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'journey_v2_quizzes'`,
        { transaction }
      );
      const quizColNames = quizColumns.map(c => c.column_name);

      if (!quizColNames.includes('dev_domain')) {
        await queryInterface.addColumn('journey_v2_quizzes', 'dev_domain', {
          type: Sequelize.STRING(30),
          allowNull: true,
          comment: 'Domínio de desenvolvimento (motor, cognitivo, linguagem, social, emocional, sensorial para baby; nutricao, saude_mental, recuperacao, amamentacao, saude_fisica, autocuidado para mother)'
        }, { transaction });
      }

      if (!quizColNames.includes('content_hash')) {
        await queryInterface.addColumn('journey_v2_quizzes', 'content_hash', {
          type: Sequelize.STRING(64),
          allowNull: true,
          comment: 'SHA-256 hash do conteúdo normalizado para anti-duplicidade'
        }, { transaction });
      }

      if (!quizColNames.includes('classification_source')) {
        await queryInterface.addColumn('journey_v2_quizzes', 'classification_source', {
          type: Sequelize.STRING(20),
          allowNull: true,
          defaultValue: null,
          comment: 'Fonte da classificação de domínio: rule, ai, manual'
        }, { transaction });
      }

      if (!quizColNames.includes('classification_confidence')) {
        await queryInterface.addColumn('journey_v2_quizzes', 'classification_confidence', {
          type: Sequelize.DECIMAL(3, 2),
          allowNull: true,
          defaultValue: null,
          comment: 'Confiança da classificação (0.0 a 1.0)'
        }, { transaction });
      }

      const [topicColumns] = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'journey_v2_topics'`,
        { transaction }
      );
      const topicColNames = topicColumns.map(c => c.column_name);

      if (!topicColNames.includes('dev_domain')) {
        await queryInterface.addColumn('journey_v2_topics', 'dev_domain', {
          type: Sequelize.STRING(30),
          allowNull: true,
          comment: 'Domínio de desenvolvimento (motor, cognitivo, etc. para baby; nutricao, saude_mental, etc. para mother)'
        }, { transaction });
      }

      if (!topicColNames.includes('content_hash')) {
        await queryInterface.addColumn('journey_v2_topics', 'content_hash', {
          type: Sequelize.STRING(64),
          allowNull: true,
          comment: 'SHA-256 hash do conteúdo normalizado para anti-duplicidade'
        }, { transaction });
      }

      if (!topicColNames.includes('classification_source')) {
        await queryInterface.addColumn('journey_v2_topics', 'classification_source', {
          type: Sequelize.STRING(20),
          allowNull: true,
          defaultValue: null,
          comment: 'Fonte da classificação: rule, ai, manual'
        }, { transaction });
      }

      if (!topicColNames.includes('classification_confidence')) {
        await queryInterface.addColumn('journey_v2_topics', 'classification_confidence', {
          type: Sequelize.DECIMAL(3, 2),
          allowNull: true,
          defaultValue: null,
          comment: 'Confiança da classificação (0.0 a 1.0)'
        }, { transaction });
      }

      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_journey_v2_quizzes_dev_domain ON journey_v2_quizzes(dev_domain)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_journey_v2_quizzes_content_hash ON journey_v2_quizzes(content_hash) WHERE content_hash IS NOT NULL`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_journey_v2_topics_dev_domain ON journey_v2_topics(dev_domain)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_journey_v2_topics_content_hash ON journey_v2_topics(content_hash) WHERE content_hash IS NOT NULL`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('journey_v2_quizzes', 'dev_domain', { transaction });
      await queryInterface.removeColumn('journey_v2_quizzes', 'content_hash', { transaction });
      await queryInterface.removeColumn('journey_v2_quizzes', 'classification_source', { transaction });
      await queryInterface.removeColumn('journey_v2_quizzes', 'classification_confidence', { transaction });
      await queryInterface.removeColumn('journey_v2_topics', 'dev_domain', { transaction });
      await queryInterface.removeColumn('journey_v2_topics', 'content_hash', { transaction });
      await queryInterface.removeColumn('journey_v2_topics', 'classification_source', { transaction });
      await queryInterface.removeColumn('journey_v2_topics', 'classification_confidence', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
