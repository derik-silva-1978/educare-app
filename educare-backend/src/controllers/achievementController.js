const { Achievement, UserAchievement, Child, Profile } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar todas as conquistas disponíveis
exports.listAchievements = async (req, res) => {
  try {
    // Opções de filtro
    const filter = { isActive: true };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Buscar conquistas
    const achievements = await Achievement.findAll({
      where: filter,
      order: [['points', 'DESC']]
    });
    
    return res.status(200).json({ achievements });
  } catch (error) {
    console.error('Erro ao listar conquistas:', error);
    return res.status(500).json({ error: 'Erro ao listar conquistas' });
  }
};

// Obter conquista por ID
exports.getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar conquista pelo ID
    const achievement = await Achievement.findByPk(id);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }
    
    // Verificar se a conquista está ativa ou se o usuário é admin/owner
    if (!achievement.isActive && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Conquista não disponível' });
    }
    
    return res.status(200).json({ achievement });
  } catch (error) {
    console.error('Erro ao buscar conquista:', error);
    return res.status(500).json({ error: 'Erro ao buscar conquista' });
  }
};

// Criar nova conquista (apenas admin/owner)
exports.createAchievement = async (req, res) => {
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
      iconUrl, 
      points, 
      conditions, 
      isActive 
    } = req.body;
    
    // Criar conquista
    const achievement = await Achievement.create({
      name,
      description,
      type,
      category,
      iconUrl,
      points,
      conditions,
      isActive: isActive !== undefined ? isActive : true
    });
    
    return res.status(201).json({ achievement });
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    return res.status(500).json({ error: 'Erro ao criar conquista' });
  }
};

// Atualizar conquista (apenas admin/owner)
exports.updateAchievement = async (req, res) => {
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
      iconUrl, 
      points, 
      conditions, 
      isActive 
    } = req.body;
    
    // Buscar conquista pelo ID
    const achievement = await Achievement.findByPk(id);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }
    
    // Atualizar campos da conquista
    if (name) achievement.name = name;
    if (description) achievement.description = description;
    if (type) achievement.type = type;
    if (category) achievement.category = category;
    if (iconUrl) achievement.iconUrl = iconUrl;
    if (points !== undefined) achievement.points = points;
    if (conditions) achievement.conditions = conditions;
    if (isActive !== undefined) achievement.isActive = isActive;
    
    // Salvar alterações
    await achievement.save();
    
    return res.status(200).json({ achievement });
  } catch (error) {
    console.error('Erro ao atualizar conquista:', error);
    return res.status(500).json({ error: 'Erro ao atualizar conquista' });
  }
};

// Excluir conquista (apenas admin/owner)
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar conquista pelo ID
    const achievement = await Achievement.findByPk(id);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }
    
    // Verificar se a conquista tem usuários
    const userAchievementsCount = await UserAchievement.count({
      where: { achievementId: id }
    });
    
    if (userAchievementsCount > 0) {
      // Não excluir, apenas desativar
      achievement.isActive = false;
      await achievement.save();
      
      return res.status(200).json({ 
        message: 'Conquista desativada (não excluída pois possui usuários)',
        deactivated: true
      });
    }
    
    // Excluir conquista
    await achievement.destroy();
    
    return res.status(200).json({ message: 'Conquista excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conquista:', error);
    return res.status(500).json({ error: 'Erro ao excluir conquista' });
  }
};

// Atribuir conquista a um usuário/criança
exports.awardAchievement = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { achievementId, childId, progress, metadata } = req.body;
    
    // Buscar conquista pelo ID
    const achievement = await Achievement.findByPk(achievementId);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }
    
    // Verificar se a conquista está ativa
    if (!achievement.isActive && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Conquista não disponível' });
    }
    
    // Verificar se a criança existe e pertence ao usuário
    let child = null;
    if (childId) {
      child = await Child.findByPk(childId, {
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
    }
    
    // Verificar se o usuário/criança já possui esta conquista
    const existingAchievement = await UserAchievement.findOne({
      where: {
        userId: req.user.id,
        childId: childId || null,
        achievementId
      }
    });
    
    if (existingAchievement) {
      // Atualizar progresso se for menor que 100%
      if (existingAchievement.progress < 100 && progress !== undefined) {
        existingAchievement.progress = Math.min(100, progress);
        
        // Se atingiu 100%, marcar como visualizada
        if (existingAchievement.progress >= 100) {
          existingAchievement.earnedAt = new Date();
        }
        
        // Atualizar metadata se fornecido
        if (metadata) {
          existingAchievement.metadata = {
            ...existingAchievement.metadata,
            ...metadata
          };
        }
        
        await existingAchievement.save();
        
        return res.status(200).json({ 
          userAchievement: existingAchievement,
          updated: true
        });
      }
      
      return res.status(400).json({ 
        error: 'Esta conquista já foi atribuída',
        userAchievement: existingAchievement
      });
    }
    
    // Criar conquista do usuário
    const userAchievement = await UserAchievement.create({
      userId: req.user.id,
      childId: childId || null,
      achievementId,
      earnedAt: new Date(),
      progress: progress !== undefined ? Math.min(100, progress) : 100,
      isViewed: false,
      metadata: metadata || {}
    });
    
    return res.status(201).json({ 
      userAchievement,
      achievement
    });
  } catch (error) {
    console.error('Erro ao atribuir conquista:', error);
    return res.status(500).json({ error: 'Erro ao atribuir conquista' });
  }
};

// Listar conquistas de uma criança
exports.listChildAchievements = async (req, res) => {
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
    
    // Buscar conquistas da criança
    const userAchievements = await UserAchievement.findAll({
      where: { childId },
      include: [{ model: Achievement, as: 'achievement' }],
      order: [['earnedAt', 'DESC']]
    });
    
    return res.status(200).json({ userAchievements });
  } catch (error) {
    console.error('Erro ao listar conquistas da criança:', error);
    return res.status(500).json({ error: 'Erro ao listar conquistas da criança' });
  }
};

// Marcar conquista como visualizada
exports.markAchievementAsViewed = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar conquista do usuário pelo ID
    const userAchievement = await UserAchievement.findByPk(id);
    
    if (!userAchievement) {
      return res.status(404).json({ error: 'Conquista do usuário não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para atualizar a conquista
    if (userAchievement.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Marcar como visualizada
    userAchievement.isViewed = true;
    await userAchievement.save();
    
    return res.status(200).json({ userAchievement });
  } catch (error) {
    console.error('Erro ao marcar conquista como visualizada:', error);
    return res.status(500).json({ error: 'Erro ao marcar conquista como visualizada' });
  }
};
