const { TeamMember, User, Profile, Team } = require('../models');
const { Op } = require('sequelize');

// Listar convites de equipe recebidos pelo profissional
const getReceivedTeamInvites = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    console.log('🔍 DEBUG TeamInviteController.getReceivedTeamInvites - userId:', userId);

    // Buscar convites de equipe recebidos pelo usuário
    const { count, rows: invites } = await TeamMember.findAndCountAll({
      where: {
        user_id: userId,
        status: {
          [Op.in]: ['invited', 'active']
        }
      },
      include: [
        {
          model: User,
          as: 'inviter',
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
          attributes: ['id', 'name', 'description', 'type']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    console.log('🔍 DEBUG TeamInviteController.getReceivedTeamInvites - found invites:', invites.length);

    // Formatar dados para o frontend
    const formattedInvites = invites.map(invite => ({
      id: invite.id,
      team_id: invite.team_id,
      team_name: invite.team?.name || 'Equipe sem nome',
      team_description: invite.team?.description || '',
      team_type: invite.team?.type || 'mixed',
      invited_by_id: invite.invited_by,
      invited_by_name: invite.inviter?.name || invite.inviter?.profile?.name || 'Usuário desconhecido',
      role: invite.role,
      status: invite.status,
      invited_at: invite.invited_at,
      joined_at: invite.joined_at,
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
    console.error('❌ Erro ao buscar convites de equipe recebidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao buscar convites de equipe'
    });
  }
};

// Aceitar convite de equipe
const acceptTeamInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    console.log('🔍 DEBUG TeamInviteController.acceptTeamInvite - inviteId:', inviteId, 'userId:', userId);

    // Buscar o convite
    const invite = await TeamMember.findOne({
      where: {
        id: inviteId,
        user_id: userId,
        status: 'invited'
      },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'description', 'type']
        }
      ]
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Convite não encontrado ou já processado'
      });
    }

    // Atualizar status do convite para 'active' e definir joined_at
    await invite.update({
      status: 'active',
      joined_at: new Date()
    });

    console.log('✅ DEBUG TeamInviteController.acceptTeamInvite - convite aceito:', invite.id);

    res.json({
      success: true,
      data: {
        id: invite.id,
        team_id: invite.team_id,
        team_name: invite.team?.name || 'Equipe sem nome',
        status: 'active',
        message: 'Convite aceito com sucesso!'
      },
      message: 'Convite aceito com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao aceitar convite de equipe:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao aceitar convite de equipe'
    });
  }
};

// Recusar convite de equipe
const declineTeamInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    console.log('🔍 DEBUG TeamInviteController.declineTeamInvite - inviteId:', inviteId, 'userId:', userId);

    // Buscar o convite
    const invite = await TeamMember.findOne({
      where: {
        id: inviteId,
        user_id: userId,
        status: 'invited'
      }
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        error: 'Convite não encontrado ou já processado'
      });
    }

    // Remover o membro da equipe (recusar convite)
    await invite.destroy();

    console.log('✅ DEBUG TeamInviteController.declineTeamInvite - convite recusado:', invite.id);

    res.json({
      success: true,
      message: 'Convite recusado com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao recusar convite de equipe:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao recusar convite de equipe'
    });
  }
};

// Contar convites de equipe pendentes
const getPendingTeamInvitesCount = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🔍 DEBUG TeamInviteController.getPendingTeamInvitesCount - userId:', userId);

    const count = await TeamMember.count({
      where: {
        user_id: userId,
        status: 'invited'
      }
    });

    console.log('🔍 DEBUG TeamInviteController.getPendingTeamInvitesCount - count:', count);

    res.json({
      success: true,
      data: {
        count: count
      }
    });
  } catch (error) {
    console.error('❌ Erro ao contar convites de equipe pendentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao contar convites de equipe'
    });
  }
};

module.exports = {
  getReceivedTeamInvites,
  acceptTeamInvite,
  declineTeamInvite,
  getPendingTeamInvitesCount
};
