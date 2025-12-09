/**
 * KB Versioning Service
 * FASE 10-UPGRADE: Versionamento Inteligente das Knowledge Bases
 * 
 * Responsabilidades:
 * - Controle de versões por KB
 * - Histórico de mudanças
 * - Comparação entre versões
 * - Rollback de documentos
 */

const { v4: uuidv4 } = require('uuid');

const VERSIONING_ENABLED = process.env.KB_VERSIONING_ENABLED !== 'false';

const versionHistory = {
  baby: [],
  mother: [],
  professional: [],
  legacy: []
};

const currentVersions = {
  baby: null,
  mother: null,
  professional: null,
  legacy: null
};

const snapshots = {};

/**
 * Cria nova versão para uma KB
 */
function createVersion(kbName, metadata = {}) {
  if (!VERSIONING_ENABLED) {
    return { versioned: false };
  }

  const version = {
    id: uuidv4(),
    kb: kbName,
    version_number: (versionHistory[kbName]?.length || 0) + 1,
    created_at: new Date().toISOString(),
    created_by: metadata.created_by || 'system',
    description: metadata.description || 'Auto-generated version',
    document_count: metadata.document_count || 0,
    changes: metadata.changes || [],
    previous_version: currentVersions[kbName]
  };

  versionHistory[kbName] = versionHistory[kbName] || [];
  versionHistory[kbName].push(version);
  currentVersions[kbName] = version.id;

  console.log(`[KBVersioning] Nova versão criada: ${kbName} v${version.version_number}`);

  return {
    versioned: true,
    version
  };
}

/**
 * Obtém versão atual de uma KB
 */
function getCurrentVersion(kbName) {
  const currentId = currentVersions[kbName];
  if (!currentId) {
    return null;
  }

  return versionHistory[kbName]?.find(v => v.id === currentId) || null;
}

/**
 * Lista histórico de versões de uma KB
 */
function getVersionHistory(kbName, limit = 10) {
  const history = versionHistory[kbName] || [];
  return history.slice(-limit).reverse();
}

/**
 * Cria snapshot de uma KB
 */
function createSnapshot(kbName, documents) {
  if (!VERSIONING_ENABLED) {
    return { created: false };
  }

  const snapshotId = uuidv4();
  const currentVersion = getCurrentVersion(kbName);

  snapshots[snapshotId] = {
    id: snapshotId,
    kb: kbName,
    version_id: currentVersion?.id,
    created_at: new Date().toISOString(),
    document_count: documents.length,
    document_ids: documents.map(d => d.id),
    metadata: {
      total_chars: documents.reduce((sum, d) => sum + (d.content?.length || 0), 0)
    }
  };

  console.log(`[KBVersioning] Snapshot criado: ${snapshotId} (${documents.length} docs)`);

  return {
    created: true,
    snapshot_id: snapshotId
  };
}

/**
 * Obtém snapshot por ID
 */
function getSnapshot(snapshotId) {
  return snapshots[snapshotId] || null;
}

/**
 * Compara duas versões
 */
function compareVersions(kbName, versionId1, versionId2) {
  const history = versionHistory[kbName] || [];
  const v1 = history.find(v => v.id === versionId1);
  const v2 = history.find(v => v.id === versionId2);

  if (!v1 || !v2) {
    return { error: 'Uma ou ambas versões não encontradas' };
  }

  return {
    comparison: {
      older: v1.version_number < v2.version_number ? v1 : v2,
      newer: v1.version_number > v2.version_number ? v1 : v2,
      document_diff: (v2.document_count || 0) - (v1.document_count || 0),
      time_diff_hours: Math.abs(new Date(v2.created_at) - new Date(v1.created_at)) / (1000 * 60 * 60),
      changes_between: []
    }
  };
}

/**
 * Registra mudança em uma KB
 */
function logChange(kbName, changeType, details = {}) {
  if (!VERSIONING_ENABLED) {
    return;
  }

  const currentVersion = getCurrentVersion(kbName);
  
  const change = {
    id: uuidv4(),
    type: changeType,
    kb: kbName,
    version_id: currentVersion?.id,
    timestamp: new Date().toISOString(),
    details
  };

  if (currentVersion) {
    currentVersion.changes = currentVersion.changes || [];
    currentVersion.changes.push(change);
  }

  console.log(`[KBVersioning] Change logged: ${kbName} - ${changeType}`);

  return change;
}

/**
 * Obtém estatísticas de versionamento
 */
function getVersioningStats() {
  return {
    enabled: VERSIONING_ENABLED,
    kbs: Object.keys(versionHistory).map(kb => ({
      name: kb,
      total_versions: versionHistory[kb].length,
      current_version: getCurrentVersion(kb)?.version_number || 0
    })),
    total_snapshots: Object.keys(snapshots).length,
    generated_at: new Date().toISOString()
  };
}

/**
 * Prepara rollback para versão anterior
 */
function prepareRollback(kbName, targetVersionId) {
  const history = versionHistory[kbName] || [];
  const targetVersion = history.find(v => v.id === targetVersionId);
  const currentVersion = getCurrentVersion(kbName);

  if (!targetVersion) {
    return { error: 'Versão alvo não encontrada' };
  }

  if (targetVersion.id === currentVersion?.id) {
    return { error: 'Já está na versão especificada' };
  }

  return {
    ready: true,
    rollback_plan: {
      from_version: currentVersion?.version_number,
      to_version: targetVersion.version_number,
      kb: kbName,
      estimated_changes: Math.abs((currentVersion?.document_count || 0) - (targetVersion.document_count || 0)),
      requires_confirmation: true
    }
  };
}

/**
 * Executa rollback (marca como atual - dados reais precisam ser restaurados separadamente)
 */
function executeRollback(kbName, targetVersionId, confirmedBy) {
  const plan = prepareRollback(kbName, targetVersionId);
  
  if (plan.error) {
    return plan;
  }

  const rollbackVersion = createVersion(kbName, {
    description: `Rollback para v${plan.rollback_plan.to_version}`,
    created_by: confirmedBy,
    changes: [{
      type: 'rollback',
      from_version: plan.rollback_plan.from_version,
      to_version: plan.rollback_plan.to_version
    }]
  });

  return {
    success: true,
    new_version: rollbackVersion.version,
    note: 'Versão marcada. Restauração de dados deve ser feita separadamente.'
  };
}

module.exports = {
  createVersion,
  getCurrentVersion,
  getVersionHistory,
  createSnapshot,
  getSnapshot,
  compareVersions,
  logChange,
  getVersioningStats,
  prepareRollback,
  executeRollback
};
