const KbBaby = require('../models/KbBaby');
const KbMother = require('../models/KbMother');
const KbProfessional = require('../models/KbProfessional');
const KnowledgeDocument = require('../models/KnowledgeDocument');

const ENABLE_SEGMENTED_KB = process.env.ENABLE_SEGMENTED_KB === 'true';
const KB_FALLBACK_ENABLED = process.env.KB_FALLBACK_ENABLED !== 'false';
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

  if (force_legacy) {
    selection_reason = 'force_legacy flag enabled';
    logSelection(context, { primary_table, fallback_table, use_fallback, selection_reason });
    return {
      primary_table,
      primary_model: MODELS[primary_table],
      fallback_table,
      fallback_model: null,
      use_fallback,
      selection_reason
    };
  }

  if (!ENABLE_SEGMENTED_KB) {
    selection_reason = 'ENABLE_SEGMENTED_KB is false, using legacy table';
    logSelection(context, { primary_table, fallback_table, use_fallback, selection_reason });
    return {
      primary_table,
      primary_model: MODELS[primary_table],
      fallback_table,
      fallback_model: null,
      use_fallback,
      selection_reason
    };
  }

  if (module_type) {
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
    selection_reason = 'baby_id provided, inferring baby module';
  } else if (route_context) {
    const matchedRoute = Object.keys(ROUTE_MAPPINGS).find(route => 
      route_context.startsWith(route)
    );
    if (matchedRoute) {
      const mappedModule = ROUTE_MAPPINGS[matchedRoute];
      switch (mappedModule) {
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
      selection_reason = `route_context ${route_context} mapped to ${mappedModule}`;
    } else {
      selection_reason = `route_context ${route_context} not mapped, using legacy`;
    }
  } else {
    selection_reason = 'no context provided, using legacy table';
  }

  if (primary_table !== 'knowledge_documents' && KB_FALLBACK_ENABLED) {
    fallback_table = 'knowledge_documents';
    use_fallback = true;
  }

  const result = {
    primary_table,
    primary_model: MODELS[primary_table],
    fallback_table,
    fallback_model: fallback_table ? MODELS[fallback_table] : null,
    use_fallback,
    selection_reason
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

module.exports = {
  select,
  getModel,
  isSegmentedKbEnabled,
  isFallbackEnabled,
  MODELS
};
