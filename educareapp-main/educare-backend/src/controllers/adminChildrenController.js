const { Child, User, Profile, QuizSession } = require('../models');
const { Op } = require('sequelize');

/**
 * Controlador para gestão administrativa de crianças (versão simplificada)
 * Permite que admin/owner/profissionais visualizem e gerenciem crianças globalmente
 */
class AdminChildrenController {
  
  /**
   * Listar todas as crianças do sistema com filtros e paginação
   * Acesso: admin, owner, professional
   */
  async getAllChildren(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = ''
      } = req.query;

      // Configurar filtros base
      const whereClause = {};
      const includeClause = [
        {
          model: Profile,
          attributes: ['id', 'name', 'phone'],
          include: [{
            model: User,
            attributes: ['id', 'name', 'email']
          }]
        }
      ];

      // Filtro por busca (nome da criança)
      if (search) {
        whereClause.name = {
          [Op.iLike]: `%${search}%`
        };
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

      // Calcular progresso básico para cada criança
      const childrenWithProgress = await Promise.all(
        children.map(async (child) => {
          const quizSessions = await QuizSession.findAll({
            where: { child_id: child.id },
            attributes: ['score']
          });

          let progress = 0;
          if (quizSessions.length > 0) {
            // Cálculo simplificado baseado na média dos scores (assumindo score máximo de 100)
            const averageScore = quizSessions.reduce((sum, session) => sum + (session.score || 0), 0) / quizSessions.length;
            progress = Math.round(averageScore);
          }

          const childData = child.toJSON();
          return {
            id: childData.id,
            profile_id: childData.profileId,
            first_name: childData.firstName,
            last_name: childData.lastName,
            birth_date: childData.birthDate,
            gender: childData.gender,
            avatar_url: childData.avatarUrl,
            notes: childData.notes,
            special_needs: childData.specialNeeds,
            medical_info: childData.medicalInfo,
            educational_info: childData.educationalInfo,
            development_milestones: childData.developmentMilestones,
            is_active: childData.isActive,
            metadata: childData.metadata,
            created_at: childData.createdAt,
            updated_at: childData.updatedAt,
            progress,
            quiz_count: quizSessions.length,
            profile: childData.Profile
          };
        })
      );

      res.json({
        success: true,
        data: {
          children: childrenWithProgress,
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
   * Acesso: admin, owner
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

      // Estatísticas de quizzes
      const totalQuizSessions = await QuizSession.count();
      
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
          quizStats: {
            totalSessions: totalQuizSessions
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
   * Acesso: admin, owner, professional
   */
  async getChildDetails(req, res) {
    try {
      const { childId } = req.params;

      const child = await Child.findByPk(childId, {
        include: [
          {
            model: Profile,
            attributes: ['id', 'name', 'phone'],
            include: [{
              model: User,
              attributes: ['id', 'name', 'email']
            }]
          }
        ]
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

      const childData = child.toJSON();
      res.json({
        success: true,
        data: {
          id: childData.id,
          profile_id: childData.profileId,
          first_name: childData.firstName,
          last_name: childData.lastName,
          birth_date: childData.birthDate,
          gender: childData.gender,
          avatar_url: childData.avatarUrl,
          notes: childData.notes,
          special_needs: childData.specialNeeds,
          medical_info: childData.medicalInfo,
          educational_info: childData.educationalInfo,
          development_milestones: childData.developmentMilestones,
          is_active: childData.isActive,
          metadata: childData.metadata,
          created_at: childData.createdAt,
          updated_at: childData.updatedAt,
          progress,
          quiz_sessions: quizSessions,
          quiz_count: quizSessions.length,
          profile: childData.Profile
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
