const ChatGroup = require('../models/ChatGroup');
const ChatMessage = require('../models/ChatMessage');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Criar grupo de chat
const createChatGroup = async (req, res) => {
  try {
    const { team_id, child_id, name, description } = req.body;
    const userId = req.user.id;

    // Verificar se o usuário é membro da equipe
    const teamMember = await TeamMember.findOne({
      where: { team_id, user_id: userId, status: 'active' }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para criar chat nesta equipe'
      });
    }

    const chatGroup = await ChatGroup.create({
      team_id,
      child_id,
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: chatGroup
    });
  } catch (error) {
    console.error('Erro ao criar grupo de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Listar grupos de chat do usuário
const getChatGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar equipes do usuário
    const teamMembers = await TeamMember.findAll({
      where: { userId: userId, status: 'active' },
      include: [{
        model: Team,
        as: 'team'
      }]
    });

    const teamIds = teamMembers.map(tm => tm.teamId);

    // Buscar grupos de chat das equipes
    const chatGroups = await ChatGroup.findAll({
      where: { 
        team_id: teamIds,
        is_active: true 
      },
      include: [{
        model: Team,
        as: 'team'
      }],
      order: [['updated_at', 'DESC']]
    });

    res.json({
      success: true,
      data: chatGroups
    });
  } catch (error) {
    console.error('Erro ao buscar grupos de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar grupo de chat por ID
const getChatGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatGroup = await ChatGroup.findByPk(id, {
      include: [{
        model: Team,
        as: 'team'
      }]
    });

    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    // Verificar se o usuário é membro da equipe
    const teamMember = await TeamMember.findOne({
      where: { 
        team_id: chatGroup.team_id, 
        user_id: userId, 
        status: 'active' 
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a este grupo de chat'
      });
    }

    res.json({
      success: true,
      data: chatGroup
    });
  } catch (error) {
    console.error('Erro ao buscar grupo de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar mensagens do grupo
const getChatMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    const teamMember = await TeamMember.findOne({
      where: { 
        team_id: chatGroup.team_id, 
        user_id: userId, 
        status: 'active' 
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a este grupo de chat'
      });
    }

    const offset = (page - 1) * limit;

    const messages = await ChatMessage.findAndCountAll({
      where: { chat_group_id: groupId },
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Profile,
          as: 'profiles',
          attributes: ['name', 'type', 'professional_specialty']
        }]
      }]
    });

    res.json({
      success: true,
      data: {
        messages: messages.rows,
        total: messages.count,
        page: parseInt(page),
        totalPages: Math.ceil(messages.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Enviar mensagem
const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message_content, message_type = 'text', reply_to_id } = req.body;
    const userId = req.user.id;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    const teamMember = await TeamMember.findOne({
      where: { 
        team_id: chatGroup.team_id, 
        user_id: userId, 
        status: 'active' 
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a este grupo de chat'
      });
    }

    // Buscar dados do usuário
    const user = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profiles'
      }]
    });

    const senderRole = user.role === 'professional' ? 'professional' : 'parent';

    const message = await ChatMessage.create({
      chat_group_id: groupId,
      sender_id: userId,
      sender_name: user.name,
      sender_role: senderRole,
      message_content,
      message_type,
      reply_to_id
    });

    // Atualizar timestamp do grupo
    await chatGroup.update({ updated_at: new Date() });

    const messageWithSender = await ChatMessage.findByPk(message.id, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: messageWithSender
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar participantes do grupo
const getChatParticipants = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    const teamMember = await TeamMember.findOne({
      where: { 
        team_id: chatGroup.team_id, 
        user_id: userId, 
        status: 'active' 
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a este grupo de chat'
      });
    }

    // Buscar todos os membros da equipe
    const participants = await TeamMember.findAll({
      where: { 
        team_id: chatGroup.team_id, 
        status: 'active' 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role'],
        include: [{
          model: Profile,
          as: 'profiles',
          attributes: ['name', 'type', 'professional_specialty', 'phone']
        }]
      }]
    });

    res.json({
      success: true,
      data: participants
    });
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createChatGroup,
  getChatGroups,
  getChatGroupById,
  getChatMessages,
  sendMessage,
  getChatParticipants
};
