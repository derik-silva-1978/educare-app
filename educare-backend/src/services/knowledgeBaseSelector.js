/**
 * Knowledge Base Selector
 * FASE 08-UPGRADE: Suporte a flags granulares de fallback por módulo
 */

const KbBaby = require('../models/KbBaby');
const KbMother = require('../models/KbMother');
const KbProfessional = require('../models/KbProfessional');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const AssistantLLMConfig = require('../models/AssistantLLMConfig');

// Master switch for segmented KB
const ENABLE_SEGMENTED_KB = process.env.ENABLE_SEGMENTED_KB === 'true';

// Global fallback (backward compatibility)
const KB_FALLBACK_ENABLED = process.env.KB_FALLBACK_ENABLED !== 'false';

// FASE 08: Flags granulares de fallback por módulo
const USE_LEGACY_FALLBACK_FOR_BABY = process.env.USE_LEGACY_FALLBACK_FOR_BABY !== 'false';
const USE_LEGACY_FALLBACK_FOR_MOTHER = process.env.USE_LEGACY_FALLBACK_FOR_MOTHER !== 'false';
const USE_LEGACY_FALLBACK_FOR_PROFESSIONAL = process.env.USE_LEGACY_FALLBACK_FOR_PROFESSIONAL !== 'false';

// Logging
const KB_LOG_SELECTIONS = process.env.KB_LOG_SELECTIONS !== 'false';

const MODELS = {
  kb_baby: KbBaby,
  kb_mother: KbMother,
  kb_professional: KbProfessional,
  knowledge_documents: KnowledgeDocument
};

const ROUTE_MAPPINGS = {
  '/meu-bebe': 'baby',
  '/my-baby': 'baby',
  '/baby': 'baby',
  '/saude': 'mother',
  '/health': 'mother',
  '/mother': 'mother',
  '/profissional': 'professional',
  '/professional': 'professional'
};

/**
 * Verifica se o fallback para legacy está habilitado para um módulo específico
 * FASE 08: Desligamento progressivo por módulo
 */
function isLegacyFallbackEnabledForModule(moduleType) {
  // Se o fallback global estiver desabilitado, nenhum módulo usa fallback
  if (!KB_FALLBACK_ENABLED) {
    return false;
  }

  switch (moduleType) {
    case 'baby':
      return USE_LEGACY_FALLBACK_FOR_BABY;
    case 'mother':
      return USE_LEGACY_FALLBACK_FOR_MOTHER;
    case 'professional':
      return USE_LEGACY_FALLBACK_FOR_PROFESSIONAL;
    default:
      return KB_FALLBACK_ENABLED;
  }
}

/**
 * Retorna status de todas as flags de fallback
 */
function getFallbackStatus() {
  return {
    global: KB_FALLBACK_ENABLED,
    segmented_kb_enabled: ENABLE_SEGMENTED_KB,
    modules: {
      baby: USE_LEGACY_FALLBACK_FOR_BABY,
      mother: USE_LEGACY_FALLBACK_FOR_MOTHER,
      professional: USE_LEGACY_FALLBACK_FOR_PROFESSIONAL
    },
    strict_mode: {
      baby: !USE_LEGACY_FALLBACK_FOR_BABY,
      mother: !USE_LEGACY_FALLBACK_FOR_MOTHER,
      professional: !USE_LEGACY_FALLBACK_FOR_PROFESSIONAL
    }
  };
}

function select(context = {}) {
  const {
    module_type,
    baby_id,
    user_role,
    route_context,
    force_legacy = false
  } = context;

  let primary_table = 'knowledge_documents';
  let fallback_table = null;
  let use_fallback = false;
  let selection_reason = '';
  let strict_mode = false;
  let inferred_module = null;

  if (force_legacy) {
    selection_reason = 'force_legacy flag enabled';
    logSelection(context, { primary_table, fallback_table, use_fallback, selection_reason, strict_mode });
    return {
      primary_table,
      primary_model: MODELS[primary_table],
      fallback_table,
      fallback_model: null,
      use_fallback,
      selection_reason,
      strict_mode,
      inferred_module
    };
  }

  if (!ENABLE_SEGMENTED_KB) {
    selection_reason = 'ENABLE_SEGMENTED_KB is false, using legacy table';
    logSelection(context, { primary_table, fallback_table, use_fallback, selection_reason, strict_mode });
    return {
      primary_table,
      primary_model: MODELS[primary_table],
      fallback_table,
      fallback_model: null,
      use_fallback,
      selection_reason,
      strict_mode,
      inferred_module
    };
  }

  // Determina o módulo
  if (module_type) {
    inferred_module = module_type;
    switch (module_type) {
      case 'baby':
        primary_table = 'kb_baby';
        selection_reason = 'module_type is baby';
        break;
      case 'mother':
        primary_table = 'kb_mother';
        selection_reason = 'module_type is mother';
        break;
      case 'professional':
        primary_table = 'kb_professional';
        selection_reason = 'module_type is professional';
        break;
      default:
        selection_reason = `unknown module_type: ${module_type}, using legacy`;
    }
  } else if (baby_id) {
    primary_table = 'kb_baby';
    inferred_module = 'baby';
    selection_reason = 'baby_id provided, inferring baby module';
  } else if (route_context) {
    const matchedRoute = Object.keys(ROUTE_MAPPINGS).find(route => 
      route_context.startsWith(route)
    );
    if (matchedRoute) {
      inferred_module = ROUTE_MAPPINGS[matchedRoute];
      switch (inferred_module) {
        case 'baby':
          primary_table = 'kb_baby';
          break;
        case 'mother':
          primary_table = 'kb_mother';
          break;
        case 'professional':
          primary_table = 'kb_professional';
          break;
      }
      selection_reason = `route_context ${route_context} mapped to ${inferred_module}`;
    } else {
      selection_reason = `route_context ${route_context} not mapped, using legacy`;
    }
  } else {
    selection_reason = 'no context provided, using legacy table';
  }

  // FASE 08: Verifica fallback granular por módulo
  if (primary_table !== 'knowledge_documents' && inferred_module) {
    const moduleFallbackEnabled = isLegacyFallbackEnabledForModule(inferred_module);
    
    if (moduleFallbackEnabled) {
      fallback_table = 'knowledge_documents';
      use_fallback = true;
      strict_mode = false;
    } else {
      // MODO STRICT: Sem fallback para este módulo
      fallback_table = null;
      use_fallback = false;
      strict_mode = true;
      selection_reason += ` [STRICT MODE - no legacy fallback for ${inferred_module}]`;
    }
  }

  const result = {
    primary_table,
    primary_model: MODELS[primary_table],
    fallback_table,
    fallback_model: fallback_table ? MODELS[fallback_table] : null,
    use_fallback,
    selection_reason,
    strict_mode,
    inferred_module
  };

  logSelection(context, result);

  return result;
}

function logSelection(context, result) {
  if (!KB_LOG_SELECTIONS) return;

  console.log('[KnowledgeBaseSelector]', {
    input: {
      module_type: context.module_type,
      baby_id: context.baby_id ? 'provided' : 'none',
      route_context: context.route_context,
      force_legacy: context.force_legacy
    },
    output: {
      primary_table: result.primary_table,
      fallback_table: result.fallback_table,
      use_fallback: result.use_fallback,
      strict_mode: result.strict_mode,
      reason: result.selection_reason
    }
  });
}

function getModel(tableName) {
  return MODELS[tableName] || null;
}

function isSegmentedKbEnabled() {
  return ENABLE_SEGMENTED_KB;
}

function isFallbackEnabled() {
  return KB_FALLBACK_ENABLED;
}

async function getRagConfigForModule(moduleType) {
  try {
    const config = await AssistantLLMConfig.findByPk(moduleType, {
      attributes: ['rag_enabled', 'rag_knowledge_base']
    });
    if (config) {
      return {
        rag_enabled: config.rag_enabled || false,
        rag_knowledge_base: config.rag_knowledge_base || null
      };
    }
    return { rag_enabled: false, rag_knowledge_base: null };
  } catch (error) {
    console.warn(`[KnowledgeBaseSelector] Error reading RAG config for ${moduleType}:`, error.message);
    return { rag_enabled: false, rag_knowledge_base: null };
  }
}

module.exports = {
  select,
  getModel,
  isSegmentedKbEnabled,
  isFallbackEnabled,
  isLegacyFallbackEnabledForModule,
  getFallbackStatus,
  getRagConfigForModule,
  MODELS
};
