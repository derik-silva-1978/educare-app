/**
 * LLM Config Controller
 * Gerencia endpoints de configuração de LLM por módulo
 */

const llmConfigService = require('../services/llmConfigService');

exports.getAllConfigs = async (req, res) => {
  try {
    const configs = await llmConfigService.getAllConfigs();
    const providers = llmConfigService.getAvailableProviders();
    
    res.json({
      success: true,
      data: {
        configs,
        providers
      }
    });
  } catch (error) {
    console.error('[LLMConfigController] Erro ao buscar configs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar configurações de LLM'
    });
  }
};

exports.getConfigByModule = async (req, res) => {
  try {
    const { module_type } = req.params;
    
    if (!['baby', 'mother', 'professional'].includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: 'module_type inválido. Use: baby, mother ou professional'
      });
    }
    
    const config = await llmConfigService.getConfig(module_type);
    const providers = llmConfigService.getAvailableProviders();
    
    res.json({
      success: true,
      data: {
        config,
        providers
      }
    });
  } catch (error) {
    console.error('[LLMConfigController] Erro ao buscar config:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar configuração de LLM'
    });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { module_type } = req.params;
    const { provider, model_name, temperature, max_tokens, additional_params } = req.body;
    
    if (!['baby', 'mother', 'professional'].includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: 'module_type inválido. Use: baby, mother ou professional'
      });
    }
    
    if (!provider || !model_name) {
      return res.status(400).json({
        success: false,
        error: 'provider e model_name são obrigatórios'
      });
    }
    
    if (!llmConfigService.validateProviderKey(provider)) {
      return res.status(400).json({
        success: false,
        error: `API key para ${provider} não está configurada no ambiente`
      });
    }
    
    const result = await llmConfigService.updateConfig(module_type, {
      provider,
      model_name,
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 1500,
      additional_params: additional_params || {}
    }, req.user?.id);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: result.config,
      created: result.created,
      message: `Configuração de LLM para ${module_type} ${result.created ? 'criada' : 'atualizada'} com sucesso`
    });
  } catch (error) {
    console.error('[LLMConfigController] Erro ao atualizar config:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar configuração de LLM'
    });
  }
};

exports.getAvailableProviders = async (req, res) => {
  try {
    const providers = llmConfigService.getAvailableProviders();
    
    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('[LLMConfigController] Erro ao buscar providers:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar provedores disponíveis'
    });
  }
};
