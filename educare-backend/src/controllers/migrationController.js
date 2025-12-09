/**
 * Migration Controller
 * Endpoints para gerenciar migração de documentos
 */

const migrationService = require('../services/migrationService');

/**
 * Analisa e classifica documentos legados
 */
async function analyzeDocuments(req, res) {
  try {
    const result = await migrationService.analyzeAndClassifyDocuments();
    return res.json(result);
  } catch (error) {
    console.error('[MigrationController] Erro ao analisar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao analisar documentos'
    });
  }
}

/**
 * Inicia migração de documentos
 */
async function startMigration(req, res) {
  try {
    const options = {
      auto_classify: req.body.auto_classify !== false,
      skip_ambiguous: req.body.skip_ambiguous !== false,
      batch_size: req.body.batch_size || 10
    };

    console.log('[MigrationController] Iniciando migração com opções:', options);
    const result = await migrationService.migrateDocuments(options);

    return res.json(result);
  } catch (error) {
    console.error('[MigrationController] Erro na migração:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao iniciar migração'
    });
  }
}

/**
 * Valida integridade da migração
 */
async function validateMigration(req, res) {
  try {
    const result = await migrationService.validateMigration();
    return res.json(result);
  } catch (error) {
    console.error('[MigrationController] Erro na validação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao validar migração'
    });
  }
}

/**
 * Faz rollback de migração
 */
async function rollback(req, res) {
  try {
    const { document_ids } = req.body;
    const result = await migrationService.rollbackMigration(document_ids);
    return res.json(result);
  } catch (error) {
    console.error('[MigrationController] Erro no rollback:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer rollback'
    });
  }
}

module.exports = {
  analyzeDocuments,
  startMigration,
  validateMigration,
  rollback
};
