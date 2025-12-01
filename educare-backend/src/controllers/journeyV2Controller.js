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
  }
};

module.exports = journeyV2Controller;
