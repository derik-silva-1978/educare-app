const { Journey, UserJourney, Child, Profile } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar jornadas disponíveis
exports.listJourneys = async (req, res) => {
  try {
    // Opções de filtro
    const filter = { 
      isActive: true,
      isPublic: true
    };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Filtro de idade
    if (req.query.ageInMonths) {
      const ageInMonths = parseInt(req.query.ageInMonths);
      filter[Op.and] = [
        { [Op.or]: [
          { ageRangeMin: { [Op.lte]: ageInMonths } },
          { ageRangeMin: null }
        ]},
        { [Op.or]: [
          { ageRangeMax: { [Op.gte]: ageInMonths } },
          { ageRangeMax: null }
        ]}
      ];
    }
    
    // Buscar jornadas
    const journeys = await Journey.findAll({
      where: filter,
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({ journeys });
  } catch (error) {
    console.error('Erro ao listar jornadas:', error);
    return res.status(500).json({ error: 'Erro ao listar jornadas' });
  }
};

// Obter jornada por ID
exports.getJourneyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar jornada pelo ID
    const journey = await Journey.findByPk(id);
    
    if (!journey) {
      return res.status(404).json({ error: 'Jornada não encontrada' });
    }
    
    // Verificar se a jornada está ativa e pública ou se o usuário é admin/owner/creator
    if ((!journey.isActive || !journey.isPublic) && 
        req.user.role !== 'admin' && 
        req.user.role !== 'owner' && 
        journey.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Jornada não disponível' });
    }
    
    return res.status(200).json({ journey });
  } catch (error) {
    console.error('Erro ao buscar jornada:', error);
    return res.status(500).json({ error: 'Erro ao buscar jornada' });
  }
};

// Criar nova jornada (admin/owner/professional)
exports.createJourney = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      name, 
      description, 
      type, 
      category, 
      ageRangeMin, 
      ageRangeMax, 
      iconUrl, 
      coverImageUrl, 
      steps, 
      duration, 
      difficulty, 
      isPublic 
    } = req.body;
    
    // Criar jornada
    const journey = await Journey.create({
      name,
      description,
      type,
      category,
      ageRangeMin,
      ageRangeMax,
      iconUrl,
      coverImageUrl,
      steps,
      duration,
      difficulty,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user.id
    });
    
    return res.status(201).json({ journey });
  } catch (error) {
    console.error('Erro ao criar jornada:', error);
    return res.status(500).json({ error: 'Erro ao criar jornada' });
  }
};

// Atualizar jornada
exports.updateJourney = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { 
      name, 
      description, 
      type, 
      category, 
      ageRangeMin, 
      ageRangeMax, 
      iconUrl, 
      coverImageUrl, 
      steps, 
      duration, 
      difficulty, 
      isActive,
      isPublic 
    } = req.body;
    
    // Buscar jornada pelo ID
    const journey = await Journey.findByPk(id);
    
    if (!journey) {
      return res.status(404).json({ error: 'Jornada não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para atualizar a jornada
    if (journey.createdBy !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Atualizar campos da jornada
    if (name) journey.name = name;
    if (description) journey.description = description;
    if (type) journey.type = type;
    if (category) journey.category = category;
    if (ageRangeMin !== undefined) journey.ageRangeMin = ageRangeMin;
    if (ageRangeMax !== undefined) journey.ageRangeMax = ageRangeMax;
    if (iconUrl) journey.iconUrl = iconUrl;
    if (coverImageUrl) journey.coverImageUrl = coverImageUrl;
    if (steps) journey.steps = steps;
    if (duration !== undefined) journey.duration = duration;
    if (difficulty) journey.difficulty = difficulty;
    if (isActive !== undefined) journey.isActive = isActive;
    if (isPublic !== undefined) journey.isPublic = isPublic;
    
    // Salvar alterações
    await journey.save();
    
    return res.status(200).json({ journey });
  } catch (error) {
    console.error('Erro ao atualizar jornada:', error);
    return res.status(500).json({ error: 'Erro ao atualizar jornada' });
  }
};

// Excluir jornada
exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar jornada pelo ID
    const journey = await Journey.findByPk(id);
    
    if (!journey) {
      return res.status(404).json({ error: 'Jornada não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para excluir a jornada
    if (journey.createdBy !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a jornada tem usuários
    const userJourneysCount = await UserJourney.count({
      where: { journeyId: id }
    });
    
    if (userJourneysCount > 0) {
      // Não excluir, apenas desativar
      journey.isActive = false;
      await journey.save();
      
      return res.status(200).json({ 
        message: 'Jornada desativada (não excluída pois possui usuários)',
        deactivated: true
      });
    }
    
    // Excluir jornada
    await journey.destroy();
    
    return res.status(200).json({ message: 'Jornada excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir jornada:', error);
    return res.status(500).json({ error: 'Erro ao excluir jornada' });
  }
};

// Iniciar jornada para uma criança
exports.startJourney = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { journeyId, childId } = req.body;
    
    // Buscar jornada pelo ID
    const journey = await Journey.findByPk(journeyId);
    
    if (!journey) {
      return res.status(404).json({ error: 'Jornada não encontrada' });
    }
    
    // Verificar se a jornada está ativa
    if (!journey.isActive) {
      return res.status(400).json({ error: 'Jornada não está ativa' });
    }
    
    // Verificar se a criança existe e pertence ao usuário
    const child = await Child.findByPk(childId, {
      include: [{ model: Profile, as: 'profile' }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para acessar a criança
    if (child.profile.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      // Verificar se o usuário é um profissional com acesso à criança
      // Implementar lógica de verificação de acesso de profissionais aqui
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a criança já iniciou esta jornada
    const existingUserJourney = await UserJourney.findOne({
      where: {
        journeyId,
        childId,
        status: {
          [Op.in]: ['not_started', 'in_progress']
        }
      }
    });
    
    if (existingUserJourney) {
      return res.status(400).json({ 
        error: 'Esta criança já iniciou esta jornada',
        userJourney: existingUserJourney
      });
    }
    
    // Criar jornada do usuário
    const userJourney = await UserJourney.create({
      userId: req.user.id,
      childId,
      journeyId,
      startedAt: new Date(),
      status: 'not_started',
      currentStep: 0,
      progress: 0
    });
    
    return res.status(201).json({ 
      userJourney,
      journey: {
        id: journey.id,
        name: journey.name,
        description: journey.description,
        type: journey.type,
        steps: journey.steps,
        duration: journey.duration
      }
    });
  } catch (error) {
    console.error('Erro ao iniciar jornada:', error);
    return res.status(500).json({ error: 'Erro ao iniciar jornada' });
  }
};

// Atualizar progresso na jornada
exports.updateJourneyProgress = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { currentStep, progress, status, notes } = req.body;
    
    // Buscar jornada do usuário pelo ID
    const userJourney = await UserJourney.findByPk(id, {
      include: [
        { model: Journey, as: 'journey' },
        { model: Child, as: 'child', include: [{ model: Profile, as: 'profile' }] }
      ]
    });
    
    if (!userJourney) {
      return res.status(404).json({ error: 'Jornada do usuário não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para atualizar a jornada
    if (userJourney.userId !== req.user.id && 
        userJourney.child.profile.userId !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'owner') {
      // Verificar se o usuário é um profissional com acesso à criança
      // Implementar lógica de verificação de acesso de profissionais aqui
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Atualizar campos da jornada do usuário
    if (currentStep !== undefined) {
      userJourney.currentStep = currentStep;
      
      // Se chegou ao último passo, marcar como concluída
      if (userJourney.journey.steps && Array.isArray(userJourney.journey.steps)) {
        if (currentStep >= userJourney.journey.steps.length) {
          userJourney.status = 'completed';
          userJourney.completedAt = new Date();
          userJourney.progress = 100;
        } else if (userJourney.status === 'not_started') {
          userJourney.status = 'in_progress';
        }
      }
    }
    
    if (progress !== undefined) userJourney.progress = progress;
    if (status) userJourney.status = status;
    if (notes) userJourney.notes = notes;
    
    // Se status for 'completed', definir data de conclusão
    if (status === 'completed' && !userJourney.completedAt) {
      userJourney.completedAt = new Date();
      userJourney.progress = 100;
    }
    
    // Salvar alterações
    await userJourney.save();
    
    return res.status(200).json({ userJourney });
  } catch (error) {
    console.error('Erro ao atualizar progresso na jornada:', error);
    return res.status(500).json({ error: 'Erro ao atualizar progresso na jornada' });
  }
};

// Listar jornadas de uma criança
exports.listChildJourneys = async (req, res) => {
  try {
    const { childId } = req.params;
    
    // Verificar se a criança existe e pertence ao usuário
    const child = await Child.findByPk(childId, {
      include: [{ model: Profile, as: 'profile' }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para acessar a criança
    if (child.profile.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      // Verificar se o usuário é um profissional com acesso à criança
      // Implementar lógica de verificação de acesso de profissionais aqui
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Buscar jornadas da criança
    const userJourneys = await UserJourney.findAll({
      where: { childId },
      include: [{ model: Journey, as: 'journey' }],
      order: [['startedAt', 'DESC']]
    });
    
    return res.status(200).json({ userJourneys });
  } catch (error) {
    console.error('Erro ao listar jornadas da criança:', error);
    return res.status(500).json({ error: 'Erro ao listar jornadas da criança' });
  }
};
