'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('assistant_llm_configs');

    if (!tableInfo.rag_enabled) {
      await queryInterface.addColumn('assistant_llm_configs', 'rag_enabled', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
    }

    if (!tableInfo.rag_knowledge_base) {
      await queryInterface.addColumn('assistant_llm_configs', 'rag_knowledge_base', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      });
    }

    const ragDefaults = [
      { module_type: 'baby', rag_enabled: true, rag_knowledge_base: 'kb_baby' },
      { module_type: 'mother', rag_enabled: true, rag_knowledge_base: 'kb_mother' },
      { module_type: 'professional', rag_enabled: true, rag_knowledge_base: 'kb_professional' },
      { module_type: 'landing_chat', rag_enabled: true, rag_knowledge_base: 'landing' }
    ];

    for (const def of ragDefaults) {
      await queryInterface.sequelize.query(
        `UPDATE assistant_llm_configs SET rag_enabled = :rag_enabled, rag_knowledge_base = :rag_knowledge_base WHERE module_type = :module_type`,
        { replacements: def }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assistant_llm_configs', 'rag_knowledge_base');
    await queryInterface.removeColumn('assistant_llm_configs', 'rag_enabled');
  }
};
