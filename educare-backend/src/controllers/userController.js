const { User, Profile } = require('../models');
const { validationResult } = require('express-validator');

// Listar todos os usuários (apenas para admin/owner)
exports.listUsers = async (req, res) => {
  try {
    // Opções de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Opções de filtro
    const filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Buscar usuários com paginação
    const { count, rows: users } = await User.findAndCountAll({
      where: filter,
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Calcular informações de paginação
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return res.status(200).json({
      users,
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
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário tem permissão para acessar os dados
    if (req.user.role !== 'admin' && req.user.role !== 'owner' && req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { email, role, status } = req.body;
    
    // Verificar se o usuário tem permissão para atualizar os dados
    if (req.user.role !== 'admin' && req.user.role !== 'owner' && req.user.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Apenas admin/owner pode alterar role e status
    if ((role || status !== undefined) && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Apenas administradores podem alterar role e status' });
    }
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar se o e-mail já está em uso por outro usuário
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }
      user.email = email;
    }
    
    // Atualizar role e status (apenas para admin/owner)
    if (req.user.role === 'admin' || req.user.role === 'owner') {
      if (role) user.role = role;
      if (status !== undefined) user.status = status;
    }
    
    // Salvar alterações
    await user.save();
    
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Verificar se o usuário tem permissão para alterar a senha
    if (req.user.id !== id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Se não for admin/owner, verificar senha atual
    if (req.user.id === id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      const passwordMatch = await user.checkPassword(currentPassword);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
    }
    
    // Atualizar senha
    user.password = newPassword;
    await user.save();
    
    return res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ error: 'Erro ao alterar senha' });
  }
};

// Excluir usuário (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário tem permissão para excluir
    if (req.user.id !== id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Soft delete (marcar como inativo)
    user.status = 'inactive';
    await user.save();
    
    return res.status(200).json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
};

// Buscar usuários por nome ou email (apenas admin/owner)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Termo de busca é obrigatório' });
    }
    
    // Buscar usuários que correspondam ao termo de busca
    const users = await User.findAll({
      where: {
        [User.sequelize.Op.or]: [
          { email: { [User.sequelize.Op.iLike]: `%${query}%` } },
          { '$profile.firstName$': { [User.sequelize.Op.iLike]: `%${query}%` } },
          { '$profile.lastName$': { [User.sequelize.Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Atualizar status de um usuário (apenas admin/owner)
exports.updateUserStatus = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Atualizar status
    user.status = status;
    await user.save();
    
    return res.status(200).json({
      message: `Status do usuário alterado com sucesso`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status do usuário' });
  }
};

// Listar todos os profissionais com seus perfis
exports.listProfessionals = async (req, res) => {
  try {
    console.log('Buscando profissionais com perfis...');
    
    // Buscar usuários com role professional e seus perfis
    const professionals = await User.findAll({
      where: {
        role: 'professional'
      },
      include: [{
        model: Profile,
        as: 'profile',
        required: false // LEFT JOIN para incluir usuários mesmo sem perfil
      }],
      attributes: { 
        exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] 
      },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Encontrados ${professionals.length} profissionais`);
    
    // Mapear dados para formato esperado pelo frontend
    const mappedProfessionals = professionals.map(user => {
      const userData = user.toJSON();
      
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        phone: userData.phone,
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
        last_login_at: userData.lastLoginAt,
        profile: userData.profile ? {
          id: userData.profile.id,
          user_id: userData.profile.user_id,
          name: userData.profile.name,
          type: userData.profile.type,
          phone: userData.profile.phone,
          address: userData.profile.address,
          city: userData.profile.city,
          state: userData.profile.state,
          country: userData.profile.country,
          zip_code: userData.profile.zip_code,
          bio: userData.profile.bio,
          professional_id: userData.profile.professional_id,
          professional_specialty: userData.profile.professional_specialty,
          is_primary: userData.profile.is_primary,
          is_verified: userData.profile.is_verified,
          metadata: userData.profile.metadata,
          birth_date: userData.profile.birth_date,
          profession: userData.profile.profession,
          specialization: userData.profile.specialization,
          registration_number: userData.profile.registration_number,
          preferences: userData.profile.preferences,
          created_at: userData.profile.createdAt,
          updated_at: userData.profile.updatedAt
        } : null
      };
    });
    
    console.log('\n📋 === DADOS COMPLETOS DOS PROFISSIONAIS ===');
    mappedProfessionals.forEach((prof, index) => {
      console.log(`\n👤 PROFISSIONAL ${index + 1}:`);
      console.log('  - ID:', prof.id);
      console.log('  - Nome:', prof.name);
      console.log('  - Email:', prof.email);
      console.log('  - Role:', prof.role);
      console.log('  - Status:', prof.status);
      console.log('  - Phone:', prof.phone);
      console.log('  - Criado em:', prof.created_at);
      
      if (prof.profile) {
        console.log('  📄 PERFIL:');
        console.log('    - ID do perfil:', prof.profile.id);
        console.log('    - Nome do perfil:', prof.profile.name);
        console.log('    - Profissão:', prof.profile.profession);
        console.log('    - Especialização:', prof.profile.specialization);
        console.log('    - Telefone do perfil:', prof.profile.phone);
        console.log('    - Bio:', prof.profile.bio);
        console.log('    - Endereço:', prof.profile.address);
        console.log('    - Cidade:', prof.profile.city);
        console.log('    - Estado:', prof.profile.state);
      } else {
        console.log('  📄 PERFIL: null (sem perfil cadastrado)');
      }
    });
    
    console.log('\n📦 === ESTRUTURA FINAL ENVIADA AO FRONTEND ===');
    const responseData = {
      success: true,
      data: {
        professionals: mappedProfessionals,
        total: mappedProfessionals.length
      }
    };
    console.log('Response completa:', JSON.stringify(responseData, null, 2));
    console.log('\n=== FIM DOS LOGS DETALHADOS ===\n');
    
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao listar profissionais:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar profissionais' 
    });
  }
};

// Buscar um profissional específico com seu perfil
exports.getProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Buscando profissional ${id}...`);
    
    const professional = await User.findOne({
      where: {
        id,
        role: 'professional'
      },
      include: [{
        model: Profile,
        as: 'profile',
        required: false
      }],
      attributes: { 
        exclude: ['password', 'reset_token', 'reset_token_expires', 'phone_verification_code', 'phone_verification_expires'] 
      }
    });
    
    if (!professional) {
      return res.status(404).json({ 
        success: false,
        error: 'Profissional não encontrado' 
      });
    }
    
    const userData = professional.toJSON();
    
    const mappedProfessional = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      phone: userData.phone,
      created_at: userData.createdAt,
      updated_at: userData.updatedAt,
      last_login_at: userData.lastLoginAt,
      profile: userData.profile ? {
        id: userData.profile.id,
        user_id: userData.profile.user_id,
        name: userData.profile.name,
        type: userData.profile.type,
        phone: userData.profile.phone,
        address: userData.profile.address,
        city: userData.profile.city,
        state: userData.profile.state,
        country: userData.profile.country,
        zip_code: userData.profile.zip_code,
        bio: userData.profile.bio,
        professional_id: userData.profile.professional_id,
        professional_specialty: userData.profile.professional_specialty,
        is_primary: userData.profile.is_primary,
        is_verified: userData.profile.is_verified,
        metadata: userData.profile.metadata,
        birth_date: userData.profile.birth_date,
        profession: userData.profile.profession,
        specialization: userData.profile.specialization,
        registration_number: userData.profile.registration_number,
        preferences: userData.profile.preferences,
        created_at: userData.profile.createdAt,
        updated_at: userData.profile.updatedAt
      } : null
    };
    
    return res.status(200).json({
      success: true,
      data: mappedProfessional
    });
  } catch (error) {
    console.error('Erro ao buscar profissional:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar profissional' 
    });
  }
};
