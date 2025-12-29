const { 
  JourneyV2, 
  JourneyV2Week, 
  JourneyV2Topic, 
  JourneyV2Quiz,
  JourneyV2Badge,
  UserJourneyV2Progress,
  UserJourneyV2Badge
} = require('../models');

/**
 * Controller para a Jornada 2.0
 */
const journeyV2Controller = {
  /**
   * Obter todas as jornadas
   */
  getAllJourneys: async (req, res) => {
    try {
      const journeys = await JourneyV2.findAll({
        attributes: ['id', 'trail', 'title', 'description', 'icon', 'month']
      });
      
      return res.status(200).json(journeys);
    } catch (error) {
      console.error('Erro ao buscar jornadas:', error);
      return res.status(500).json({ error: 'Erro ao buscar jornadas' });
    }
  },
  
  /**
   * Obter uma jornada específica com suas semanas
   */
  getJourneyById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const journey = await JourneyV2.findByPk(id, {
        include: [
          {
            model: JourneyV2Week,
            as: 'weeks',
            attributes: ['id', 'week', 'title', 'description', 'icon', 'is_summary'],
            order: [['week', 'ASC']]
          }
        ]
      });
      
      if (!journey) {
        return res.status(404).json({ error: 'Jornada não encontrada' });
      }
      
      return res.status(200).json(journey);
    } catch (error) {
      console.error('Erro ao buscar jornada:', error);
      return res.status(500).json({ error: 'Erro ao buscar jornada' });
    }
  },
  
  /**
   * Obter todas as semanas de uma jornada
   */
  getJourneyWeeks: async (req, res) => {
    try {
      const { journeyId } = req.params;
      
      const weeks = await JourneyV2Week.findAll({
        where: { journey_id: journeyId },
        attributes: ['id', 'week', 'title', 'description', 'icon', 'is_summary'],
        order: [['week', 'ASC']]
      });
      
      return res.status(200).json(weeks);
    } catch (error) {
      console.error('Erro ao buscar semanas da jornada:', error);
      return res.status(500).json({ error: 'Erro ao buscar semanas da jornada' });
    }
  },
  
  /**
   * Obter uma semana específica com seus tópicos e quizzes
   */
  getWeekById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const week = await JourneyV2Week.findByPk(id, {
        include: [
          {
            model: JourneyV2Topic,
            as: 'topics',
            attributes: ['id', 'title', 'content', 'order_index'],
            order: [['order_index', 'ASC']]
          },
          {
            model: JourneyV2Quiz,
            as: 'quizzes',
            attributes: ['id', 'domain', 'domain_id', 'title', 'question', 'options', 'feedback', 'knowledge']
          },
          {
            model: JourneyV2Badge,
            as: 'badges',
            attributes: ['id', 'name', 'icon', 'description', 'type']
          }
        ]
      });
      
      if (!week) {
        return res.status(404).json({ error: 'Semana não encontrada' });
      }
      
      return res.status(200).json(week);
    } catch (error) {
      console.error('Erro ao buscar semana:', error);
      return res.status(500).json({ error: 'Erro ao buscar semana' });
    }
  },
  
  /**
   * Obter todos os tópicos de uma semana
   */
  getWeekTopics: async (req, res) => {
    try {
      const { weekId } = req.params;
      
      const topics = await JourneyV2Topic.findAll({
        where: { week_id: weekId },
        attributes: ['id', 'title', 'content', 'order_index'],
        order: [['order_index', 'ASC']]
      });
      
      return res.status(200).json(topics);
    } catch (error) {
      console.error('Erro ao buscar tópicos da semana:', error);
      return res.status(500).json({ error: 'Erro ao buscar tópicos da semana' });
    }
  },
  
  /**
   * Obter todos os quizzes de uma semana
   */
  getWeekQuizzes: async (req, res) => {
    try {
      const { weekId } = req.params;
      
      const quizzes = await JourneyV2Quiz.findAll({
        where: { week_id: weekId },
        attributes: ['id', 'domain', 'domain_id', 'title', 'question', 'options', 'feedback', 'knowledge']
      });
      
      return res.status(200).json(quizzes);
    } catch (error) {
      console.error('Erro ao buscar quizzes da semana:', error);
      return res.status(500).json({ error: 'Erro ao buscar quizzes da semana' });
    }
  },
  
  /**
   * Obter o progresso de um usuário em uma jornada
   */
  getUserJourneyProgress: async (req, res) => {
    try {
      const { userId, journeyId } = req.params;
      
      const progress = await UserJourneyV2Progress.findAll({
        where: { 
          user_id: userId,
          journey_id: journeyId
        },
        include: [
          {
            model: JourneyV2Week,
            as: 'week',
            attributes: ['id', 'week', 'title']
          }
        ]
      });
      
      return res.status(200).json(progress);
    } catch (error) {
      console.error('Erro ao buscar progresso do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar progresso do usuário' });
    }
  },
  
  /**
   * Atualizar o progresso de um usuário em uma semana
   */
  updateUserWeekProgress: async (req, res) => {
    try {
      const { userId, weekId } = req.params;
      const { childId, completedTopics, completedQuizzes, progress, completed } = req.body;
      
      // Buscar a semana para obter o journey_id
      const week = await JourneyV2Week.findByPk(weekId);
      if (!week) {
        return res.status(404).json({ error: 'Semana não encontrada' });
      }
      
      // Buscar ou criar o registro de progresso
      let userProgress = await UserJourneyV2Progress.findOne({
        where: {
          user_id: userId,
          child_id: childId,
          week_id: weekId
        }
      });
      
      if (userProgress) {
        // Atualizar registro existente
        await userProgress.update({
          completed_topics: completedTopics || userProgress.completed_topics,
          completed_quizzes: completedQuizzes || userProgress.completed_quizzes,
          progress: progress !== undefined ? progress : userProgress.progress,
          completed_at: completed ? new Date() : userProgress.completed_at
        });
      } else {
        // Criar novo registro
        userProgress = await UserJourneyV2Progress.create({
          user_id: userId,
          child_id: childId,
          journey_id: week.journey_id,
          week_id: weekId,
          completed_topics: completedTopics || [],
          completed_quizzes: completedQuizzes || [],
          progress: progress || 0,
          completed_at: completed ? new Date() : null
        });
      }
      
      return res.status(200).json(userProgress);
    } catch (error) {
      console.error('Erro ao atualizar progresso do usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar progresso do usuário' });
    }
  },
  
  /**
   * Conceder uma badge para um usuário
   */
  awardUserBadge: async (req, res) => {
    try {
      const { userId } = req.params;
      const { childId, badgeId } = req.body;
      
      // Verificar se a badge existe
      const badge = await JourneyV2Badge.findByPk(badgeId);
      if (!badge) {
        return res.status(404).json({ error: 'Badge não encontrada' });
      }
      
      // Verificar se o usuário já possui a badge
      const existingBadge = await UserJourneyV2Badge.findOne({
        where: {
          user_id: userId,
          child_id: childId,
          badge_id: badgeId
        }
      });
      
      if (existingBadge) {
        return res.status(200).json(existingBadge);
      }
      
      // Conceder a badge
      const userBadge = await UserJourneyV2Badge.create({
        user_id: userId,
        child_id: childId,
        badge_id: badgeId
      });
      
      return res.status(201).json(userBadge);
    } catch (error) {
      console.error('Erro ao conceder badge ao usuário:', error);
      return res.status(500).json({ error: 'Erro ao conceder badge ao usuário' });
    }
  },
  
  /**
   * Obter todas as badges de um usuário
   */
  getUserBadges: async (req, res) => {
    try {
      const { userId } = req.params;
      const { childId } = req.query;
      
      const whereClause = { user_id: userId };
      if (childId) {
        whereClause.child_id = childId;
      }
      
      const badges = await UserJourneyV2Badge.findAll({
        where: whereClause,
        include: [
          {
            model: JourneyV2Badge,
            as: 'badge',
            attributes: ['id', 'name', 'icon', 'description', 'type']
          }
        ]
      });
      
      return res.status(200).json(badges);
    } catch (error) {
      console.error('Erro ao buscar badges do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar badges do usuário' });
    }
  },

  // ==================== ADMIN CRUD ENDPOINTS ====================

  /**
   * [ADMIN] Listar todos os quizzes com filtros e paginação
   */
  adminListQuizzes: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        domain,
        week_id,
        search 
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (domain) where.domain = domain;
      if (week_id) where.week_id = week_id;
      if (search) {
        const { Op } = require('sequelize');
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { question: { [Op.iLike]: `%${search}%` } },
          { domain: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await JourneyV2Quiz.findAndCountAll({
        where,
        include: [
          {
            model: JourneyV2Week,
            as: 'week',
            attributes: ['id', 'week', 'title', 'journey_id'],
            include: [
              {
                model: JourneyV2,
                as: 'journey',
                attributes: ['id', 'trail', 'title', 'month']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      return res.status(200).json({
        success: true,
        data: rows,
        meta: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar quizzes:', error);
      return res.status(500).json({ success: false, error: 'Erro ao listar quizzes' });
    }
  },

  /**
   * [ADMIN] Obter quiz por ID
   */
  adminGetQuiz: async (req, res) => {
    try {
      const { id } = req.params;
      
      const quiz = await JourneyV2Quiz.findByPk(id, {
        include: [
          {
            model: JourneyV2Week,
            as: 'week',
            attributes: ['id', 'week', 'title', 'journey_id'],
            include: [
              {
                model: JourneyV2,
                as: 'journey',
                attributes: ['id', 'trail', 'title', 'month']
              }
            ]
          }
        ]
      });
      
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz não encontrado' });
      }

      return res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao buscar quiz:', error);
      return res.status(500).json({ success: false, error: 'Erro ao buscar quiz' });
    }
  },

  /**
   * [ADMIN] Criar novo quiz
   */
  adminCreateQuiz: async (req, res) => {
    try {
      const { 
        week_id, 
        domain, 
        domain_id, 
        title, 
        question, 
        options, 
        feedback, 
        knowledge 
      } = req.body;

      // Validação de campos obrigatórios
      if (!week_id || !domain || !domain_id || !title || !question) {
        return res.status(400).json({ 
          success: false, 
          error: 'Campos obrigatórios: week_id, domain, domain_id, title, question' 
        });
      }

      // Verificar se a semana existe
      const week = await JourneyV2Week.findByPk(week_id);
      if (!week) {
        return res.status(404).json({ success: false, error: 'Semana não encontrada' });
      }

      const quiz = await JourneyV2Quiz.create({
        week_id,
        domain,
        domain_id,
        title,
        question,
        options: options || {},
        feedback: feedback || {},
        knowledge: knowledge || {}
      });

      return res.status(201).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      return res.status(500).json({ success: false, error: 'Erro ao criar quiz' });
    }
  },

  /**
   * [ADMIN] Atualizar quiz
   */
  adminUpdateQuiz: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const quiz = await JourneyV2Quiz.findByPk(id);
      
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz não encontrado' });
      }

      // Se week_id foi fornecido, verificar se existe
      if (updateData.week_id) {
        const week = await JourneyV2Week.findByPk(updateData.week_id);
        if (!week) {
          return res.status(404).json({ success: false, error: 'Semana não encontrada' });
        }
      }

      await quiz.update(updateData);

      return res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      return res.status(500).json({ success: false, error: 'Erro ao atualizar quiz' });
    }
  },

  /**
   * [ADMIN] Excluir quiz
   */
  adminDeleteQuiz: async (req, res) => {
    try {
      const { id } = req.params;

      const quiz = await JourneyV2Quiz.findByPk(id);
      
      if (!quiz) {
        return res.status(404).json({ success: false, error: 'Quiz não encontrado' });
      }

      await quiz.destroy();

      return res.status(200).json({ success: true, message: 'Quiz excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir quiz:', error);
      return res.status(500).json({ success: false, error: 'Erro ao excluir quiz' });
    }
  },

  /**
   * [ADMIN] Obter estatísticas dos quizzes
   */
  adminGetQuizStatistics: async (req, res) => {
    try {
      const totalQuizzes = await JourneyV2Quiz.count();
      
      const quizzesByDomain = await JourneyV2Quiz.findAll({
        attributes: [
          'domain',
          [JourneyV2Quiz.sequelize.fn('COUNT', JourneyV2Quiz.sequelize.col('id')), 'count']
        ],
        group: ['domain'],
        raw: true
      });

      const quizzesByWeek = await JourneyV2Quiz.findAll({
        attributes: [
          'week_id',
          [JourneyV2Quiz.sequelize.fn('COUNT', JourneyV2Quiz.sequelize.col('id')), 'count']
        ],
        group: ['week_id'],
        raw: true
      });

      return res.status(200).json({
        success: true,
        data: {
          total: totalQuizzes,
          byDomain: quizzesByDomain.map(item => ({
            domain: item.domain,
            count: parseInt(item.count)
          })),
          byWeek: quizzesByWeek.length
        }
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return res.status(500).json({ success: false, error: 'Erro ao obter estatísticas' });
    }
  },

  /**
   * [ADMIN] Listar todas as jornadas (para seletores)
   */
  adminListJourneys: async (req, res) => {
    try {
      const journeys = await JourneyV2.findAll({
        attributes: ['id', 'trail', 'title', 'description', 'month'],
        order: [['month', 'ASC'], ['title', 'ASC']]
      });
      
      return res.status(200).json({ success: true, data: journeys });
    } catch (error) {
      console.error('Erro ao listar jornadas:', error);
      return res.status(500).json({ success: false, error: 'Erro ao listar jornadas' });
    }
  },

  /**
   * [ADMIN] Listar todas as semanas (para seletores)
   */
  adminListWeeks: async (req, res) => {
    try {
      const { journey_id } = req.query;
      const where = {};
      
      if (journey_id) {
        where.journey_id = journey_id;
      }

      const weeks = await JourneyV2Week.findAll({
        where,
        attributes: ['id', 'journey_id', 'week', 'title', 'description'],
        include: [
          {
            model: JourneyV2,
            as: 'journey',
            attributes: ['id', 'trail', 'title', 'month']
          }
        ],
        order: [['week', 'ASC']]
      });
      
      return res.status(200).json({ success: true, data: weeks });
    } catch (error) {
      console.error('Erro ao listar semanas:', error);
      return res.status(500).json({ success: false, error: 'Erro ao listar semanas' });
    }
  },

  /**
   * [ADMIN] Importar quizzes via CSV
   */
  adminImportQuizzes: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Arquivo CSV é obrigatório' });
      }

      const csv = require('csv-parser');
      const fs = require('fs');
      const results = [];
      const errors = [];
      let lineNumber = 1;

      return new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => {
            lineNumber++;
            try {
              if (!data.week_id || !data.domain || !data.domain_id || !data.title || !data.question) {
                errors.push({
                  line: lineNumber,
                  error: 'Campos obrigatórios: week_id, domain, domain_id, title, question'
                });
                return;
              }

              // Parse JSONB fields
              let options = {};
              let feedback = {};
              let knowledge = {};

              try {
                if (data.options) options = JSON.parse(data.options);
                if (data.feedback) feedback = JSON.parse(data.feedback);
                if (data.knowledge) knowledge = JSON.parse(data.knowledge);
              } catch (e) {
                errors.push({ line: lineNumber, error: 'Erro ao parsear campos JSONB' });
                return;
              }

              results.push({
                week_id: data.week_id,
                domain: data.domain,
                domain_id: data.domain_id,
                title: data.title,
                question: data.question,
                options,
                feedback,
                knowledge
              });
            } catch (error) {
              errors.push({ line: lineNumber, error: error.message });
            }
          })
          .on('end', async () => {
            try {
              if (results.length > 0) {
                await JourneyV2Quiz.bulkCreate(results);
              }

              fs.unlinkSync(req.file.path);

              res.status(200).json({
                success: true,
                message: `${results.length} quizzes importados com sucesso`,
                imported: results.length,
                errors: errors.length,
                errorDetails: errors
              });
            } catch (error) {
              console.error('Erro ao importar quizzes:', error);
              res.status(500).json({ success: false, error: 'Erro ao importar quizzes' });
            }
          });
      });
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      return res.status(500).json({ success: false, error: 'Erro ao processar arquivo CSV' });
    }
  },

  /**
   * [ADMIN] Exportar quizzes para CSV
   */
  adminExportQuizzes: async (req, res) => {
    try {
      const quizzes = await JourneyV2Quiz.findAll({
        include: [
          {
            model: JourneyV2Week,
            as: 'week',
            attributes: ['id', 'week', 'title', 'journey_id']
          }
        ],
        order: [['created_at', 'ASC']]
      });

      const csvData = quizzes.map(q => ({
        id: q.id,
        week_id: q.week_id,
        week_number: q.week?.week || '',
        week_title: q.week?.title || '',
        domain: q.domain,
        domain_id: q.domain_id,
        title: q.title,
        question: q.question,
        options: JSON.stringify(q.options),
        feedback: JSON.stringify(q.feedback),
        knowledge: JSON.stringify(q.knowledge),
        created_at: q.created_at,
        updated_at: q.updated_at
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=journey_v2_quizzes.csv');
      
      const headers = Object.keys(csvData[0] || {}).join(',');
      let csvContent = headers + '\n';
      
      csvData.forEach(row => {
        const values = Object.values(row).map(val => {
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        csvContent += values.join(',') + '\n';
      });

      return res.send(csvContent);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      return res.status(500).json({ success: false, error: 'Erro ao exportar CSV' });
    }
  }
};

module.exports = journeyV2Controller;
