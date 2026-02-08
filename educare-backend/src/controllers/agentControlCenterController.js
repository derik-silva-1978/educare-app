const { AssistantPrompt, AssistantLLMConfig, User } = require('../models');
const AgentModelRanking = require('../models/AgentModelRanking');
const { providerRegistry } = require('../services/llmProviderRegistry');
const llmConfigService = require('../services/llmConfigService');

const AGENT_META = {
  baby: {
    name: 'TitiNauta',
    description: 'Assistente de IA para pais e responsáveis sobre desenvolvimento infantil',
    icon: 'baby',
    color: '#8b5cf6',
    kb: 'kb_baby'
  },
  mother: {
    name: 'TitiNauta Materna',
    description: 'Assistente de IA para saúde materna, gravidez e pós-parto',
    icon: 'heart',
    color: '#f43f5e',
    kb: 'kb_mother'
  },
  professional: {
    name: 'TitiNauta Especialista',
    description: 'Assistente de IA para profissionais de saúde com protocolos clínicos',
    icon: 'stethoscope',
    color: '#14b8a6',
    kb: 'kb_professional'
  }
};

exports.getAgentsDashboard = async (req, res) => {
  try {
    const agents = [];

    for (const moduleType of ['baby', 'mother', 'professional']) {
      const activePrompt = await AssistantPrompt.findOne({
        where: { module_type: moduleType, is_active: true },
        order: [['version', 'DESC']],
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name'], required: false },
          { model: User, as: 'updater', attributes: ['id', 'name'], required: false }
        ]
      });

      const totalVersions = await AssistantPrompt.count({
        where: { module_type: moduleType }
      });

      const llmConfig = await llmConfigService.getConfig(moduleType);
      const providerInfo = providerRegistry.getProvider(llmConfig.provider);

      const rankingsCount = await AgentModelRanking.count({
        where: { module_type: moduleType }
      });

      agents.push({
        module_type: moduleType,
        meta: AGENT_META[moduleType],
        prompt: activePrompt ? {
          id: activePrompt.id,
          name: activePrompt.name,
          version: activePrompt.version,
          updatedAt: activePrompt.updatedAt,
          updater: activePrompt.updater,
          description: activePrompt.description,
          promptLength: activePrompt.system_prompt?.length || 0
        } : null,
        llm: {
          provider: llmConfig.provider,
          providerName: providerInfo?.name || llmConfig.provider,
          model_name: llmConfig.model_name,
          temperature: llmConfig.temperature,
          max_tokens: llmConfig.max_tokens
        },
        stats: {
          totalVersions,
          rankingsCount
        }
      });
    }

    const providers = providerRegistry.getAvailableProviders();

    return res.json({
      success: true,
      data: { agents, providers }
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro ao carregar dashboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao carregar dashboard dos agentes'
    });
  }
};

exports.getAgentDetail = async (req, res) => {
  try {
    const { module_type } = req.params;

    if (!['baby', 'mother', 'professional'].includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: 'module_type inválido. Use: baby, mother ou professional'
      });
    }

    const activePrompt = await AssistantPrompt.findOne({
      where: { module_type, is_active: true },
      order: [['version', 'DESC']],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'], required: false },
        { model: User, as: 'updater', attributes: ['id', 'name', 'email'], required: false }
      ]
    });

    const draftPrompts = await AssistantPrompt.findAll({
      where: { module_type, is_active: false },
      order: [['version', 'DESC']],
      limit: 10,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'], required: false }
      ]
    });

    const llmConfig = await llmConfigService.getConfig(module_type);
    const providers = providerRegistry.getAvailableProviders();

    const rankings = await AgentModelRanking.findAll({
      where: { module_type },
      order: [['stars', 'DESC'], ['provider', 'ASC']]
    });

    return res.json({
      success: true,
      data: {
        meta: AGENT_META[module_type],
        activePrompt,
        draftPrompts,
        llmConfig,
        providers,
        rankings
      }
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro ao carregar detalhe do agente:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao carregar detalhes do agente'
    });
  }
};

exports.playground = async (req, res) => {
  try {
    const { module_type, system_prompt, user_message, provider, model_name, temperature, max_tokens } = req.body;

    if (!module_type || !user_message) {
      return res.status(400).json({
        success: false,
        error: 'module_type e user_message são obrigatórios'
      });
    }

    let finalSystemPrompt = system_prompt;
    if (!finalSystemPrompt) {
      const activePrompt = await AssistantPrompt.findOne({
        where: { module_type, is_active: true },
        order: [['version', 'DESC']]
      });
      finalSystemPrompt = activePrompt?.system_prompt || 'Você é um assistente útil.';
    }

    let config;
    if (provider && model_name) {
      config = {
        provider,
        model_name,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1500
      };
    } else {
      config = await llmConfigService.getConfig(module_type);
    }

    if (!providerRegistry.isProviderAvailable(config.provider) && config.provider !== 'custom') {
      return res.status(400).json({
        success: false,
        error: `Provider '${config.provider}' não está disponível. Configure a chave de API.`
      });
    }

    const messages = [
      { role: 'system', content: finalSystemPrompt },
      { role: 'user', content: user_message }
    ];

    const startTime = Date.now();
    const result = await providerRegistry.callLLM(config, messages);
    const elapsed = Date.now() - startTime;

    return res.json({
      success: true,
      data: {
        response: result.content,
        model: result.model,
        provider: result.provider,
        usage: result.usage,
        elapsed_ms: elapsed,
        config_used: {
          provider: config.provider,
          model_name: config.model_name,
          temperature: config.temperature,
          max_tokens: config.max_tokens
        }
      }
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro no playground:', error);
    return res.status(500).json({
      success: false,
      error: `Erro ao executar playground: ${error.message}`
    });
  }
};

exports.getRankings = async (req, res) => {
  try {
    const { module_type } = req.params;

    if (!['baby', 'mother', 'professional'].includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: 'module_type inválido'
      });
    }

    const rankings = await AgentModelRanking.findAll({
      where: { module_type },
      order: [['stars', 'DESC'], ['provider', 'ASC']]
    });

    return res.json({
      success: true,
      data: rankings
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro ao buscar rankings:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar rankings'
    });
  }
};

exports.upsertRanking = async (req, res) => {
  try {
    const { module_type } = req.params;
    const { provider, model_name, stars, notes, cost_rating, speed_rating, quality_rating } = req.body;
    const userId = req.user?.id;

    if (!['baby', 'mother', 'professional'].includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: 'module_type inválido'
      });
    }

    if (!provider || !model_name || !stars) {
      return res.status(400).json({
        success: false,
        error: 'provider, model_name e stars são obrigatórios'
      });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        error: 'stars deve ser entre 1 e 5'
      });
    }

    const [ranking, created] = await AgentModelRanking.upsert({
      module_type,
      provider,
      model_name,
      stars,
      notes: notes || null,
      cost_rating: cost_rating || 'medium',
      speed_rating: speed_rating || 'medium',
      quality_rating: quality_rating || 'medium',
      rated_by: userId
    }, {
      returning: true,
      conflictFields: ['module_type', 'provider', 'model_name']
    });

    return res.json({
      success: true,
      data: ranking,
      created,
      message: `Ranking ${created ? 'criado' : 'atualizado'} com sucesso`
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro ao salvar ranking:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao salvar ranking'
    });
  }
};

exports.deleteRanking = async (req, res) => {
  try {
    const { id } = req.params;

    const ranking = await AgentModelRanking.findByPk(id);
    if (!ranking) {
      return res.status(404).json({
        success: false,
        error: 'Ranking não encontrado'
      });
    }

    await ranking.destroy();

    return res.json({
      success: true,
      message: 'Ranking removido com sucesso'
    });
  } catch (error) {
    console.error('[AgentControlCenter] Erro ao remover ranking:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao remover ranking'
    });
  }
};
