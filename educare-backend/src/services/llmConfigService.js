/**
 * LLM Configuration Service
 * Gerencia configurações de LLM por módulo com cache
 */

const AssistantLLMConfig = require('../models/AssistantLLMConfig');
const { providerRegistry } = require('./llmProviderRegistry');

const configCache = {
  baby: { config: null, timestamp: 0 },
  mother: { config: null, timestamp: 0 },
  professional: { config: null, timestamp: 0 }
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

const DEFAULT_CONFIG = {
  provider: 'openai',
  model_name: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1500
};

async function getConfig(moduleType) {
  const now = Date.now();
  const cached = configCache[moduleType];
  
  if (cached && cached.config && (now - cached.timestamp) < CACHE_TTL_MS) {
    console.log(`[LLMConfigService] Retornando config em cache para ${moduleType}`);
    return cached.config;
  }

  try {
    const config = await AssistantLLMConfig.findByPk(moduleType);

    if (config && config.is_active) {
      const configData = config.toJSON();
      configCache[moduleType] = {
        config: configData,
        timestamp: now
      };
      console.log(`[LLMConfigService] Config carregada do banco para ${moduleType}: ${configData.provider}/${configData.model_name}`);
      return configData;
    }

    console.log(`[LLMConfigService] Nenhuma config encontrada para ${moduleType}, usando default`);
    return { module_type: moduleType, ...DEFAULT_CONFIG };
  } catch (error) {
    console.error(`[LLMConfigService] Erro ao carregar config para ${moduleType}:`, error.message);
    return { module_type: moduleType, ...DEFAULT_CONFIG };
  }
}

async function getAllConfigs() {
  try {
    const configs = await AssistantLLMConfig.findAll({
      order: [['module_type', 'ASC']]
    });
    return configs.map(c => c.toJSON());
  } catch (error) {
    console.error('[LLMConfigService] Erro ao carregar todas as configs:', error.message);
    return [];
  }
}

async function updateConfig(moduleType, configData, updatedBy = null) {
  try {
    const [config, created] = await AssistantLLMConfig.upsert({
      module_type: moduleType,
      provider: configData.provider,
      model_name: configData.model_name,
      temperature: configData.temperature,
      max_tokens: configData.max_tokens,
      additional_params: configData.additional_params || {},
      is_active: configData.is_active !== false,
      updated_by: updatedBy
    }, {
      returning: true
    });

    invalidateCache(moduleType);
    
    console.log(`[LLMConfigService] Config ${created ? 'criada' : 'atualizada'} para ${moduleType}`);
    return { success: true, config: config.toJSON(), created };
  } catch (error) {
    console.error(`[LLMConfigService] Erro ao atualizar config para ${moduleType}:`, error.message);
    return { success: false, error: error.message };
  }
}

function validateProviderKey(provider) {
  return providerRegistry.isProviderAvailable(provider);
}

function getAvailableProviders() {
  return providerRegistry.getAvailableProviders();
}

function invalidateCache(moduleType = null) {
  if (moduleType) {
    configCache[moduleType] = { config: null, timestamp: 0 };
    console.log(`[LLMConfigService] Cache invalidado para ${moduleType}`);
  } else {
    Object.keys(configCache).forEach(key => {
      configCache[key] = { config: null, timestamp: 0 };
    });
    console.log('[LLMConfigService] Cache completo invalidado');
  }
}

module.exports = {
  getConfig,
  getAllConfigs,
  updateConfig,
  validateProviderKey,
  getAvailableProviders,
  invalidateCache,
  DEFAULT_CONFIG
};
