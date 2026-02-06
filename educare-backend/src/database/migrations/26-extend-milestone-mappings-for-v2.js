'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const [columns] = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'milestone_mappings'`,
        { transaction }
      );
      const colNames = columns.map(c => c.column_name);

      if (!colNames.includes('journey_v2_quiz_id')) {
        await queryInterface.addColumn('milestone_mappings', 'journey_v2_quiz_id', {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'journey_v2_quizzes', key: 'id' },
          onDelete: 'SET NULL',
          comment: 'FK para journey_v2_quizzes (coexiste com journey_question_id)'
        }, { transaction });
      }

      if (!colNames.includes('source_type')) {
        await queryInterface.addColumn('milestone_mappings', 'source_type', {
          type: Sequelize.STRING(20),
          allowNull: true,
          defaultValue: 'legacy',
          comment: 'Tipo de origem: legacy (JourneyBotQuestion) ou v2 (JourneyV2Quiz)'
        }, { transaction });
      }

      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_mappings ALTER COLUMN journey_question_id DROP NOT NULL`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_mappings DROP CONSTRAINT IF EXISTS unique_milestone_question_mapping`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_milestone_mapping_v2_unique 
         ON milestone_mappings(official_milestone_id, journey_v2_quiz_id) 
         WHERE journey_v2_quiz_id IS NOT NULL`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_milestone_mapping_legacy_unique 
         ON milestone_mappings(official_milestone_id, journey_question_id) 
         WHERE journey_question_id IS NOT NULL`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_mappings ADD CONSTRAINT chk_mapping_has_source 
         CHECK (journey_question_id IS NOT NULL OR journey_v2_quiz_id IS NOT NULL)`,
        { transaction }
      ).catch(() => {});

      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_milestone_mappings_v2_quiz ON milestone_mappings(journey_v2_quiz_id)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_milestone_mappings_source_type ON milestone_mappings(source_type)`,
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
      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_mappings DROP CONSTRAINT IF EXISTS chk_mapping_has_source`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_milestone_mapping_v2_unique`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_milestone_mapping_legacy_unique`,
        { transaction }
      );
      await queryInterface.removeColumn('milestone_mappings', 'journey_v2_quiz_id', { transaction });
      await queryInterface.removeColumn('milestone_mappings', 'source_type', { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE milestone_mappings ALTER COLUMN journey_question_id SET NOT NULL`,
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
