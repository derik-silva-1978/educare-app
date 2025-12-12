const { Child, Profile, User, Subscription, SubscriptionPlan } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar crianças do usuário autenticado
exports.listMyChildren = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar perfil do usuário
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Buscar crianças do perfil
    const children = await Child.findAll({
      where: { profileId: profile.id },
      order: [['createdAt', 'DESC']]
    });
    
    // Adicionar userId às crianças para compatibilidade com o frontend
    const childrenWithUserId = children.map(child => ({
      ...child.toJSON(),
      userId: userId
    }));
    
    return res.status(200).json({ children: childrenWithUserId });
  } catch (error) {
    console.error('Erro ao listar crianças:', error);
    return res.status(500).json({ error: 'Erro ao listar crianças' });
  }
};

// Obter criança por ID
exports.getChildById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id', 'email'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para acessar a criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      // Verificar se o usuário é um profissional com acesso à criança
      // Implementar lógica de verificação de acesso de profissionais aqui
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    return res.status(200).json({ child });
  } catch (error) {
    console.error('Erro ao buscar criança:', error);
    return res.status(500).json({ error: 'Erro ao buscar criança' });
  }
};

// Criar nova criança
exports.createChild = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { name, birthDate, gender, avatarUrl, notes } = req.body;
    
    // Dividir name em firstName e lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Buscar perfil do usuário
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    
    // Verificar limite de crianças no plano (exceto para admin/owner)
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      // Buscar assinatura ativa do usuário
      const subscription = await Subscription.findOne({
        where: { 
          userId, 
          status: ['active', 'trial'] 
        },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });
      
      if (!subscription) {
        return res.status(403).json({ 
          error: 'Assinatura não encontrada ou inativa',
          upgrade: true
        });
      }
      
      // Contar crianças existentes
      const childrenCount = await Child.count({ where: { profileId: profile.id } });
      
      // Verificar limite do plano
      if (childrenCount >= subscription.plan.maxChildren) {
        return res.status(403).json({ 
          error: 'Limite de crianças atingido para seu plano atual',
          upgrade: true,
          currentPlan: subscription.plan.name,
          currentLimit: subscription.plan.maxChildren
        });
      }
      
      // Atualizar contador de crianças na assinatura
      subscription.childrenCount = childrenCount + 1;
      await subscription.save();
    }
    
    // Criar criança
    const child = await Child.create({
      profileId: profile.id,
      firstName,
      lastName,
      birthDate,
      gender,
      avatarUrl,
      notes
    });
    
    return res.status(201).json({ child });
  } catch (error) {
    console.error('Erro ao criar criança:', error);
    return res.status(500).json({ error: 'Erro ao criar criança' });
  }
};

// Atualizar criança
exports.updateChild = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const userId = req.user.id;
    const { name, birthDate, gender, avatarUrl, notes } = req.body;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para atualizar a criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Atualizar campos da criança
    if (name) child.name = name;
    if (birthDate) child.birthDate = birthDate;
    if (gender) child.gender = gender;
    if (avatarUrl) child.avatarUrl = avatarUrl;
    if (notes) child.notes = notes;
    
    // Salvar alterações
    await child.save();
    
    return res.status(200).json({ child });
  } catch (error) {
    console.error('Erro ao atualizar criança:', error);
    return res.status(500).json({ error: 'Erro ao atualizar criança' });
  }
};

// Excluir criança
exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para excluir a criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Atualizar contador de crianças na assinatura (exceto para admin/owner)
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      const subscription = await Subscription.findOne({
        where: { 
          userId, 
          status: ['active', 'trial'] 
        }
      });
      
      if (subscription) {
        subscription.childrenCount = Math.max(0, subscription.childrenCount - 1);
        await subscription.save();
      }
    }
    
    // Excluir criança
    await child.destroy();
    
    return res.status(200).json({ message: 'Criança excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir criança:', error);
    return res.status(500).json({ error: 'Erro ao excluir criança' });
  }
};

// Adicionar documento/foto da criança
exports.addChildDocument = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const userId = req.user.id;
    const { title, type, url, description } = req.body;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para adicionar documentos à criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Criar documento
    const document = {
      title,
      type,
      url,
      description: description || '',
      createdAt: new Date()
    };
    
    // Adicionar documento à criança
    if (!child.documents) {
      child.documents = [];
    }
    
    child.documents.push(document);
    await child.save();
    
    return res.status(201).json({ 
      message: 'Documento adicionado com sucesso',
      document
    });
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
    return res.status(500).json({ error: 'Erro ao adicionar documento' });
  }
};

// Remover documento/foto da criança
exports.removeChildDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    const userId = req.user.id;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para remover documentos da criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a criança tem documentos
    if (!child.documents || !Array.isArray(child.documents)) {
      return res.status(404).json({ error: 'Nenhum documento encontrado' });
    }
    
    // Encontrar o índice do documento pelo ID
    const documentIndex = child.documents.findIndex(doc => doc.id === documentId || doc.id === parseInt(documentId));
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    
    // Remover o documento do array
    const removedDocument = child.documents.splice(documentIndex, 1)[0];
    
    // Salvar as alterações
    await child.save();
    
    return res.status(200).json({ 
      message: 'Documento removido com sucesso',
      removedDocument
    });
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    return res.status(500).json({ error: 'Erro ao remover documento' });
  }
};

// Adicionar nota de desenvolvimento da criança
exports.addDevelopmentNote = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const userId = req.user.id;
    const { note, category, milestone, date } = req.body;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para adicionar notas à criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Criar nota de desenvolvimento
    const developmentNote = {
      id: Date.now().toString(), // Gerar ID único
      note,
      category: category || 'geral',
      milestone: milestone || null,
      date: date ? new Date(date) : new Date(),
      createdBy: userId,
      createdAt: new Date()
    };
    
    // Adicionar nota à criança
    if (!child.developmentNotes) {
      child.developmentNotes = [];
    }
    
    child.developmentNotes.push(developmentNote);
    await child.save();
    
    return res.status(201).json({ 
      message: 'Nota de desenvolvimento adicionada com sucesso',
      developmentNote
    });
  } catch (error) {
    console.error('Erro ao adicionar nota de desenvolvimento:', error);
    return res.status(500).json({ error: 'Erro ao adicionar nota de desenvolvimento' });
  }
};

// Listar notas de desenvolvimento da criança
exports.listDevelopmentNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para ver notas da criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a criança tem notas de desenvolvimento
    if (!child.developmentNotes || !Array.isArray(child.developmentNotes)) {
      return res.status(200).json({ developmentNotes: [] });
    }
    
    // Ordenar notas por data (mais recentes primeiro)
    const sortedNotes = [...child.developmentNotes].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    return res.status(200).json({ 
      developmentNotes: sortedNotes
    });
  } catch (error) {
    console.error('Erro ao listar notas de desenvolvimento:', error);
    return res.status(500).json({ error: 'Erro ao listar notas de desenvolvimento' });
  }
};

// Atualizar nota de desenvolvimento da criança
exports.updateDevelopmentNote = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id, noteId } = req.params;
    const userId = req.user.id;
    const { note, category, milestone, date } = req.body;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para atualizar notas da criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a criança tem notas de desenvolvimento
    if (!child.developmentNotes || !Array.isArray(child.developmentNotes)) {
      return res.status(404).json({ error: 'Nenhuma nota de desenvolvimento encontrada' });
    }
    
    // Encontrar o índice da nota pelo ID
    const noteIndex = child.developmentNotes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Nota de desenvolvimento não encontrada' });
    }
    
    // Atualizar a nota
    const updatedNote = {
      ...child.developmentNotes[noteIndex],
      note: note !== undefined ? note : child.developmentNotes[noteIndex].note,
      category: category !== undefined ? category : child.developmentNotes[noteIndex].category,
      milestone: milestone !== undefined ? milestone : child.developmentNotes[noteIndex].milestone,
      date: date !== undefined ? new Date(date) : child.developmentNotes[noteIndex].date,
      updatedAt: new Date(),
      updatedBy: userId
    };
    
    // Substituir a nota antiga pela atualizada
    child.developmentNotes[noteIndex] = updatedNote;
    
    // Salvar as alterações
    await child.save();
    
    return res.status(200).json({ 
      message: 'Nota de desenvolvimento atualizada com sucesso',
      developmentNote: updatedNote
    });
  } catch (error) {
    console.error('Erro ao atualizar nota de desenvolvimento:', error);
    return res.status(500).json({ error: 'Erro ao atualizar nota de desenvolvimento' });
  }
};

// Excluir nota de desenvolvimento da criança
exports.deleteDevelopmentNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;
    const userId = req.user.id;
    
    // Buscar criança pelo ID
    const child = await Child.findByPk(id, {
      include: [{ 
        model: Profile,
        include: [{ model: User, attributes: ['id'] }]
      }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para excluir notas da criança
    if (child.Profile.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a criança tem notas de desenvolvimento
    if (!child.developmentNotes || !Array.isArray(child.developmentNotes)) {
      return res.status(404).json({ error: 'Nenhuma nota de desenvolvimento encontrada' });
    }
    
    // Encontrar o índice da nota pelo ID
    const noteIndex = child.developmentNotes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Nota de desenvolvimento não encontrada' });
    }
    
    // Remover a nota do array
    const removedNote = child.developmentNotes.splice(noteIndex, 1)[0];
    
    // Salvar as alterações
    await child.save();
    
    return res.status(200).json({ 
      message: 'Nota de desenvolvimento excluída com sucesso',
      removedNote
    });
  } catch (error) {
    console.error('Erro ao excluir nota de desenvolvimento:', error);
    return res.status(500).json({ error: 'Erro ao excluir nota de desenvolvimento' });
  }
};
