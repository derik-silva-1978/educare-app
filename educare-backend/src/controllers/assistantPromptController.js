const { AssistantPrompt, User } = require('../models');
const { ALL_MODULE_TYPES } = require('../constants/agentModules');

exports.getPrompts = async (req, res) => {
  try {
    const { module_type, include_inactive } = req.query;
    
    const where = {};
    if (module_type) {
      where.module_type = module_type;
    }
    if (!include_inactive) {
      where.is_active = true;
    }
    
    const prompts = await AssistantPrompt.findAll({
      where,
      order: [['module_type', 'ASC'], ['version', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });
    
    return res.json({
      success: true,
      data: prompts
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao listar prompts:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar prompts'
    });
  }
};

exports.getPromptById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prompt = await AssistantPrompt.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt não encontrado'
      });
    }
    
    return res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao buscar prompt:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar prompt'
    });
  }
};

exports.getActivePromptByModule = async (req, res) => {
  try {
    const { module_type } = req.params;
    
    if (!ALL_MODULE_TYPES.includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: `Tipo de módulo inválido. Use: ${ALL_MODULE_TYPES.join(', ')}`
      });
    }
    
    const prompt = await AssistantPrompt.findOne({
      where: {
        module_type,
        is_active: true
      },
      order: [['version', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao buscar prompt ativo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar prompt ativo'
    });
  }
};

exports.createPrompt = async (req, res) => {
  try {
    const { module_type, name, description, system_prompt, variables_schema } = req.body;
    const userId = req.user.id;
    
    if (!module_type || !name || !system_prompt) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: module_type, name, system_prompt'
      });
    }
    
    if (!ALL_MODULE_TYPES.includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: `Tipo de módulo inválido. Use: ${ALL_MODULE_TYPES.join(', ')}`
      });
    }
    
    const existingActive = await AssistantPrompt.findOne({
      where: {
        module_type,
        is_active: true
      },
      order: [['version', 'DESC']]
    });
    
    const newVersion = existingActive ? existingActive.version + 1 : 1;
    
    if (existingActive) {
      await existingActive.update({ is_active: false, updated_by: userId });
    }
    
    const prompt = await AssistantPrompt.create({
      module_type,
      name,
      description,
      system_prompt,
      variables_schema: variables_schema || {},
      version: newVersion,
      is_active: true,
      created_by: userId,
      updated_by: userId
    });
    
    console.log(`[AssistantPrompt] Novo prompt criado: ${prompt.id} (v${newVersion}) para ${module_type}`);
    
    return res.status(201).json({
      success: true,
      data: prompt,
      message: `Prompt v${newVersion} criado e ativado para ${module_type}`
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao criar prompt:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar prompt'
    });
  }
};

exports.updatePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, system_prompt, variables_schema, is_active } = req.body;
    const userId = req.user.id;
    
    const prompt = await AssistantPrompt.findByPk(id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt não encontrado'
      });
    }
    
    if (is_active === true && !prompt.is_active) {
      await AssistantPrompt.update(
        { is_active: false, updated_by: userId },
        { where: { module_type: prompt.module_type, is_active: true } }
      );
    }
    
    const updateData = {
      updated_by: userId
    };
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (system_prompt !== undefined) updateData.system_prompt = system_prompt;
    if (variables_schema !== undefined) updateData.variables_schema = variables_schema;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    await prompt.update(updateData);
    
    console.log(`[AssistantPrompt] Prompt atualizado: ${prompt.id}`);
    
    return res.json({
      success: true,
      data: prompt,
      message: 'Prompt atualizado com sucesso'
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao atualizar prompt:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar prompt'
    });
  }
};

exports.activatePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const prompt = await AssistantPrompt.findByPk(id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt não encontrado'
      });
    }
    
    await AssistantPrompt.update(
      { is_active: false, updated_by: userId },
      { where: { module_type: prompt.module_type, is_active: true } }
    );
    
    await prompt.update({ is_active: true, updated_by: userId });
    
    console.log(`[AssistantPrompt] Prompt ativado: ${prompt.id} para ${prompt.module_type}`);
    
    return res.json({
      success: true,
      data: prompt,
      message: `Prompt v${prompt.version} ativado para ${prompt.module_type}`
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao ativar prompt:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao ativar prompt'
    });
  }
};

exports.getPromptHistory = async (req, res) => {
  try {
    const { module_type } = req.params;
    
    if (!ALL_MODULE_TYPES.includes(module_type)) {
      return res.status(400).json({
        success: false,
        error: `Tipo de módulo inválido. Use: ${ALL_MODULE_TYPES.join(', ')}`
      });
    }
    
    const prompts = await AssistantPrompt.findAll({
      where: { module_type },
      order: [['version', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    
    return res.json({
      success: true,
      data: prompts,
      count: prompts.length
    });
  } catch (error) {
    console.error('[AssistantPrompt] Erro ao buscar histórico:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico de prompts'
    });
  }
};
