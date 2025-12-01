const { Child, User, Profile, Team, TeamMember, QuizSession } = require('../models');
const { Op } = require('sequelize');

/**
 * Controlador para gestão administrativa de crianças
 * Permite que admin/owner/profissionais visualizem e gerenciem crianças globalmente
 */
class AdminChildrenController {
  
  /**
   * Listar todas as crianças do sistema com filtros e paginação
   * Acesso: admin, owner, professional (limitado aos seus grupos)
   */
  async getAllChildren(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        ageGroup = '',
        hasTeam = '',
        progressRange = '',
        professionalId = ''
      } = req.query;

      const userRole = req.user.role;
      const userId = req.user.id;

      // Configurar filtros base
      const whereClause = {};
      const includeClause = [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'name', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone']
          }]
        },
        {
          model: Team,
          as: 'teams',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
          include: [{
            model: TeamMember,
            as: 'members',
            attributes: ['user_id', 'role'],
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          }]
        }
      ];

      // Filtro por busca (nome da criança)
      if (search) {
        whereClause.name = {
          [Op.iLike]: `%${search}%`
        };
      }

      // Filtro por faixa etária
      if (ageGroup) {
        const now = new Date();
        let startDate, endDate;
        
        switch (ageGroup) {
          case '0-12m':
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            endDate = now;
            break;
          case '13-24m':
            startDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
          case '25-36m':
            startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
            break;
          case '3-5y':
            startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
            break;
        }
        
        if (startDate && endDate) {
          whereClause.birth_date = {
            [Op.between]: [startDate, endDate]
          };
        }
      }

      // Restrições por role
      if (userRole === 'professional') {
        // Profissionais só veem crianças dos grupos que participam
        includeClause[1].include[0].where = {
          user_id: userId
        };
        includeClause[1].required = true;
      }

      // Filtro por participação em equipes
      if (hasTeam === 'true') {
        includeClause[1].required = true;
      } else if (hasTeam === 'false') {
        includeClause[1].required = false;
        includeClause[1].where = {
          id: null
        };
      }

      // Filtro por profissional específico (apenas para admin/owner)
      if (professionalId && (userRole === 'admin' || userRole === 'owner')) {
        includeClause[1].include[0].where = {
          user_id: professionalId
        };
        includeClause[1].required = true;
      }

      const offset = (page - 1) * limit;

      const { count, rows: children } = await Child.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        distinct: true
      });

      // Calcular progresso para cada criança
      const childrenWithProgress = await Promise.all(
        children.map(async (child) => {
          const quizSessions = await QuizSession.findAll({
            where: { child_id: child.id },
            attributes: ['score', 'max_score']
          });

          let progress = 0;
          if (quizSessions.length > 0) {
            const totalScore = quizSessions.reduce((sum, session) => sum + (session.score || 0), 0);
            const totalMaxScore = quizSessions.reduce((sum, session) => sum + (session.max_score || 0), 0);
            progress = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
          }

          return {
            ...child.toJSON(),
            progress,
            quizCount: quizSessions.length
          };
        })
      );

      // Filtro por faixa de progresso
      let filteredChildren = childrenWithProgress;
      if (progressRange) {
        const [min, max] = progressRange.split('-').map(Number);
        filteredChildren = childrenWithProgress.filter(child => 
          child.progress >= min && child.progress <= max
        );
      }

      res.json({
        success: true,
        data: {
          children: filteredChildren,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erro ao buscar crianças globalmente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Obter estatísticas globais do sistema
   * Acesso: admin, owner (profissionais não têm acesso)
   */
  async getGlobalStats(req, res) {
    try {
      const userRole = req.user.role;

      // Apenas admin e owner podem ver estatísticas globais
      if (userRole !== 'admin' && userRole !== 'owner') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Apenas administradores podem visualizar estatísticas globais.'
        });
      }

      // Total de crianças
      const totalChildren = await Child.count();

      // Crianças por faixa etária
      const now = new Date();
      const ageGroups = {
        '0-12m': await Child.count({
          where: {
            birth_date: {
              [Op.between]: [
                new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
                now
              ]
            }
          }
        }),
        '13-24m': await Child.count({
          where: {
            birth_date: {
              [Op.between]: [
                new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()),
                new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
              ]
            }
          }
        }),
        '25-36m': await Child.count({
          where: {
            birth_date: {
              [Op.between]: [
                new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()),
                new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
              ]
            }
          }
        }),
        '3-5y': await Child.count({
          where: {
            birth_date: {
              [Op.between]: [
                new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
                new Date(now.getFullYear() - 3, now.getMonth(), now.getDate())
              ]
            }
          }
        })
      };

      // Crianças em equipes vs sem equipes
      const childrenInTeams = await Child.count({
        include: [{
          model: Team,
          as: 'teams',
          required: true
        }],
        distinct: true
      });

      const childrenWithoutTeams = totalChildren - childrenInTeams;

      // Estatísticas de quizzes
      const totalQuizSessions = await QuizSession.count();
      const avgQuizScore = await QuizSession.findOne({
        attributes: [
          [require('sequelize').fn('AVG', require('sequelize').col('score')), 'avgScore']
        ]
      });

      // Crianças cadastradas nos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentChildren = await Child.count({
        where: {
          created_at: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      });

      res.json({
        success: true,
        data: {
          totalChildren,
          ageGroups,
          teamParticipation: {
            inTeams: childrenInTeams,
            withoutTeams: childrenWithoutTeams
          },
          quizStats: {
            totalSessions: totalQuizSessions,
            averageScore: Math.round(avgQuizScore?.dataValues?.avgScore || 0)
          },
          recentGrowth: {
            last30Days: recentChildren
          }
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas globais:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * Obter detalhes de uma criança específica
   * Acesso: admin, owner, professional (se faz parte do grupo da criança)
   */
  async getChildDetails(req, res) {
    try {
      const { childId } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;

      const includeClause = [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'name', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone']
          }]
        },
        {
          model: Team,
          as: 'teams',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
          include: [{
            model: TeamMember,
            as: 'members',
            attributes: ['user_id', 'role'],
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }]
          }]
        }
      ];

      // Restrições por role
      if (userRole === 'professional') {
        includeClause[1].include[0].where = {
          user_id: userId
        };
        includeClause[1].required = true;
      }

      const child = await Child.findByPk(childId, {
        include: includeClause
      });

      if (!child) {
        return res.status(404).json({
          success: false,
          message: 'Criança não encontrada'
        });
      }

      // Buscar sessões de quiz da criança
      const quizSessions = await QuizSession.findAll({
        where: { child_id: childId },
        attributes: ['id', 'score', 'max_score', 'completed_at', 'created_at'],
        order: [['created_at', 'DESC']]
      });

      // Calcular progresso
      let progress = 0;
      if (quizSessions.length > 0) {
        const totalScore = quizSessions.reduce((sum, session) => sum + (session.score || 0), 0);
        const totalMaxScore = quizSessions.reduce((sum, session) => sum + (session.max_score || 0), 0);
        progress = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
      }

      res.json({
        success: true,
        data: {
          ...child.toJSON(),
          progress,
          quizSessions,
          quizCount: quizSessions.length
        }
      });

    } catch (error) {
      console.error('Erro ao buscar detalhes da criança:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = new AdminChildrenController();
