const {
  JourneyV2,
  JourneyV2Week,
  JourneyV2Topic,
  JourneyV2Quiz,
  MilestoneMapping,
  MaternalCurationMapping,
  OfficialMilestone,
  JourneyV2Media,
  MediaResource,
  sequelize
} = require('../models');
const { Op } = require('sequelize');
const {
  classifyQuiz,
  classifyTopic,
  computeQuizHash,
  computeTopicHash,
  checkDuplicateQuiz,
  checkDuplicateTopic,
  BABY_DOMAIN_VALUES,
  MOTHER_DOMAIN_VALUES
} = require('../services/domainClassifierService');

const curationController = {

  getStatistics: async (req, res) => {
    try {
      const babyQuizzes = await sequelize.query(`
        SELECT q.dev_domain, COUNT(*) as count
        FROM journey_v2_quizzes q
        JOIN journey_v2_weeks w ON q.week_id = w.id
        JOIN journey_v2 j ON w.journey_id = j.id
        WHERE j.trail = 'baby'
        GROUP BY q.dev_domain
      `, { type: sequelize.QueryTypes.SELECT });

      const motherQuizzes = await sequelize.query(`
        SELECT q.dev_domain, COUNT(*) as count
        FROM journey_v2_quizzes q
        JOIN journey_v2_weeks w ON q.week_id = w.id
        JOIN journey_v2 j ON w.journey_id = j.id
        WHERE j.trail = 'mother'
        GROUP BY q.dev_domain
      `, { type: sequelize.QueryTypes.SELECT });

      const babyTopics = await sequelize.query(`
        SELECT t.dev_domain, COUNT(*) as count
        FROM journey_v2_topics t
        JOIN journey_v2_weeks w ON t.week_id = w.id
        JOIN journey_v2 j ON w.journey_id = j.id
        WHERE j.trail = 'baby'
        GROUP BY t.dev_domain
      `, { type: sequelize.QueryTypes.SELECT });

      const motherTopics = await sequelize.query(`
        SELECT t.dev_domain, COUNT(*) as count
        FROM journey_v2_topics t
        JOIN journey_v2_weeks w ON t.week_id = w.id
        JOIN journey_v2 j ON w.journey_id = j.id
        WHERE j.trail = 'mother'
        GROUP BY t.dev_domain
      `, { type: sequelize.QueryTypes.SELECT });

      const babyMilestoneMappings = await MilestoneMapping.count({ where: { source_type: 'v2', journey_v2_quiz_id: { [Op.ne]: null } } });
      const babyMilestoneVerified = await MilestoneMapping.count({ where: { source_type: 'v2', journey_v2_quiz_id: { [Op.ne]: null }, verified_by_curator: true } });

      const maternalMappings = await MaternalCurationMapping.count();
      const maternalVerified = await MaternalCurationMapping.count({ where: { verified_by_curator: true } });

      const unclassifiedQuizzes = await JourneyV2Quiz.count({ where: { dev_domain: null } });
      const unclassifiedTopics = await JourneyV2Topic.count({ where: { dev_domain: null } });

      return res.json({
        success: true,
        data: {
          axes: {
            baby_content: { topics: babyTopics, unclassified: babyTopics.filter(t => !t.dev_domain).reduce((s, t) => s + parseInt(t.count), 0) },
            mother_content: { topics: motherTopics, unclassified: motherTopics.filter(t => !t.dev_domain).reduce((s, t) => s + parseInt(t.count), 0) },
            baby_quiz: {
              quizzes: babyQuizzes,
              unclassified: babyQuizzes.filter(q => !q.dev_domain).reduce((s, q) => s + parseInt(q.count), 0),
              milestone_mappings: { total: babyMilestoneMappings, verified: babyMilestoneVerified }
            },
            mother_quiz: {
              quizzes: motherQuizzes,
              unclassified: motherQuizzes.filter(q => !q.dev_domain).reduce((s, q) => s + parseInt(q.count), 0),
              maternal_mappings: { total: maternalMappings, verified: maternalVerified }
            }
          },
          totals: { unclassified_quizzes: unclassifiedQuizzes, unclassified_topics: unclassifiedTopics }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de curadoria:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas de curadoria' });
    }
  },

  classifyAll: async (req, res) => {
    try {
      const { trail, type, force = false } = req.body;
      if (!trail || !['baby', 'mother'].includes(trail)) {
        return res.status(400).json({ error: 'trail deve ser "baby" ou "mother"' });
      }
      if (!type || !['quiz', 'topic'].includes(type)) {
        return res.status(400).json({ error: 'type deve ser "quiz" ou "topic"' });
      }

      const whereClause = force ? {} : { dev_domain: null };
      let items, classified = 0, skipped = 0, duplicates = [];

      if (type === 'quiz') {
        items = await sequelize.query(`
          SELECT q.id, q.title, q.question, q.options, q.feedback, q.knowledge, q.content_hash, q.dev_domain
          FROM journey_v2_quizzes q
          JOIN journey_v2_weeks w ON q.week_id = w.id
          JOIN journey_v2 j ON w.journey_id = j.id
          WHERE j.trail = :trail ${!force ? "AND q.dev_domain IS NULL" : ""}
        `, { replacements: { trail }, type: sequelize.QueryTypes.SELECT });

        for (const item of items) {
          const classification = classifyQuiz(item, trail);
          const hash = computeQuizHash(item);

          const existingHash = await JourneyV2Quiz.findOne({
            where: { content_hash: hash, id: { [Op.ne]: item.id } },
            attributes: ['id', 'title']
          });

          if (existingHash) {
            duplicates.push({ id: item.id, title: item.title, duplicate_of: existingHash.id });
          }

          await JourneyV2Quiz.update({
            dev_domain: classification.domain,
            classification_source: classification.source,
            classification_confidence: classification.confidence,
            content_hash: hash
          }, { where: { id: item.id } });

          classified++;
        }
      } else {
        items = await sequelize.query(`
          SELECT t.id, t.title, t.content, t.content_hash, t.dev_domain
          FROM journey_v2_topics t
          JOIN journey_v2_weeks w ON t.week_id = w.id
          JOIN journey_v2 j ON w.journey_id = j.id
          WHERE j.trail = :trail ${!force ? "AND t.dev_domain IS NULL" : ""}
        `, { replacements: { trail }, type: sequelize.QueryTypes.SELECT });

        for (const item of items) {
          const classification = classifyTopic(item, trail);
          const hash = computeTopicHash(item);

          const existingHash = await JourneyV2Topic.findOne({
            where: { content_hash: hash, id: { [Op.ne]: item.id } },
            attributes: ['id', 'title']
          });

          if (existingHash) {
            duplicates.push({ id: item.id, title: item.title, duplicate_of: existingHash.id });
          }

          await JourneyV2Topic.update({
            dev_domain: classification.domain,
            classification_source: classification.source,
            classification_confidence: classification.confidence,
            content_hash: hash
          }, { where: { id: item.id } });

          classified++;
        }
      }

      return res.json({
        success: true,
        data: {
          trail,
          type,
          classified,
          skipped,
          duplicates_found: duplicates.length,
          duplicates
        }
      });
    } catch (error) {
      console.error('Erro na classificação:', error);
      return res.status(500).json({ error: 'Erro na classificação de domínios' });
    }
  },

  updateDomain: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, dev_domain, notes } = req.body;

      if (!type || !['quiz', 'topic'].includes(type)) {
        return res.status(400).json({ error: 'type deve ser "quiz" ou "topic"' });
      }

      const allDomains = [...BABY_DOMAIN_VALUES, ...MOTHER_DOMAIN_VALUES];
      if (dev_domain && !allDomains.includes(dev_domain)) {
        return res.status(400).json({ error: `dev_domain inválido. Valores aceitos: ${allDomains.join(', ')}` });
      }

      const Model = type === 'quiz' ? JourneyV2Quiz : JourneyV2Topic;
      const item = await Model.findByPk(id);
      if (!item) return res.status(404).json({ error: `${type} não encontrado` });

      await item.update({
        dev_domain,
        classification_source: 'manual',
        classification_confidence: 1.0
      });

      return res.json({ success: true, data: item });
    } catch (error) {
      console.error('Erro ao atualizar domínio:', error);
      return res.status(500).json({ error: 'Erro ao atualizar domínio' });
    }
  },

  listByAxis: async (req, res) => {
    try {
      const { axis } = req.params;
      const { dev_domain, month, week, search, classified, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const validAxes = ['baby_content', 'mother_content', 'baby_quiz', 'mother_quiz'];
      if (!validAxes.includes(axis)) {
        return res.status(400).json({ error: `Eixo inválido. Use: ${validAxes.join(', ')}` });
      }

      const [trail, type] = axis.split('_');
      const isQuiz = type === 'quiz';
      const Model = isQuiz ? JourneyV2Quiz : JourneyV2Topic;

      const where = {};
      if (dev_domain) where.dev_domain = dev_domain;
      if (classified === 'true') where.dev_domain = { [Op.ne]: null };
      if (classified === 'false') where.dev_domain = null;
      if (search) {
        where[Op.or] = isQuiz
          ? [{ title: { [Op.iLike]: `%${search}%` } }, { question: { [Op.iLike]: `%${search}%` } }]
          : [{ title: { [Op.iLike]: `%${search}%` } }];
      }

      const weekWhere = {};
      if (week) weekWhere.week = parseInt(week);

      const journeyWhere = { trail };
      if (month) journeyWhere.month = parseInt(month);

      const { count, rows } = await Model.findAndCountAll({
        where,
        include: [{
          model: JourneyV2Week,
          as: 'week',
          attributes: ['id', 'week', 'title'],
          where: Object.keys(weekWhere).length > 0 ? weekWhere : undefined,
          include: [{
            model: JourneyV2,
            as: 'journey',
            attributes: ['id', 'trail', 'month', 'title'],
            where: journeyWhere
          }]
        }],
        order: isQuiz
          ? [[{ model: JourneyV2Week, as: 'week' }, 'week', 'ASC'], ['dev_domain', 'ASC']]
          : [[{ model: JourneyV2Week, as: 'week' }, 'week', 'ASC'], ['order_index', 'ASC']],
        limit: parseInt(limit),
        offset,
        distinct: true
      });

      return res.json({
        success: true,
        data: rows,
        meta: { axis, total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
      });
    } catch (error) {
      console.error('Erro ao listar por eixo:', error);
      return res.status(500).json({ error: 'Erro ao listar conteúdo por eixo' });
    }
  },

  getBabyMilestoneMappings: async (req, res) => {
    try {
      const { quiz_id, milestone_id, verified, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const where = { source_type: 'v2', journey_v2_quiz_id: { [Op.ne]: null } };
      if (quiz_id) where.journey_v2_quiz_id = quiz_id;
      if (milestone_id) where.official_milestone_id = milestone_id;
      if (verified === 'true') where.verified_by_curator = true;
      if (verified === 'false') where.verified_by_curator = false;

      const { count, rows } = await MilestoneMapping.findAndCountAll({
        where,
        include: [
          { model: OfficialMilestone, as: 'milestone', attributes: ['id', 'title', 'category', 'target_month', 'description'] },
          { model: JourneyV2Quiz, as: 'journeyV2Quiz', attributes: ['id', 'title', 'question', 'dev_domain', 'domain'] }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      return res.json({
        success: true,
        data: rows,
        meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
      });
    } catch (error) {
      console.error('Erro ao listar mapeamentos V2:', error);
      return res.status(500).json({ error: 'Erro ao listar mapeamentos' });
    }
  },

  createBabyMilestoneMapping: async (req, res) => {
    try {
      const { official_milestone_id, journey_v2_quiz_id, weight, notes } = req.body;
      if (!official_milestone_id || !journey_v2_quiz_id) {
        return res.status(400).json({ error: 'official_milestone_id e journey_v2_quiz_id são obrigatórios' });
      }

      const milestone = await OfficialMilestone.findByPk(official_milestone_id);
      if (!milestone) return res.status(404).json({ error: 'Marco oficial não encontrado' });

      const quiz = await JourneyV2Quiz.findByPk(journey_v2_quiz_id);
      if (!quiz) return res.status(404).json({ error: 'Quiz V2 não encontrado' });

      const existing = await MilestoneMapping.findOne({
        where: { official_milestone_id, journey_v2_quiz_id }
      });
      if (existing) return res.status(409).json({ error: 'Mapeamento já existe', data: existing });

      const mapping = await MilestoneMapping.create({
        official_milestone_id,
        journey_v2_quiz_id,
        journey_question_id: null,
        source_type: 'v2',
        weight: weight || 1.0,
        is_auto_generated: false,
        verified_by_curator: false,
        notes
      });

      return res.status(201).json({ success: true, data: mapping });
    } catch (error) {
      console.error('Erro ao criar mapeamento V2:', error);
      return res.status(500).json({ error: 'Erro ao criar mapeamento' });
    }
  },

  verifyBabyMilestoneMapping: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const mapping = await MilestoneMapping.findByPk(id);
      if (!mapping) return res.status(404).json({ error: 'Mapeamento não encontrado' });

      await mapping.update({
        verified_by_curator: true,
        verified_at: new Date(),
        verified_by: req.user.id,
        notes: notes || mapping.notes
      });

      return res.json({ success: true, data: mapping });
    } catch (error) {
      console.error('Erro ao verificar mapeamento:', error);
      return res.status(500).json({ error: 'Erro ao verificar mapeamento' });
    }
  },

  deleteBabyMilestoneMapping: async (req, res) => {
    try {
      const mapping = await MilestoneMapping.findByPk(req.params.id);
      if (!mapping) return res.status(404).json({ error: 'Mapeamento não encontrado' });
      await mapping.destroy();
      return res.json({ success: true, message: 'Mapeamento removido' });
    } catch (error) {
      console.error('Erro ao remover mapeamento:', error);
      return res.status(500).json({ error: 'Erro ao remover mapeamento' });
    }
  },

  getMaternalMappings: async (req, res) => {
    try {
      const { quiz_id, topic_id, domain, verified, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const where = {};
      if (quiz_id) where.journey_v2_quiz_id = quiz_id;
      if (topic_id) where.journey_v2_topic_id = topic_id;
      if (domain) where.maternal_domain = domain;
      if (verified === 'true') where.verified_by_curator = true;
      if (verified === 'false') where.verified_by_curator = false;

      const { count, rows } = await MaternalCurationMapping.findAndCountAll({
        where,
        include: [
          { model: JourneyV2Quiz, as: 'quiz', attributes: ['id', 'title', 'question', 'dev_domain'], required: false },
          { model: JourneyV2Topic, as: 'topic', attributes: ['id', 'title', 'dev_domain'], required: false }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      return res.json({
        success: true,
        data: rows,
        meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
      });
    } catch (error) {
      console.error('Erro ao listar mapeamentos maternos:', error);
      return res.status(500).json({ error: 'Erro ao listar mapeamentos maternos' });
    }
  },

  createMaternalMapping: async (req, res) => {
    try {
      const { maternal_domain, journey_v2_quiz_id, journey_v2_topic_id, relevance_score, ai_reasoning, weight, notes } = req.body;

      if (!maternal_domain || !MOTHER_DOMAIN_VALUES.includes(maternal_domain)) {
        return res.status(400).json({ error: `maternal_domain inválido. Valores aceitos: ${MOTHER_DOMAIN_VALUES.join(', ')}` });
      }
      if (!journey_v2_quiz_id && !journey_v2_topic_id) {
        return res.status(400).json({ error: 'journey_v2_quiz_id ou journey_v2_topic_id é obrigatório' });
      }

      if (journey_v2_quiz_id) {
        const quiz = await JourneyV2Quiz.findByPk(journey_v2_quiz_id);
        if (!quiz) return res.status(404).json({ error: 'Quiz V2 não encontrado' });
      }
      if (journey_v2_topic_id) {
        const topic = await JourneyV2Topic.findByPk(journey_v2_topic_id);
        if (!topic) return res.status(404).json({ error: 'Tópico V2 não encontrado' });
      }

      const existingWhere = { maternal_domain };
      if (journey_v2_quiz_id) existingWhere.journey_v2_quiz_id = journey_v2_quiz_id;
      if (journey_v2_topic_id) existingWhere.journey_v2_topic_id = journey_v2_topic_id;

      const existing = await MaternalCurationMapping.findOne({ where: existingWhere });
      if (existing) return res.status(409).json({ error: 'Mapeamento materno já existe', data: existing });

      const mapping = await MaternalCurationMapping.create({
        maternal_domain,
        journey_v2_quiz_id,
        journey_v2_topic_id,
        relevance_score: relevance_score || null,
        ai_reasoning: ai_reasoning || null,
        weight: weight || 1.0,
        is_auto_generated: false,
        verified_by_curator: false,
        notes
      });

      return res.status(201).json({ success: true, data: mapping });
    } catch (error) {
      console.error('Erro ao criar mapeamento materno:', error);
      return res.status(500).json({ error: 'Erro ao criar mapeamento materno' });
    }
  },

  verifyMaternalMapping: async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const mapping = await MaternalCurationMapping.findByPk(id);
      if (!mapping) return res.status(404).json({ error: 'Mapeamento materno não encontrado' });

      await mapping.update({
        verified_by_curator: true,
        verified_at: new Date(),
        verified_by: req.user.id,
        notes: notes || mapping.notes
      });

      return res.json({ success: true, data: mapping });
    } catch (error) {
      console.error('Erro ao verificar mapeamento materno:', error);
      return res.status(500).json({ error: 'Erro ao verificar mapeamento materno' });
    }
  },

  deleteMaternalMapping: async (req, res) => {
    try {
      const mapping = await MaternalCurationMapping.findByPk(req.params.id);
      if (!mapping) return res.status(404).json({ error: 'Mapeamento materno não encontrado' });
      await mapping.destroy();
      return res.json({ success: true, message: 'Mapeamento materno removido' });
    } catch (error) {
      console.error('Erro ao remover mapeamento materno:', error);
      return res.status(500).json({ error: 'Erro ao remover mapeamento materno' });
    }
  },

  getMediaForItem: async (req, res) => {
    try {
      const { type, id } = req.params;
      if (!['quiz', 'topic'].includes(type)) {
        return res.status(400).json({ error: 'type deve ser "quiz" ou "topic"' });
      }

      const where = type === 'quiz'
        ? { journey_v2_quiz_id: id }
        : { journey_v2_topic_id: id };

      const mediaItems = await JourneyV2Media.findAll({
        where,
        include: [{ model: MediaResource, as: 'mediaResource' }],
        order: [['position', 'ASC']]
      });

      return res.json({ success: true, data: mediaItems });
    } catch (error) {
      console.error('Erro ao buscar mídia:', error);
      return res.status(500).json({ error: 'Erro ao buscar mídia' });
    }
  },

  linkMedia: async (req, res) => {
    try {
      const { type, id } = req.params;
      const { media_resource_id, block_type, position, metadata } = req.body;

      if (!['quiz', 'topic'].includes(type)) {
        return res.status(400).json({ error: 'type deve ser "quiz" ou "topic"' });
      }
      if (!media_resource_id) {
        return res.status(400).json({ error: 'media_resource_id é obrigatório' });
      }

      const data = {
        media_resource_id,
        block_type: block_type || 'attachment',
        position: position || 0,
        metadata: metadata || {}
      };

      if (type === 'quiz') {
        const quiz = await JourneyV2Quiz.findByPk(id);
        if (!quiz) return res.status(404).json({ error: 'Quiz não encontrado' });
        data.journey_v2_quiz_id = id;
      } else {
        const topic = await JourneyV2Topic.findByPk(id);
        if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });
        data.journey_v2_topic_id = id;
      }

      const media = await JourneyV2Media.create(data);
      return res.status(201).json({ success: true, data: media });
    } catch (error) {
      console.error('Erro ao vincular mídia:', error);
      return res.status(500).json({ error: 'Erro ao vincular mídia' });
    }
  },

  unlinkMedia: async (req, res) => {
    try {
      const media = await JourneyV2Media.findByPk(req.params.mediaId);
      if (!media) return res.status(404).json({ error: 'Vínculo de mídia não encontrado' });
      await media.destroy();
      return res.json({ success: true, message: 'Mídia desvinculada' });
    } catch (error) {
      console.error('Erro ao desvincular mídia:', error);
      return res.status(500).json({ error: 'Erro ao desvincular mídia' });
    }
  },

  getDomainValues: async (req, res) => {
    try {
      return res.json({
        success: true,
        data: {
          baby: BABY_DOMAIN_VALUES.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
          mother: MOTHER_DOMAIN_VALUES.map(d => ({
            value: d,
            label: d.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }))
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar valores de domínio' });
    }
  },

  batchImport: async (req, res) => {
    try {
      const { axis, items } = req.body;

      const validAxes = ['baby-content', 'mother-content', 'baby-quiz', 'mother-quiz'];
      if (!axis || !validAxes.includes(axis)) {
        return res.status(400).json({ error: `axis inválido. Valores aceitos: ${validAxes.join(', ')}` });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items deve ser um array não vazio' });
      }

      const trail = axis.startsWith('baby') ? 'baby' : 'mother';
      const isQuiz = axis.endsWith('-quiz');

      const created = [];
      const duplicates = [];
      const errors = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          if (!item.month || !item.week) {
            errors.push({ index: i, item, error: 'month e week são obrigatórios' });
            continue;
          }

          if (isQuiz) {
            if (!item.title || !item.question || !item.options || !item.feedback) {
              errors.push({ index: i, item, error: 'title, question, options e feedback são obrigatórios para quizzes' });
              continue;
            }

            const globalWeek = (item.month - 1) * 4 + item.week;
            if (globalWeek < 5) {
              errors.push({ index: i, item, error: 'Quizzes só são permitidos a partir da semana 5 (mês > 1)' });
              continue;
            }
          } else {
            if (!item.title || !item.content) {
              errors.push({ index: i, item, error: 'title e content são obrigatórios para tópicos' });
              continue;
            }
          }

          const journey = await JourneyV2.findOne({
            where: { trail, month: item.month }
          });
          if (!journey) {
            errors.push({ index: i, item, error: `Jornada não encontrada para trail=${trail}, month=${item.month}` });
            continue;
          }

          const weekRecord = await JourneyV2Week.findOne({
            where: { journey_id: journey.id, week: item.week }
          });
          if (!weekRecord) {
            errors.push({ index: i, item, error: `Semana não encontrada para journey_id=${journey.id}, week=${item.week}` });
            continue;
          }

          const week_id = weekRecord.id;

          if (isQuiz) {
            const quizData = {
              week_id,
              title: item.title,
              question: item.question,
              options: item.options,
              feedback: item.feedback,
              knowledge: item.knowledge || {},
              domain: trail,
              domain_id: item.domain_id || `${trail}_batch`
            };

            const classification = classifyQuiz(quizData, trail);
            quizData.dev_domain = classification.domain;
            quizData.classification_source = classification.source;
            quizData.classification_confidence = classification.confidence;

            const hash = computeQuizHash(quizData);
            quizData.content_hash = hash;

            const duplicate = await checkDuplicateQuiz(JourneyV2Quiz, hash);
            if (duplicate) {
              duplicates.push({ index: i, title: item.title, duplicate_of: duplicate.id, duplicate_title: duplicate.title });
              continue;
            }

            const record = await JourneyV2Quiz.create(quizData);
            created.push({ index: i, id: record.id, title: record.title, dev_domain: record.dev_domain });
          } else {
            const topicData = {
              week_id,
              title: item.title,
              content: item.content,
              order_index: item.order_index || 0
            };

            const classification = classifyTopic(topicData, trail);
            topicData.dev_domain = classification.domain;
            topicData.classification_source = classification.source;
            topicData.classification_confidence = classification.confidence;

            const hash = computeTopicHash(topicData);
            topicData.content_hash = hash;

            const duplicate = await checkDuplicateTopic(JourneyV2Topic, hash);
            if (duplicate) {
              duplicates.push({ index: i, title: item.title, duplicate_of: duplicate.id, duplicate_title: duplicate.title });
              continue;
            }

            const record = await JourneyV2Topic.create(topicData);
            created.push({ index: i, id: record.id, title: record.title, dev_domain: record.dev_domain });
          }
        } catch (itemError) {
          errors.push({ index: i, item, error: itemError.message });
        }
      }

      return res.json({
        success: true,
        axis,
        summary: {
          total: items.length,
          created: created.length,
          duplicates: duplicates.length,
          errors: errors.length
        },
        details: {
          created,
          duplicates,
          errors
        }
      });
    } catch (error) {
      console.error('Erro no batch import:', error);
      return res.status(500).json({ error: 'Erro no batch import de curadoria' });
    }
  }
};

module.exports = curationController;
