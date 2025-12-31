const { Profile, User } = require('../models');
const { validationResult } = require('express-validator');

// Listar todos os perfis (apenas para admin/owner)
exports.listProfiles = async (req, res) => {
  try {
    // Opções de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Buscar perfis com paginação
    const { count, rows: profiles } = await Profile.findAndCountAll({
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'role', 'isActive', 'createdAt'] 
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Calcular informações de paginação
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return res.status(200).json({
      profiles,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
  } catch (error) {
    console.error('Erro ao listar perfis:', error);
    return res.status(500).json({ error: 'Erro ao listar perfis' });
  }
};

// Obter perfil do usuário autenticado
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar perfil pelo ID do usuário
    const profile = await Profile.findOne({
      where: { userId },
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'role', 'isActive', 'createdAt', 'phoneNumber'] 
      }]
    });
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Perfil não encontrado' });
    }
    
    // Retornar no formato esperado pelo frontend
    return res.status(200).json({ 
      success: true, 
      data: {
        ...profile.toJSON(),
        role: profile.user?.role || 'parent',
        phoneNumber: profile.phoneNumber || profile.user?.phoneNumber || null
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ success: false, error: 'Erro ao buscar perfil' });
  }
};

// Obter perfil por ID (apenas para admin/owner ou o próprio usuário)
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar perfil pelo ID
    const profile = await Profile.findByPk(id, {
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'role', 'isActive', 'createdAt'] 
      }]
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Verificar se o usuário tem permissão para acessar o perfil
    if (req.user.role !== 'admin' && req.user.role !== 'owner' && req.user.id !== profile.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil do usuário autenticado
exports.updateMyProfile = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { firstName, lastName, displayName, phoneNumber, birthDate, gender, address, bio, avatarUrl } = req.body;
    
    // Buscar perfil pelo ID do usuário
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Atualizar campos do perfil
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (displayName) profile.displayName = displayName;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (birthDate) profile.birthDate = birthDate;
    if (gender) profile.gender = gender;
    if (address) profile.address = address;
    if (bio) profile.bio = bio;
    if (avatarUrl) profile.avatarUrl = avatarUrl;
    
    // Salvar alterações
    await profile.save();
    
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Atualizar perfil por ID (apenas para admin/owner)
exports.updateProfileById = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { firstName, lastName, displayName, phoneNumber, birthDate, gender, address, bio, avatarUrl } = req.body;
    
    // Verificar se o usuário tem permissão para atualizar o perfil
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Buscar perfil pelo ID
    const profile = await Profile.findByPk(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Atualizar campos do perfil
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (displayName) profile.displayName = displayName;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (birthDate) profile.birthDate = birthDate;
    if (gender) profile.gender = gender;
    if (address) profile.address = address;
    if (bio) profile.bio = bio;
    if (avatarUrl) profile.avatarUrl = avatarUrl;
    
    // Salvar alterações
    await profile.save();
    
    return res.status(200).json({ profile });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Verificar perfil (apenas admin/owner)
exports.verifyProfile = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { isVerified } = req.body;
    
    // Buscar perfil pelo ID
    const profile = await Profile.findByPk(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Atualizar status de verificação
    profile.isVerified = isVerified;
    await profile.save();
    
    return res.status(200).json({
      message: `Perfil ${isVerified ? 'verificado' : 'não verificado'} com sucesso`,
      profile
    });
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    return res.status(500).json({ error: 'Erro ao verificar perfil' });
  }
};

// Atualizar preferências do perfil do usuário autenticado
exports.updatePreferences = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { preferences } = req.body;
    
    // Buscar perfil pelo ID do usuário
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Atualizar preferências do perfil
    profile.preferences = preferences;
    await profile.save();
    
    return res.status(200).json({
      message: 'Preferências atualizadas com sucesso',
      profile
    });
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    return res.status(500).json({ error: 'Erro ao atualizar preferências' });
  }
};
