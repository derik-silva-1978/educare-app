'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS maternal_curation_mappings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          maternal_domain VARCHAR(30) NOT NULL,
          journey_v2_quiz_id UUID,
          journey_v2_topic_id UUID,
          relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 5),
          ai_reasoning TEXT,
          weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
          is_auto_generated BOOLEAN NOT NULL DEFAULT false,
          verified_by_curator BOOLEAN NOT NULL DEFAULT false,
          verified_at TIMESTAMP WITH TIME ZONE,
          verified_by UUID,
          notes TEXT,
          source_type VARCHAR(20) DEFAULT 'v2',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT chk_maternal_has_source CHECK (journey_v2_quiz_id IS NOT NULL OR journey_v2_topic_id IS NOT NULL),
          CONSTRAINT chk_maternal_domain CHECK (maternal_domain IN ('nutricao', 'saude_mental', 'recuperacao', 'amamentacao', 'saude_fisica', 'autocuidado', 'unknown'))
        )
      `, { transaction });

      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_maternal_curation_domain ON maternal_curation_mappings(maternal_domain)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_maternal_curation_quiz ON maternal_curation_mappings(journey_v2_quiz_id)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_maternal_curation_topic ON maternal_curation_mappings(journey_v2_topic_id)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_maternal_curation_verified ON maternal_curation_mappings(verified_by_curator)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_maternal_curation_quiz_unique 
         ON maternal_curation_mappings(maternal_domain, journey_v2_quiz_id) 
         WHERE journey_v2_quiz_id IS NOT NULL`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_maternal_curation_topic_unique 
         ON maternal_curation_mappings(maternal_domain, journey_v2_topic_id) 
         WHERE journey_v2_topic_id IS NOT NULL`,
        { transaction }
      );

      const [mediaTableExists] = await queryInterface.sequelize.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'media_resources')`,
        { transaction }
      );
      if (!mediaTableExists[0].exists) {
        await queryInterface.sequelize.query(`
          CREATE TYPE IF NOT EXISTS enum_media_resources_resource_type AS ENUM ('text', 'audio', 'image', 'pdf', 'video', 'link')
        `, { transaction }).catch(() => {});
        
        await queryInterface.sequelize.query(`
          CREATE TABLE IF NOT EXISTS media_resources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            resource_type enum_media_resources_resource_type NOT NULL,
            content TEXT,
            file_url VARCHAR(500),
            file_name VARCHAR(255),
            file_size INTEGER,
            mime_type VARCHAR(100),
            tts_enabled BOOLEAN DEFAULT false,
            tts_endpoint VARCHAR(500),
            tts_voice VARCHAR(100),
            category VARCHAR(100),
            tags TEXT[] DEFAULT '{}',
            age_range_min INTEGER,
            age_range_max INTEGER,
            is_active BOOLEAN DEFAULT true,
            is_public BOOLEAN DEFAULT false,
            view_count INTEGER DEFAULT 0,
            created_by UUID NOT NULL,
            updated_by UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `, { transaction });
      }

      await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS journey_v2_media (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          journey_v2_topic_id UUID REFERENCES journey_v2_topics(id) ON DELETE CASCADE,
          journey_v2_quiz_id UUID REFERENCES journey_v2_quizzes(id) ON DELETE CASCADE,
          media_resource_id UUID NOT NULL,
          block_type VARCHAR(30) NOT NULL DEFAULT 'attachment',
          position INTEGER NOT NULL DEFAULT 0,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT chk_media_has_source CHECK (journey_v2_topic_id IS NOT NULL OR journey_v2_quiz_id IS NOT NULL)
        )
      `, { transaction });

      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_v2_media_topic ON journey_v2_media(journey_v2_topic_id)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_v2_media_quiz ON journey_v2_media(journey_v2_quiz_id)`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_v2_media_resource ON journey_v2_media(media_resource_id)`,
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
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS journey_v2_media CASCADE', { transaction });
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS maternal_curation_mappings CASCADE', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
