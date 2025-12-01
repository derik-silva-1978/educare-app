const { TeamMember, Team, Child, User, Profile } = require('../models');
const { Op } = require('sequelize');

const professionalInvitationController = {
  // Aceitar convite para acompanhar uma criança
  async acceptInvitation(req, res) {
    try {
      const { inviteId } = req.params;
      const professionalId = req.user.id;

      console.log('Aceitando convite:', { inviteId, professionalId });

      // Buscar o convite pendente
      const invitation = await TeamMember.findOne({
        where: {
          id: inviteId,
          user_id: professionalId,
          status: 'pending'
        },
        include: [
          {
            model: Team,
            include: [
              {
                model: Child,
                include: [
                  {
                    model: Profile,
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: 'Convite não encontrado ou já processado'
        });
      }

      // Atualizar status do convite para 'approved'
      await invitation.update({
        status: 'approved',
        updated_at: new Date()
      });

      console.log('Convite aceito com sucesso:', invitation.id);

      res.json({
        success: true,
        message: 'Convite aceito com sucesso',
        data: {
          invitationId: invitation.id,
          teamId: invitation.team_id,
          childName: invitation.Team?.Child?.Profile?.name || 'Criança'
        }
      });

    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Recusar convite para acompanhar uma criança
  async rejectInvitation(req, res) {
    try {
      const { inviteId } = req.params;
      const professionalId = req.user.id;

      console.log('Recusando convite:', { inviteId, professionalId });

      // Buscar o convite pendente
      const invitation = await TeamMember.findOne({
        where: {
          id: inviteId,
          user_id: professionalId,
          status: 'pending'
        },
        include: [
          {
            model: Team,
            include: [
              {
                model: Child,
                include: [
                  {
                    model: Profile,
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: 'Convite não encontrado ou já processado'
        });
      }

      // Atualizar status do convite para 'rejected'
      await invitation.update({
        status: 'rejected',
        updated_at: new Date()
      });

      console.log('Convite recusado com sucesso:', invitation.id);

      res.json({
        success: true,
        message: 'Convite recusado com sucesso',
        data: {
          invitationId: invitation.id,
          teamId: invitation.team_id,
          childName: invitation.Team?.Child?.Profile?.name || 'Criança'
        }
      });

    } catch (error) {
      console.error('Erro ao recusar convite:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Listar convites pendentes do profissional
  async getPendingInvitations(req, res) {
    try {
      const professionalId = req.user.id;

      console.log('Buscando convites pendentes para profissional:', professionalId);

      const pendingInvitations = await TeamMember.findAll({
        where: {
          user_id: professionalId,
          status: 'pending'
        },
        include: [
          {
            model: Team,
            include: [
              {
                model: Child,
                include: [
                  {
                    model: Profile,
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      const formattedInvitations = pendingInvitations.map(invitation => ({
        id: invitation.id,
        childId: invitation.Team?.child_id,
        childName: invitation.Team?.Child?.Profile?.name || 'Criança',
        status: invitation.status,
        createdAt: invitation.created_at,
        teamId: invitation.team_id
      }));

      console.log(`Encontrados ${formattedInvitations.length} convites pendentes`);

      res.json({
        success: true,
        data: formattedInvitations
      });

    } catch (error) {
      console.error('Erro ao buscar convites pendentes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = professionalInvitationController;
