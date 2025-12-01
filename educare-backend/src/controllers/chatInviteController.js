const { ChatInvite, User, Profile, Team } = require('../models');
const { Op } = require('sequelize');

// Listar convites recebidos pelo profissional
const getReceivedInvites = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    console.log('🔍 DEBUG ChatInviteController.getReceivedInvites - userId:', userId);

    // Buscar convites recebidos pelo usuário
    const { count, rows: invites } = await ChatInvite.findAndCountAll({
      where: {
        invited_user_id: userId,
        status: {
          [Op.in]: ['pending', 'accepted', 'declined']
        }
      },
      include: [
        {
          model: User,
          as: 'invitedBy',
          attributes: ['id', 'name', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['name', 'type']
          }]
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    console.log('🔍 DEBUG ChatInviteController.getReceivedInvites - found invites:', invites.length);

    // Formatar dados para o frontend
    const formattedInvites = invites.map(invite => ({
      id: invite.id,
      team_id: invite.team_id,
      team_name: invite.team?.name || 'Equipe sem nome',
      invited_by_id: invite.invited_by_id,
      invited_by_name: invite.invitedBy?.name || invite.invitedBy?.profile?.name || 'Usuário desconhecido',
      message: invite.message,
      status: invite.status,
      created_at: invite.created_at,
      updated_at: invite.updated_at
    }));

    res.json({
      success: true,
      data: {
        invites: formattedInvites,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar convites recebidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao buscar convites'
    });
  }
};

// Aceitar convite de chat/equipe
const acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    console.log('🔍 DEBUG ChatInviteController.acceptInvite - inviteId:', inviteId, 'userId:', userId);

    // Buscar o convite
    const invite = await ChatInvite.findOne({
      where: {
        id: inviteId,
        invited_user_id: userId,
        status: 'pending'
      },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Convite não encontrado ou já processado'
      });
    }

    // Atualizar status do convite
    await invite.update({
      status: 'accepted',
      responded_at: new Date()
    });

    console.log('✅ DEBUG ChatInviteController.acceptInvite - convite aceito:', invite.id);

    res.json({
      success: true,
      data: {
        id: invite.id,
        team_id: invite.team_id,
        team_name: invite.team?.name || 'Equipe sem nome',
        status: 'accepted',
        message: 'Convite aceito com sucesso!'
      },
      message: 'Convite aceito com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao aceitar convite:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao aceitar convite'
    });
  }
};

// Recusar convite de chat/equipe
const declineInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    console.log('🔍 DEBUG ChatInviteController.declineInvite - inviteId:', inviteId, 'userId:', userId);

    // Buscar o convite
    const invite = await ChatInvite.findOne({
      where: {
        id: inviteId,
        invited_user_id: userId,
        status: 'pending'
      }
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Convite não encontrado ou já processado'
      });
    }

    // Atualizar status do convite
    await invite.update({
      status: 'declined',
      responded_at: new Date()
    });

    console.log('✅ DEBUG ChatInviteController.declineInvite - convite recusado:', invite.id);

    res.json({
      success: true,
      message: 'Convite recusado com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao recusar convite:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao recusar convite'
    });
  }
};

// Contar convites pendentes
const getPendingInvitesCount = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🔍 DEBUG ChatInviteController.getPendingInvitesCount - userId:', userId);

    const count = await ChatInvite.count({
      where: {
        invited_user_id: userId,
        status: 'pending'
      }
    });

    console.log('🔍 DEBUG ChatInviteController.getPendingInvitesCount - count:', count);

    res.json({
      success: true,
      data: {
        count: count
      }
    });
  } catch (error) {
    console.error('❌ Erro ao contar convites pendentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao contar convites'
    });
  }
};

module.exports = {
  getReceivedInvites,
  acceptInvite,
  declineInvite,
  getPendingInvitesCount
};
