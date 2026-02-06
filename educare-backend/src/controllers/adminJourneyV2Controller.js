const {
  JourneyV2,
  JourneyV2Week,
  JourneyV2Topic,
  JourneyV2Quiz,
  JourneyV2Badge,
  UserJourneyV2Progress,
  UserJourneyV2Badge,
  sequelize
} = require('../models');
const { Op } = require('sequelize');
const {
  classifyQuiz,
  classifyTopic,
  computeQuizHash,
  computeTopicHash,
  checkDuplicateQuiz,
  checkDuplicateTopic
} = require('../services/domainClassifierService');

const adminJourneyV2Controller = {
  getStatistics: async (req, res) => {
    try {
      const journeyCount = await JourneyV2.count();
      const weekCount = await JourneyV2Week.count();
      const topicCount = await JourneyV2Topic.count();
      const quizCount = await JourneyV2Quiz.count();
      const badgeCount = await JourneyV2Badge.count();

      const byTrail = await JourneyV2.findAll({
        attributes: ['trail', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['trail'],
        raw: true
      });

      const topicsByTrail = await sequelize.query(`
        SELECT j.trail, COUNT(t.id) as count
        FROM journey_v2 j
        JOIN journey_v2_weeks w ON w.journey_id = j.id
        JOIN journey_v2_topics t ON t.week_id = w.id
        GROUP BY j.trail
      `, { type: sequelize.QueryTypes.SELECT });

      const quizzesByDomain = await JourneyV2Quiz.findAll({
        attributes: ['domain', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['domain'],
        raw: true
      });

      const weeksByMonth = await sequelize.query(`
        SELECT j.trail, j.month, COUNT(w.id) as weeks,
          (SELECT COUNT(*) FROM journey_v2_topics t2 WHERE t2.week_id IN (SELECT w2.id FROM journey_v2_weeks w2 WHERE w2.journey_id = j.id)) as topics,
          (SELECT COUNT(*) FROM journey_v2_quizzes q2 WHERE q2.week_id IN (SELECT w3.id FROM journey_v2_weeks w3 WHERE w3.journey_id = j.id)) as quizzes
        FROM journey_v2 j
        JOIN journey_v2_weeks w ON w.journey_id = j.id
        GROUP BY j.id, j.trail, j.month
        ORDER BY j.trail, j.month
      `, { type: sequelize.QueryTypes.SELECT });

      return res.json({
        success: true,
        data: {
          totals: { journeys: journeyCount, weeks: weekCount, topics: topicCount, quizzes: quizCount, badges: badgeCount },
          byTrail,
          topicsByTrail,
          quizzesByDomain,
          weeksByMonth
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas V2:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  },

  listContent: async (req, res) => {
    try {
      const { trail, month, week, type, search, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { dev_domain } = req.query;

      if (type === 'quiz') {
        const whereQuiz = {};
        if (search) {
          whereQuiz[Op.or] = [
            { title: { [Op.iLike]: `%${search}%` } },
            { question: { [Op.iLike]: `%${search}%` } },
            { domain_id: { [Op.iLike]: `%${search}%` } }
          ];
        }
        if (dev_domain === 'unclassified') {
          whereQuiz.dev_domain = null;
        } else if (dev_domain) {
          whereQuiz.dev_domain = dev_domain;
        }

        const weekWhere = {};
        if (week) weekWhere.week = parseInt(week);

        const journeyWhere = {};
        if (trail) journeyWhere.trail = trail;
        if (month) journeyWhere.month = parseInt(month);

        const { count, rows } = await JourneyV2Quiz.findAndCountAll({
          where: whereQuiz,
          include: [{
            model: JourneyV2Week,
            as: 'week',
            attributes: ['id', 'week', 'title', 'is_summary'],
            where: Object.keys(weekWhere).length > 0 ? weekWhere : undefined,
            include: [{
              model: JourneyV2,
              as: 'journey',
              attributes: ['id', 'trail', 'month', 'title'],
              where: Object.keys(journeyWhere).length > 0 ? journeyWhere : undefined
            }]
          }],
          order: [[{ model: JourneyV2Week, as: 'week' }, 'week', 'ASC'], ['domain', 'ASC']],
          limit: parseInt(limit),
          offset
        });

        return res.json({
          success: true,
          data: rows,
          meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
        });
      }

      const whereTopic = {};
      if (search) {
        whereTopic[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } }
        ];
      }
      if (dev_domain === 'unclassified') {
        whereTopic.dev_domain = null;
      } else if (dev_domain) {
        whereTopic.dev_domain = dev_domain;
      }

      const weekWhere = {};
      if (week) weekWhere.week = parseInt(week);

      const journeyWhere = {};
      if (trail) journeyWhere.trail = trail;
      if (month) journeyWhere.month = parseInt(month);

      const { count, rows } = await JourneyV2Topic.findAndCountAll({
        where: whereTopic,
        include: [{
          model: JourneyV2Week,
          as: 'week',
          attributes: ['id', 'week', 'title', 'is_summary'],
          where: Object.keys(weekWhere).length > 0 ? weekWhere : undefined,
          include: [{
            model: JourneyV2,
            as: 'journey',
            attributes: ['id', 'trail', 'month', 'title'],
            where: Object.keys(journeyWhere).length > 0 ? journeyWhere : undefined
          }]
        }],
        order: [[{ model: JourneyV2Week, as: 'week' }, 'week', 'ASC'], ['order_index', 'ASC']],
        limit: parseInt(limit),
        offset
      });

      return res.json({
        success: true,
        data: rows,
        meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
      });
    } catch (error) {
      console.error('Erro ao listar conteúdo V2:', error);
      return res.status(500).json({ error: 'Erro ao listar conteúdo' });
    }
  },

  getTopic: async (req, res) => {
    try {
      const topic = await JourneyV2Topic.findByPk(req.params.id, {
        include: [{
          model: JourneyV2Week,
          as: 'week',
          attributes: ['id', 'week', 'title'],
          include: [{
            model: JourneyV2,
            as: 'journey',
            attributes: ['id', 'trail', 'month', 'title']
          }]
        }]
      });
      if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });
      return res.json({ success: true, data: topic });
    } catch (error) {
      console.error('Erro ao buscar tópico:', error);
      return res.status(500).json({ error: 'Erro ao buscar tópico' });
    }
  },

  updateTopic: async (req, res) => {
    try {
      const topic = await JourneyV2Topic.findByPk(req.params.id, {
        include: [{ model: JourneyV2Week, as: 'week', include: [{ model: JourneyV2, as: 'journey', attributes: ['trail'] }] }]
      });
      if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });

      const updateData = { ...req.body };

      if (req.body.title || req.body.content) {
        const trail = topic.week?.journey?.trail || 'baby';
        const merged = { title: req.body.title || topic.title, content: req.body.content || topic.content };

        if (!req.body.dev_domain) {
          const classification = classifyTopic(merged, trail);
          updateData.dev_domain = classification.domain;
          updateData.classification_source = classification.source;
          updateData.classification_confidence = classification.confidence;
        }

        const hash = computeTopicHash(merged);
        const duplicate = await checkDuplicateTopic(JourneyV2Topic, hash, topic.id);
        if (duplicate) {
          return res.status(409).json({ error: 'Tópico duplicado detectado', duplicate: { id: duplicate.id, title: duplicate.title } });
        }
        updateData.content_hash = hash;
      }

      await topic.update(updateData);
      return res.json({ success: true, data: topic });
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      return res.status(500).json({ error: 'Erro ao atualizar tópico' });
    }
  },

  createTopic: async (req, res) => {
    try {
      const { week_id, title, content, order_index } = req.body;
      if (!week_id || !title || !content) {
        return res.status(400).json({ error: 'week_id, title e content são obrigatórios' });
      }
      const week = await JourneyV2Week.findByPk(week_id);
      if (!week) return res.status(404).json({ error: 'Semana não encontrada' });

      const weekWithJourney = await JourneyV2Week.findByPk(week_id, {
        include: [{ model: JourneyV2, as: 'journey', attributes: ['trail'] }]
      });
      const trail = weekWithJourney?.journey?.trail || 'baby';

      const topicData = { week_id, title, content, order_index: order_index || 0 };

      const classification = classifyTopic(topicData, trail);
      topicData.dev_domain = req.body.dev_domain || classification.domain;
      topicData.classification_source = req.body.dev_domain ? 'manual' : classification.source;
      topicData.classification_confidence = req.body.dev_domain ? 1.0 : classification.confidence;

      const hash = computeTopicHash(topicData);
      topicData.content_hash = hash;

      const duplicate = await checkDuplicateTopic(JourneyV2Topic, hash);
      if (duplicate) {
        return res.status(409).json({
          error: 'Tópico duplicado detectado',
          duplicate: { id: duplicate.id, title: duplicate.title }
        });
      }

      const topic = await JourneyV2Topic.create(topicData);
      return res.status(201).json({ success: true, data: topic });
    } catch (error) {
      console.error('Erro ao criar tópico:', error);
      return res.status(500).json({ error: 'Erro ao criar tópico' });
    }
  },

  deleteTopic: async (req, res) => {
    try {
      const topic = await JourneyV2Topic.findByPk(req.params.id);
      if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });
      await topic.destroy();
      return res.json({ success: true, message: 'Tópico excluído' });
    } catch (error) {
      console.error('Erro ao excluir tópico:', error);
      return res.status(500).json({ error: 'Erro ao excluir tópico' });
    }
  },

  getQuiz: async (req, res) => {
    try {
      const quiz = await JourneyV2Quiz.findByPk(req.params.id, {
        include: [{
          model: JourneyV2Week,
          as: 'week',
          attributes: ['id', 'week', 'title'],
          include: [{
            model: JourneyV2,
            as: 'journey',
            attributes: ['id', 'trail', 'month', 'title']
          }]
        }]
      });
      if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });
      return res.json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao buscar quiz:', error);
      return res.status(500).json({ error: 'Erro ao buscar quiz' });
    }
  },

  updateQuiz: async (req, res) => {
    try {
      const quiz = await JourneyV2Quiz.findByPk(req.params.id);
      if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });

      const targetWeekId = req.body.week_id || quiz.week_id;
      const targetDomain = req.body.domain || quiz.domain;
      const week = await JourneyV2Week.findByPk(targetWeekId, {
        include: [{ model: JourneyV2, as: 'journey', attributes: ['id', 'trail', 'month'] }]
      });
      if (week && week.journey) {
        if (week.journey.month === 1) {
          return res.status(400).json({ error: 'Quizzes não podem pertencer ao Mês 1 (semanas 1-4).' });
        }
        if (week.journey.trail !== targetDomain) {
          return res.status(400).json({ error: `O domínio do quiz (${targetDomain}) deve corresponder à trilha da semana (${week.journey.trail}).` });
        }
      }

      const updateData = { ...req.body };

      if (req.body.title || req.body.question || req.body.options) {
        const trail = week?.journey?.trail || quiz.domain;
        const merged = {
          title: req.body.title || quiz.title,
          question: req.body.question || quiz.question,
          options: req.body.options || quiz.options,
          feedback: req.body.feedback || quiz.feedback,
          knowledge: req.body.knowledge || quiz.knowledge
        };

        if (!req.body.dev_domain) {
          const classification = classifyQuiz(merged, trail);
          updateData.dev_domain = classification.domain;
          updateData.classification_source = classification.source;
          updateData.classification_confidence = classification.confidence;
        }

        const hash = computeQuizHash(merged);
        const duplicate = await checkDuplicateQuiz(JourneyV2Quiz, hash, quiz.id);
        if (duplicate) {
          return res.status(409).json({ error: 'Quiz duplicado detectado', duplicate: { id: duplicate.id, title: duplicate.title, question: duplicate.question } });
        }
        updateData.content_hash = hash;
      }

      await quiz.update(updateData);
      return res.json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      return res.status(500).json({ error: 'Erro ao atualizar quiz' });
    }
  },

  createQuiz: async (req, res) => {
    try {
      const { week_id, domain, domain_id, title, question, options, feedback, knowledge } = req.body;
      if (!week_id || !domain || !title || !question || !options || !feedback) {
        return res.status(400).json({ error: 'Campos obrigatórios: week_id, domain, title, question, options, feedback' });
      }
      const week = await JourneyV2Week.findByPk(week_id, {
        include: [{ model: JourneyV2, as: 'journey', attributes: ['id', 'trail', 'month'] }]
      });
      if (!week) return res.status(404).json({ error: 'Semana não encontrada' });

      if (week.journey && week.journey.month === 1) {
        return res.status(400).json({ error: 'Quizzes não podem ser criados no Mês 1 (semanas 1-4). Quizzes começam a partir da semana 5.' });
      }

      if (week.journey && week.journey.trail !== domain) {
        return res.status(400).json({ error: `O domínio do quiz (${domain}) deve corresponder à trilha da semana (${week.journey.trail}).` });
      }

      const trail = week.journey ? week.journey.trail : domain;
      const quizData = { week_id, domain, domain_id: domain_id || `${domain}_custom`, title, question, options, feedback, knowledge: knowledge || {} };

      const classification = classifyQuiz(quizData, trail);
      quizData.dev_domain = req.body.dev_domain || classification.domain;
      quizData.classification_source = req.body.dev_domain ? 'manual' : classification.source;
      quizData.classification_confidence = req.body.dev_domain ? 1.0 : classification.confidence;

      const hash = computeQuizHash(quizData);
      quizData.content_hash = hash;

      const duplicate = await checkDuplicateQuiz(JourneyV2Quiz, hash);
      if (duplicate) {
        return res.status(409).json({
          error: 'Quiz duplicado detectado',
          duplicate: { id: duplicate.id, title: duplicate.title, question: duplicate.question }
        });
      }

      const quiz = await JourneyV2Quiz.create(quizData);
      return res.status(201).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      return res.status(500).json({ error: 'Erro ao criar quiz' });
    }
  },

  deleteQuiz: async (req, res) => {
    try {
      const quiz = await JourneyV2Quiz.findByPk(req.params.id);
      if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });
      await quiz.destroy();
      return res.json({ success: true, message: 'Quiz excluído' });
    } catch (error) {
      console.error('Erro ao excluir quiz:', error);
      return res.status(500).json({ error: 'Erro ao excluir quiz' });
    }
  },

  listWeeks: async (req, res) => {
    try {
      const { trail, month } = req.query;
      const journeyWhere = {};
      if (trail) journeyWhere.trail = trail;
      if (month) journeyWhere.month = parseInt(month);

      const weeks = await JourneyV2Week.findAll({
        include: [{
          model: JourneyV2,
          as: 'journey',
          attributes: ['id', 'trail', 'month', 'title'],
          where: Object.keys(journeyWhere).length > 0 ? journeyWhere : undefined
        }],
        order: [[{ model: JourneyV2, as: 'journey' }, 'trail', 'ASC'], [{ model: JourneyV2, as: 'journey' }, 'month', 'ASC'], ['week', 'ASC']]
      });

      return res.json({ success: true, data: weeks });
    } catch (error) {
      console.error('Erro ao listar semanas:', error);
      return res.status(500).json({ error: 'Erro ao listar semanas' });
    }
  },

  reimport: async (req, res) => {
    try {
      const path = require('path');
      const fs = require('fs');
      const CONTENT_DIR = path.resolve(__dirname, '../../../conteudo_quiz');

      const babyFile = path.join(CONTENT_DIR, 'baby-journey.json');
      const motherFile = path.join(CONTENT_DIR, 'mother-journey.json');
      const quizFile = path.join(CONTENT_DIR, 'quizzes.json');

      if (!fs.existsSync(babyFile) || !fs.existsSync(motherFile) || !fs.existsSync(quizFile)) {
        return res.status(400).json({ error: 'Arquivos JSON não encontrados na pasta conteudo_quiz' });
      }

      await JourneyV2Quiz.destroy({ where: {} });
      await JourneyV2Badge.destroy({ where: {} });
      await JourneyV2Topic.destroy({ where: {} });
      await JourneyV2Week.destroy({ where: {} });
      await JourneyV2.destroy({ where: {} });

      const importJourney = async (filePath, trail) => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const weekIdMap = {};

        for (const monthEntry of data) {
          const monthNumber = parseInt(monthEntry.title.match(/Mês (\d+)/)?.[1] || '0');
          const journey = await JourneyV2.create({ trail, title: monthEntry.title, month: monthNumber });

          for (const weekEntry of monthEntry.journey) {
            const week = await JourneyV2Week.create({
              journey_id: journey.id, week: weekEntry.week, title: weekEntry.title, description: weekEntry.description, is_summary: false
            });
            weekIdMap[`${trail}_week_${weekEntry.week}`] = week.id;

            for (let i = 0; i < weekEntry.topics.length; i++) {
              const topic = weekEntry.topics[i];
              await JourneyV2Topic.create({ week_id: week.id, title: topic.title, content: topic.content, order_index: i });
              if (topic.content?.badge) {
                const badge = topic.content.badge;
                try {
                  await JourneyV2Badge.create({
                    id: badge.id, name: badge.nome || badge.name || badge.id,
                    icon: badge.icone || badge.icon || '', description: badge.description || '',
                    type: 'topic', week_id: week.id
                  });
                } catch (e) { if (e.name !== 'SequelizeUniqueConstraintError') throw e; }
              }
            }
          }
        }
        return weekIdMap;
      };

      const babyWeekMap = await importJourney(babyFile, 'baby');
      const motherWeekMap = await importJourney(motherFile, 'mother');

      const quizData = JSON.parse(fs.readFileSync(quizFile, 'utf-8'));
      for (const key of Object.keys(quizData)) {
        const entry = quizData[key];
        const weekNum = entry.week;
        const isSummary = entry.summary === true;

        let babyWeekId = babyWeekMap[`baby_week_${weekNum}`];
        let motherWeekId = motherWeekMap[`mother_week_${weekNum}`];

        if (isSummary) {
          const summaryJourney = await JourneyV2.findOne({ where: { trail: 'baby', month: entry.month } });
          if (summaryJourney) {
            const summaryWeek = await JourneyV2Week.create({
              journey_id: summaryJourney.id, week: weekNum || entry.month * 4,
              title: entry.title, description: entry.description, icon: entry.icon, is_summary: true
            });
            babyWeekId = summaryWeek.id;
            motherWeekId = summaryWeek.id;
            if (entry.recomendacao_geral) {
              await JourneyV2Topic.create({ week_id: summaryWeek.id, title: 'Recomendação Geral', content: { text: entry.recomendacao_geral, type: 'summary_recommendation' }, order_index: 0 });
            }
            if (entry.badge_on_complete) {
              const badge = entry.badge_on_complete;
              try { await JourneyV2Badge.create({ id: badge.id, name: badge.nome || '', icon: badge.icone || '', description: badge.descricao || badge.description || '', type: 'month_summary', week_id: summaryWeek.id }); } catch (e) { }
            }
          }
        }

        if (entry.baby_domains && babyWeekId) {
          for (const d of entry.baby_domains) {
            await JourneyV2Quiz.create({ week_id: babyWeekId, domain: 'baby', domain_id: d.id, title: d.title, question: d.question, options: d.options, feedback: d.feedback, knowledge: d.knowledge });
          }
        }
        if (entry.mother_domains && motherWeekId) {
          for (const d of entry.mother_domains) {
            await JourneyV2Quiz.create({ week_id: motherWeekId, domain: 'mother', domain_id: d.id, title: d.title, question: d.question, options: d.options, feedback: d.feedback, knowledge: d.knowledge });
          }
        }
        if (entry.badge_on_complete && !isSummary) {
          const badges = entry.badge_on_complete;
          if (badges.baby && babyWeekId) { try { await JourneyV2Badge.create({ id: badges.baby.id, name: badges.baby.nome || '', icon: badges.baby.icone || '', description: badges.baby.description || '', type: 'quiz_baby', week_id: babyWeekId }); } catch (e) { } }
          if (badges.mother && motherWeekId) { try { await JourneyV2Badge.create({ id: badges.mother.id, name: badges.mother.nome || '', icon: badges.mother.icone || '', description: badges.mother.description || '', type: 'quiz_mother', week_id: motherWeekId }); } catch (e) { } }
        }
      }

      const totals = {
        journeys: await JourneyV2.count(),
        weeks: await JourneyV2Week.count(),
        topics: await JourneyV2Topic.count(),
        quizzes: await JourneyV2Quiz.count(),
        badges: await JourneyV2Badge.count()
      };

      return res.json({ success: true, message: 'Reimportação concluída com sucesso', data: totals });
    } catch (error) {
      console.error('Erro na reimportação:', error);
      return res.status(500).json({ error: 'Erro na reimportação', details: error.message });
    }
  }
};

module.exports = adminJourneyV2Controller;
