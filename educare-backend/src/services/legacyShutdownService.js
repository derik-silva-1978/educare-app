/**
 * Legacy Shutdown Service
 * FASE 09-UPGRADE: Aposentadoria definitiva da base legado
 * 
 * Responsabilidades:
 * - Backup imutável da base legado
 * - Verificação de pré-condições
 * - Desativação lógica (sem apagar dados)
 * - Bloqueio de ingestão na base legado
 * - Testes de consistência
 * - Mecanismo de rollback
 */

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const KbBaby = require('../models/KbBaby');
const KbMother = require('../models/KbMother');
const KbProfessional = require('../models/KbProfessional');
const ragMetricsService = require('./ragMetricsService');
const knowledgeBaseSelector = require('./knowledgeBaseSelector');

const BACKUP_BASE_DIR = process.env.BACKUP_PATH || './backups/rag_legacy';

// Flag global para controle de ingestão na base legado
const LEGACY_INGESTION_DISABLED = process.env.LEGACY_INGESTION_DISABLED === 'true';

// Status do desligamento
const shutdownStatus = {
  legacy_inactive: false,
  shutdown_date: null,
  backup_created: false,
  backup_path: null,
  ingestion_blocked: LEGACY_INGESTION_DISABLED
};

/**
 * Verifica se todas as pré-condições para desligamento são atendidas
 */
async function checkPreConditions() {
  try {
    console.log('[LegacyShutdown] Verificando pré-condições...');

    const conditions = {
      all_flags_false: true,
      metrics_validated: true,
      backup_exists: false,
      observations: []
    };

    // 1. Verificar flags de fallback
    const fallbackStatus = knowledgeBaseSelector.getFallbackStatus();
    
    if (fallbackStatus.modules.baby === true) {
      conditions.all_flags_false = false;
      conditions.observations.push('USE_LEGACY_FALLBACK_FOR_BABY ainda é true');
    }
    if (fallbackStatus.modules.mother === true) {
      conditions.all_flags_false = false;
      conditions.observations.push('USE_LEGACY_FALLBACK_FOR_MOTHER ainda é true');
    }
    if (fallbackStatus.modules.professional === true) {
      conditions.all_flags_false = false;
      conditions.observations.push('USE_LEGACY_FALLBACK_FOR_PROFESSIONAL ainda é true');
    }

    // 2. Verificar métricas de prontidão
    const readiness = ragMetricsService.getShutdownReadiness();
    if (!readiness.success || !readiness.summary.all_ready) {
      conditions.metrics_validated = false;
      conditions.observations.push(`Apenas ${readiness.summary.modules_ready}/${readiness.summary.modules_total} módulos prontos`);
      
      Object.entries(readiness.data).forEach(([module, data]) => {
        if (!data.ready) {
          conditions.observations.push(`${module}: ${data.reason}`);
        }
      });
    }

    // 3. Verificar se backup já existe
    if (shutdownStatus.backup_created && shutdownStatus.backup_path) {
      conditions.backup_exists = true;
    }

    // Determinar se pode prosseguir
    const canProceed = conditions.all_flags_false && conditions.metrics_validated;

    return {
      success: true,
      can_proceed: canProceed,
      conditions,
      fallback_status: fallbackStatus,
      readiness_summary: readiness.summary,
      recommendations: canProceed 
        ? ['✅ Todas as pré-condições atendidas. Pode prosseguir com o backup e desligamento.']
        : ['⚠️ Pré-condições não atendidas. Revise as observações acima.']
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro ao verificar pré-condições:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gera backup completo da tabela legado
 */
async function createBackup(options = {}) {
  try {
    console.log('[LegacyShutdown] Criando backup da base legado...');

    const timestamp = new Date().toISOString().split('T')[0];
    const backupDir = path.join(BACKUP_BASE_DIR, timestamp);

    // Cria diretório de backup
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Busca todos os documentos da base legado
    const documents = await KnowledgeDocument.findAll({
      raw: true,
      order: [['created_at', 'ASC']]
    });

    console.log(`[LegacyShutdown] Encontrados ${documents.length} documentos para backup`);

    // Formato JSONL
    const jsonlPath = path.join(backupDir, 'knowledge_documents.jsonl');
    const jsonlStream = fs.createWriteStream(jsonlPath);
    
    documents.forEach(doc => {
      jsonlStream.write(JSON.stringify(doc) + '\n');
    });
    jsonlStream.end();

    // Formato CSV (campos principais)
    const csvPath = path.join(backupDir, 'knowledge_documents.csv');
    const csvHeaders = ['id', 'title', 'source_type', 'age_range', 'domain', 'file_search_id', 'is_active', 'created_at'];
    const csvContent = [
      csvHeaders.join(','),
      ...documents.map(doc => 
        csvHeaders.map(h => {
          const val = doc[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
          return val;
        }).join(',')
      )
    ].join('\n');
    fs.writeFileSync(csvPath, csvContent);

    // Metadados do backup
    const metadata = {
      backup_date: new Date().toISOString(),
      document_count: documents.length,
      files: {
        jsonl: 'knowledge_documents.jsonl',
        csv: 'knowledge_documents.csv'
      },
      database_info: {
        host: process.env.DB_HOST || 'unknown',
        database: process.env.DB_DATABASE || 'unknown'
      },
      checksums: {
        jsonl_size: fs.statSync(jsonlPath).size,
        csv_size: fs.statSync(csvPath).size
      }
    };
    
    const metadataPath = path.join(backupDir, 'backup_metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Atualiza status global
    shutdownStatus.backup_created = true;
    shutdownStatus.backup_path = backupDir;

    console.log(`[LegacyShutdown] Backup criado em: ${backupDir}`);

    return {
      success: true,
      backup_path: backupDir,
      document_count: documents.length,
      files: {
        jsonl: jsonlPath,
        csv: csvPath,
        metadata: metadataPath
      },
      metadata
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro ao criar backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verifica se ingestão na base legado deve ser bloqueada
 */
function isLegacyIngestionBlocked() {
  return LEGACY_INGESTION_DISABLED || shutdownStatus.legacy_inactive;
}

/**
 * Middleware/guard para bloquear ingestão na base legado
 */
function blockLegacyIngestion() {
  if (isLegacyIngestionBlocked()) {
    throw new Error('Ingestão na base legado está desativada permanentemente. Use as bases segmentadas (kb_baby, kb_mother, kb_professional).');
  }
}

/**
 * Desativa logicamente a base legado
 * NÃO apaga dados, apenas marca como inativa
 */
async function deactivateLegacy() {
  try {
    console.log('[LegacyShutdown] Desativando base legado...');

    // Verifica pré-condições
    const preCheck = await checkPreConditions();
    if (!preCheck.can_proceed) {
      return {
        success: false,
        error: 'Pré-condições não atendidas',
        details: preCheck.conditions.observations
      };
    }

    // Verifica se backup existe
    if (!shutdownStatus.backup_created) {
      return {
        success: false,
        error: 'Backup não encontrado. Execute createBackup() primeiro.'
      };
    }

    // Atualiza status
    shutdownStatus.legacy_inactive = true;
    shutdownStatus.shutdown_date = new Date().toISOString();
    shutdownStatus.ingestion_blocked = true;

    console.log('[LegacyShutdown] Base legado desativada com sucesso');
    console.log(`[RAG] Legacy knowledge base is now inactive. All modules operating under segmented KB mode.`);

    return {
      success: true,
      message: 'Base legado desativada logicamente',
      status: shutdownStatus
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro ao desativar base legado:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Executa testes de consistência pós-desligamento
 */
async function runConsistencyTests() {
  try {
    console.log('[LegacyShutdown] Executando testes de consistência...');

    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
      passed: 0,
      failed: 0
    };

    // Teste 1: Verificar contagem de documentos nas bases segmentadas
    const babyCount = await KbBaby.count({ where: { is_active: true } });
    const motherCount = await KbMother.count({ where: { is_active: true } });
    const professionalCount = await KbProfessional.count({ where: { is_active: true } });
    const totalSegmented = babyCount + motherCount + professionalCount;

    const test1 = {
      name: 'Segmented KB has documents',
      passed: totalSegmented > 0,
      details: { baby: babyCount, mother: motherCount, professional: professionalCount, total: totalSegmented }
    };
    results.tests.push(test1);
    if (test1.passed) results.passed++; else results.failed++;

    // Teste 2: Verificar que fallback está desabilitado
    const fallbackStatus = knowledgeBaseSelector.getFallbackStatus();
    const test2 = {
      name: 'All fallback flags are false',
      passed: !fallbackStatus.modules.baby && !fallbackStatus.modules.mother && !fallbackStatus.modules.professional,
      details: fallbackStatus.modules
    };
    results.tests.push(test2);
    if (test2.passed) results.passed++; else results.failed++;

    // Teste 3: Verificar health do RAG
    const healthCheck = ragMetricsService.getHealthCheck();
    const test3 = {
      name: 'RAG health is not unhealthy',
      passed: healthCheck.status !== 'unhealthy',
      details: healthCheck
    };
    results.tests.push(test3);
    if (test3.passed) results.passed++; else results.failed++;

    // Teste 4: Verificar que bloqueio de ingestão está ativo
    const test4 = {
      name: 'Legacy ingestion is blocked',
      passed: isLegacyIngestionBlocked(),
      details: { blocked: isLegacyIngestionBlocked() }
    };
    results.tests.push(test4);
    if (test4.passed) results.passed++; else results.failed++;

    // Teste 5: Verificar backup existe
    const test5 = {
      name: 'Backup was created',
      passed: shutdownStatus.backup_created,
      details: { backup_path: shutdownStatus.backup_path }
    };
    results.tests.push(test5);
    if (test5.passed) results.passed++; else results.failed++;

    results.summary = {
      total: results.tests.length,
      passed: results.passed,
      failed: results.failed,
      success_rate: Math.round((results.passed / results.tests.length) * 100)
    };

    console.log(`[LegacyShutdown] Testes concluídos: ${results.passed}/${results.tests.length} passaram`);

    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro nos testes de consistência:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Reativa a base legado (rollback)
 */
async function rollback() {
  try {
    console.log('[LegacyShutdown] Executando rollback...');

    // Reverte status
    shutdownStatus.legacy_inactive = false;
    shutdownStatus.shutdown_date = null;
    // Nota: backup permanece

    console.log('[LegacyShutdown] Rollback concluído - base legado reativada');
    console.log('[RAG] Legacy knowledge base reactivated. Fallback is available if flags are true.');

    return {
      success: true,
      message: 'Rollback concluído. Base legado disponível novamente.',
      instructions: [
        'Para reativar fallback, configure no .env:',
        'USE_LEGACY_FALLBACK_FOR_BABY=true',
        'USE_LEGACY_FALLBACK_FOR_MOTHER=true',
        'USE_LEGACY_FALLBACK_FOR_PROFESSIONAL=true',
        'E reinicie o servidor.'
      ]
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro no rollback:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Retorna status atual do desligamento
 */
function getStatus() {
  return {
    success: true,
    status: shutdownStatus,
    fallback_status: knowledgeBaseSelector.getFallbackStatus()
  };
}

/**
 * Gera relatório final de desligamento
 */
async function generateShutdownReport() {
  try {
    const preConditions = await checkPreConditions();
    const consistencyTests = await runConsistencyTests();
    const status = getStatus();

    const report = {
      title: 'Legacy Knowledge Base Shutdown Report',
      generated_at: new Date().toISOString(),
      status: shutdownStatus,
      pre_conditions: preConditions,
      consistency_tests: consistencyTests.results,
      fallback_configuration: status.fallback_status,
      rollback_instructions: {
        description: 'Para reverter o desligamento:',
        steps: [
          '1. Execute: legacyShutdownService.rollback()',
          '2. Configure USE_LEGACY_FALLBACK_FOR_*=true no .env',
          '3. Reinicie o servidor'
        ]
      },
      confirmation: shutdownStatus.legacy_inactive 
        ? '✅ Legacy knowledge base fully deprecated'
        : '⚠️ Legacy shutdown not complete'
    };

    return {
      success: true,
      report
    };
  } catch (error) {
    console.error('[LegacyShutdown] Erro ao gerar relatório:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verifica se o sistema está em modo legacy-free
 */
function isLegacyFree() {
  return shutdownStatus.legacy_inactive;
}

module.exports = {
  checkPreConditions,
  createBackup,
  isLegacyIngestionBlocked,
  blockLegacyIngestion,
  deactivateLegacy,
  runConsistencyTests,
  rollback,
  getStatus,
  generateShutdownReport,
  isLegacyFree
};
