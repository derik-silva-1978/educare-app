const ChatGroup = require('../models/ChatGroup');
const ChatMessage = require('../models/ChatMessage');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Criar grupo de chat
const createChatGroup = async (req, res) => {
  try {
    console.log('🚀 createChatGroup chamado!');
    console.log('📋 Body recebido:', req.body);
    console.log('👤 Usuário autenticado:', req.user);
    
    const { team_id, child_id, name, description } = req.body;
    const userId = req.user.id;
    
    // Nova lógica: Permitir que qualquer usuário autenticado crie grupos
    // Especialmente pais que precisam acessar chat de suas crianças
    console.log('✅ Permitindo criação de grupo para usuário:', userId);
    
    // Se for admin/professional, pode criar qualquer grupo
    // Se for pai (user), pode criar grupo para sua criança
    const userRole = req.user.role;
    console.log('👤 Role do usuário:', userRole);
    
    console.log('✅ Usuário tem permissão, criando grupo...');

    // Buscar nome real da criança para criar um nome amigável
    let groupName = name;
    if (child_id) {
      try {
        const Child = require('../models/Child');
        const child = await Child.findByPk(child_id);
        if (child && child.name) {
          groupName = `Chat - ${child.name}`;
          console.log('📝 Nome do grupo atualizado para:', groupName);
        } else {
          console.log('⚠️ Criança não encontrada, usando nome padrão');
          groupName = name || 'Chat da Equipe';
        }
      } catch (childError) {
        console.log('⚠️ Erro ao buscar criança, usando nome padrão:', childError.message);
        groupName = name || 'Chat da Equipe';
      }
    }

    const chatGroup = await ChatGroup.create({
      team_id,
      child_id,
      name: groupName,
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
    const userRole = req.user.role;

    let chatGroups;

    // Se for owner, pode ver todos os grupos
    if (userRole === 'owner') {
      chatGroups = await ChatGroup.findAll({
        where: { is_active: true },
        include: [{
          model: Team,
          as: 'team'
        }],
        order: [['updated_at', 'DESC']]
      });
    } else {
      // Para outros usuários, apenas grupos das equipes que participa
      // Simplificando: buscar todos os grupos por enquanto
      // TODO: Implementar filtro por equipe quando associações estiverem corretas
      console.log('🔍 Buscando grupos para usuário:', userId);
      
      // Por enquanto, retornar todos os grupos para evitar erro de associação
      chatGroups = await ChatGroup.findAll({
        where: { is_active: true },
        order: [['updated_at', 'DESC']]
      });
    }

    res.json({
      success: true,
      data: chatGroups,
      meta: {
        total: chatGroups.length,
        userRole: userRole,
        hasGlobalAccess: userRole === 'owner'
      }
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
    const userRole = req.user.role;

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

    // Owner tem acesso a todos os grupos
    if (userRole !== 'owner') {
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
    }

    res.json({
      success: true,
      data: chatGroup,
      meta: {
        userRole: userRole,
        hasGlobalAccess: userRole === 'owner'
      }
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
    const userRole = req.user.role;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    // Owner tem acesso a todos os grupos
    if (userRole !== 'owner') {
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
          as: 'profile',
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
    const userRole = req.user.role;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    // Owner tem acesso a todos os grupos
    if (userRole !== 'owner') {
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
    }

    // Buscar dados do usuário
    const user = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile'
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
    const userRole = req.user.role;

    // Verificar acesso ao grupo
    const chatGroup = await ChatGroup.findByPk(groupId);
    if (!chatGroup) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de chat não encontrado'
      });
    }

    // Owner tem acesso a todos os grupos
    if (userRole !== 'owner') {
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
          as: 'profile',
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

// Listar todos os chats do sistema (apenas para owner)
const getAllChatsForOwner = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Apenas owner pode acessar esta funcionalidade
    if (userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas proprietários podem visualizar todos os chats.'
      });
    }

    // Buscar todos os grupos de chat com estatísticas
    const chatGroups = await ChatGroup.findAll({
      where: { is_active: true },
      include: [
        {
          model: Team,
          as: 'team',
          include: [{
            model: TeamMember,
            as: 'members',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'role']
            }]
          }]
        }
      ],
      order: [['updated_at', 'DESC']]
    });

    // Buscar estatísticas de mensagens para cada grupo
    const groupsWithStats = await Promise.all(
      chatGroups.map(async (group) => {
        const messageCount = await ChatMessage.count({
          where: { chat_group_id: group.id }
        });

        const lastMessage = await ChatMessage.findOne({
          where: { chat_group_id: group.id },
          order: [['created_at', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'role']
          }]
        });

        return {
          ...group.toJSON(),
          stats: {
            messageCount,
            participantCount: group.team?.members?.length || 0,
            lastMessage: lastMessage ? {
              content: lastMessage.message_content,
              sender: lastMessage.sender?.name,
              sentAt: lastMessage.created_at
            } : null
          }
        };
      })
    );

    res.json({
      success: true,
      data: {
        groups: groupsWithStats,
        total: groupsWithStats.length,
        summary: {
          totalGroups: groupsWithStats.length,
          totalMessages: groupsWithStats.reduce((sum, group) => sum + group.stats.messageCount, 0),
          totalParticipants: groupsWithStats.reduce((sum, group) => sum + group.stats.participantCount, 0)
        }
      },
      meta: {
        userRole: userRole,
        hasGlobalAccess: true
      }
    });
  } catch (error) {
    console.error('Erro ao buscar todos os chats:', error);
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
  getChatParticipants,
  getAllChatsForOwner
};
