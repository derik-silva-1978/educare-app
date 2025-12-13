/**
 * Controller para Marcos do Desenvolvimento
 * Gerencia marcos oficiais, mapeamentos e Auto-Linker
 */

const { OfficialMilestone, MilestoneMapping, JourneyBotQuestion, User, MilestoneCandidateScore } = require('../models');
const { Op } = require('sequelize');
const officialMilestonesData = require('../seeds/officialMilestones');
const OpenAI = require('openai');

/**
 * Mapeamento de domínios: JourneyBotQuestion.domain_name -> OfficialMilestone.category
 */
const DOMAIN_MAPPING = {
  'motor': 'motor',
  'motordesenvolvimento': 'motor',
  'motor_grosso': 'motor',
  'motor_fino': 'motor',
  'cognitivo': 'cognitivo',
  'cognitive': 'cognitivo',
  'cognição': 'cognitivo',
  'linguagem': 'linguagem',
  'language': 'linguagem',
  'communication': 'linguagem',
  'comunicação': 'linguagem',
  'social': 'social',
  'socialização': 'social',
  'social_emotional': 'social',
  'emocional': 'emocional',
  'emotional': 'emocional',
  'socioemocional': 'emocional',
  'sensorial': 'sensorial',
  'sensory': 'sensorial'
};

/**
 * Normaliza o nome do domínio para corresponder às categorias de marcos
 */
const normalizeDomain = (domainName) => {
  if (!domainName) return null;
  const normalized = domainName.toLowerCase().replace(/[^a-z]/g, '');
  return DOMAIN_MAPPING[normalized] || null;
};

/**
 * Converte mês para semanas (aproximado)
 */
const monthToWeeks = (month) => Math.round(month * 4.33);

/**
 * Cria as tabelas de marcos se não existirem
 */
const ensureTablesExist = async () => {
  const { sequelize } = require('../models');
  
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS official_milestones (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(20) NOT NULL CHECK (category IN ('motor', 'cognitivo', 'linguagem', 'social', 'emocional', 'sensorial')),
      target_month INTEGER NOT NULL,
      min_month INTEGER,
      max_month INTEGER,
      source VARCHAR(100) NOT NULL DEFAULT 'caderneta_crianca_ms',
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS milestone_mappings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      official_milestone_id UUID NOT NULL,
      journey_question_id UUID NOT NULL,
      weight DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
      is_auto_generated BOOLEAN NOT NULL DEFAULT false,
      verified_by_curator BOOLEAN NOT NULL DEFAULT false,
      verified_at TIMESTAMP WITH TIME ZONE,
      verified_by UUID,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT unique_milestone_question_mapping UNIQUE (official_milestone_id, journey_question_id)
    );
  `);
  
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_mappings_verified ON milestone_mappings(verified_by_curator);`);
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_mappings_auto ON milestone_mappings(is_auto_generated);`);
  
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS milestone_candidate_scores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      official_milestone_id UUID NOT NULL,
      journey_question_id UUID NOT NULL,
      relevance_score INTEGER NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 5),
      ai_reasoning TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT unique_milestone_question_score UNIQUE (official_milestone_id, journey_question_id)
    );
  `);
  
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_candidate_scores_relevance ON milestone_candidate_scores(relevance_score);`);
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_candidate_scores_milestone ON milestone_candidate_scores(official_milestone_id);`);
  
  console.log('✅ Tabelas de marcos verificadas/criadas');
};

/**
 * Seed dos marcos oficiais
 */
const seedOfficialMilestones = async (req, res) => {
  try {
    console.log('📊 Iniciando seed de marcos oficiais...');
    
    await ensureTablesExist();
    
    const existingCount = await OfficialMilestone.count();
    if (existingCount > 0) {
      return res.status(200).json({
        success: true,
        message: `Seed ignorado: ${existingCount} marcos já existem`,
        count: existingCount
      });
    }

    const milestones = await OfficialMilestone.bulkCreate(officialMilestonesData, {
      returning: true
    });

    console.log(`✅ ${milestones.length} marcos oficiais inseridos`);
    
    return res.status(201).json({
      success: true,
      message: `${milestones.length} marcos oficiais inseridos com sucesso`,
      count: milestones.length
    });
  } catch (error) {
    console.error('❌ Erro ao inserir marcos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao inserir marcos oficiais',
      error: error.message
    });
  }
};

/**
 * Auto-Linker: Vincula automaticamente perguntas da jornada aos marcos oficiais
 */
const autoLinkMilestones = async (req, res) => {
  try {
    console.log('🤖 Iniciando Auto-Linker...');
    
    const toleranceWeeks = req.body.toleranceWeeks || 4;
    
    const milestones = await OfficialMilestone.findAll({
      where: { is_active: true }
    });

    if (milestones.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum marco oficial encontrado. Execute o seed primeiro.'
      });
    }

    console.log(`📊 Processando ${milestones.length} marcos oficiais...`);
    
    let totalMappings = 0;
    let skippedDuplicates = 0;
    const results = [];

    for (const milestone of milestones) {
      const targetWeek = monthToWeeks(milestone.target_month);
      const minWeek = Math.max(0, targetWeek - toleranceWeeks);
      const maxWeek = targetWeek + toleranceWeeks;

      const questions = await JourneyBotQuestion.findAll({
        where: {
          is_active: true,
          domain_name: {
            [Op.ne]: null
          }
        }
      });

      const matchedQuestions = questions.filter(q => {
        const normalizedDomain = normalizeDomain(q.domain_name);
        if (normalizedDomain !== milestone.category) return false;

        const questionWeek = q.week || monthToWeeks(q.meta_min_months || 0);
        return questionWeek >= minWeek && questionWeek <= maxWeek;
      });

      for (const question of matchedQuestions) {
        try {
          const [mapping, created] = await MilestoneMapping.findOrCreate({
            where: {
              official_milestone_id: milestone.id,
              journey_question_id: question.id
            },
            defaults: {
              weight: 1.0,
              is_auto_generated: true,
              verified_by_curator: false
            }
          });

          if (created) {
            totalMappings++;
          } else {
            skippedDuplicates++;
          }
        } catch (err) {
          console.error(`Erro ao criar mapping: ${err.message}`);
        }
      }

      if (matchedQuestions.length > 0) {
        results.push({
          milestone: milestone.title,
          category: milestone.category,
          targetMonth: milestone.target_month,
          matchedQuestions: matchedQuestions.length
        });
      }
    }

    console.log(`✅ Auto-Linker concluído: ${totalMappings} mapeamentos criados`);

    return res.status(200).json({
      success: true,
      message: `Auto-Linker concluído com sucesso`,
      totalMappings,
      skippedDuplicates,
      details: results
    });
  } catch (error) {
    console.error('❌ Erro no Auto-Linker:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao executar Auto-Linker',
      error: error.message
    });
  }
};

/**
 * Lista todos os marcos oficiais
 */
const listMilestones = async (req, res) => {
  try {
    const { category, month } = req.query;
    
    const where = { is_active: true };
    if (category) where.category = category;
    if (month) where.target_month = parseInt(month);

    const milestones = await OfficialMilestone.findAll({
      where,
      order: [['category', 'ASC'], ['order_index', 'ASC']],
      include: [{
        model: MilestoneMapping,
        as: 'mappings',
        required: false,
        attributes: ['id', 'is_auto_generated', 'verified_by_curator']
      }]
    });

    return res.status(200).json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error('Erro ao listar marcos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar marcos',
      error: error.message
    });
  }
};

/**
 * Lista mapeamentos para curadoria
 */
const listMappings = async (req, res) => {
  try {
    const { verified, auto_generated } = req.query;
    
    const where = {};
    if (verified !== undefined) where.verified_by_curator = verified === 'true';
    if (auto_generated !== undefined) where.is_auto_generated = auto_generated === 'true';

    const mappings = await MilestoneMapping.findAll({
      where,
      include: [
        {
          model: OfficialMilestone,
          as: 'milestone',
          attributes: ['id', 'title', 'category', 'target_month']
        },
        {
          model: JourneyBotQuestion,
          as: 'journeyQuestion',
          attributes: ['id', 'domain_name', 'domain_question', 'week', 'meta_min_months']
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings
    });
  } catch (error) {
    console.error('Erro ao listar mapeamentos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar mapeamentos',
      error: error.message
    });
  }
};

/**
 * Verifica um mapeamento (aprovação do curador)
 */
const verifyMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const mapping = await MilestoneMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapeamento não encontrado'
      });
    }

    await mapping.update({
      verified_by_curator: true,
      verified_at: new Date(),
      verified_by: req.user.id,
      notes: notes || mapping.notes
    });

    return res.status(200).json({
      success: true,
      message: 'Mapeamento verificado com sucesso',
      data: mapping
    });
  } catch (error) {
    console.error('Erro ao verificar mapeamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar mapeamento',
      error: error.message
    });
  }
};

/**
 * Remove um mapeamento incorreto
 */
const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mapping = await MilestoneMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapeamento não encontrado'
      });
    }

    await mapping.destroy();

    return res.status(200).json({
      success: true,
      message: 'Mapeamento removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover mapeamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover mapeamento',
      error: error.message
    });
  }
};

/**
 * Gráfico de marcos do desenvolvimento para o dashboard
 */
const getMilestonesChart = async (req, res) => {
  try {
    const { childId } = req.query;

    const milestones = await OfficialMilestone.findAll({
      where: { is_active: true },
      include: [{
        model: MilestoneMapping,
        as: 'mappings',
        required: false,
        include: [{
          model: JourneyBotQuestion,
          as: 'journeyQuestion',
          attributes: ['id', 'domain_name', 'domain_question']
        }]
      }],
      order: [['category', 'ASC'], ['target_month', 'ASC']]
    });

    const categories = ['motor', 'cognitivo', 'linguagem', 'social', 'emocional', 'sensorial'];
    
    const chartData = categories.map(category => {
      const categoryMilestones = milestones.filter(m => m.category === category);
      const totalMilestones = categoryMilestones.length;
      const mappedMilestones = categoryMilestones.filter(m => m.mappings && m.mappings.length > 0).length;
      
      return {
        category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        total: totalMilestones,
        mapped: mappedMilestones,
        coverage: totalMilestones > 0 ? Math.round((mappedMilestones / totalMilestones) * 100) : 0
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        chartData,
        totalMilestones: milestones.length,
        milestonesByMonth: milestones.reduce((acc, m) => {
          const month = m.target_month;
          if (!acc[month]) acc[month] = [];
          acc[month].push({
            id: m.id,
            title: m.title,
            category: m.category,
            hasMappings: m.mappings && m.mappings.length > 0
          });
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Erro ao gerar gráfico de marcos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar gráfico de marcos',
      error: error.message
    });
  }
};

/**
 * Estatísticas de curadoria
 */
const getCurationStats = async (req, res) => {
  try {
    const totalMappings = await MilestoneMapping.count();
    const autoGenerated = await MilestoneMapping.count({ where: { is_auto_generated: true } });
    const verified = await MilestoneMapping.count({ where: { verified_by_curator: true } });
    const pendingReview = await MilestoneMapping.count({ 
      where: { is_auto_generated: true, verified_by_curator: false } 
    });
    const totalMilestones = await OfficialMilestone.count({ where: { is_active: true } });

    return res.status(200).json({
      success: true,
      data: {
        totalMilestones,
        totalMappings,
        autoGenerated,
        verified,
        pendingReview,
        verificationRate: totalMappings > 0 ? Math.round((verified / totalMappings) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
};

/**
 * Faixas etárias para agrupamento (em meses)
 */
const AGE_RANGES = [
  { id: '0-3', label: '0 a 3 Meses', min: 0, max: 3 },
  { id: '4-6', label: '4 a 6 Meses', min: 4, max: 6 },
  { id: '7-9', label: '7 a 9 Meses', min: 7, max: 9 },
  { id: '10-12', label: '10 a 12 Meses', min: 10, max: 12 },
  { id: '13-18', label: '13 a 18 Meses', min: 13, max: 18 },
  { id: '19-24', label: '19 a 24 Meses', min: 19, max: 24 },
  { id: '25-36', label: '25 a 36 Meses (2-3 anos)', min: 25, max: 36 },
  { id: '37-48', label: '37 a 48 Meses (3-4 anos)', min: 37, max: 48 },
  { id: '49-60', label: '49 a 60 Meses (4-5 anos)', min: 49, max: 60 },
  { id: '61-72', label: '61 a 72 Meses (5-6 anos)', min: 61, max: 72 }
];

/**
 * Visão cronológica para curadoria
 * Retorna marcos agrupados por faixa etária com perguntas vinculadas e candidatas
 * Inclui scores de relevância da IA quando disponíveis
 */
const getCurationView = async (req, res) => {
  try {
    const { category } = req.query;
    
    const milestoneWhere = { is_active: true };
    if (category) milestoneWhere.category = category;

    const milestones = await OfficialMilestone.findAll({
      where: milestoneWhere,
      order: [['target_month', 'ASC'], ['order_index', 'ASC']],
      include: [{
        model: MilestoneMapping,
        as: 'mappings',
        required: false,
        include: [{
          model: JourneyBotQuestion,
          as: 'journeyQuestion',
          attributes: ['id', 'domain_name', 'domain_question', 'week', 'meta_min_months']
        }]
      }]
    });

    const allQuestions = await JourneyBotQuestion.findAll({
      where: { is_active: true },
      attributes: ['id', 'domain_name', 'domain_question', 'week', 'meta_min_months'],
      order: [['week', 'ASC']]
    });

    const allScores = await MilestoneCandidateScore.findAll({
      attributes: ['official_milestone_id', 'journey_question_id', 'relevance_score', 'ai_reasoning']
    });
    const scoresMap = new Map();
    allScores.forEach(s => {
      scoresMap.set(`${s.official_milestone_id}:${s.journey_question_id}`, {
        score: s.relevance_score,
        reasoning: s.ai_reasoning
      });
    });

    const result = AGE_RANGES.map(range => {
      const rangeMilestones = milestones.filter(m => 
        m.target_month >= range.min && m.target_month <= range.max
      );

      const milestonesWithCandidates = rangeMilestones.map(milestone => {
        const linkedQuestionIds = new Set(
          (milestone.mappings || []).map(m => m.journeyQuestion?.id).filter(Boolean)
        );

        const targetWeek = monthToWeeks(milestone.target_month);
        const minWeek = Math.max(0, targetWeek - 4);
        const maxWeek = targetWeek + 4;

        const candidateQuestions = allQuestions.filter(q => {
          if (linkedQuestionIds.has(q.id)) return false;
          const questionWeek = q.week || monthToWeeks(q.meta_min_months || 0);
          return questionWeek >= minWeek && questionWeek <= maxWeek;
        });

        const candidatesWithScores = candidateQuestions.map(q => {
          const scoreData = scoresMap.get(`${milestone.id}:${q.id}`);
          return {
            id: q.id,
            domain_name: q.domain_name,
            domain_question: q.domain_question,
            week: q.week,
            meta_min_months: q.meta_min_months,
            relevance_score: scoreData?.score ?? null,
            ai_reasoning: scoreData?.reasoning ?? null
          };
        });

        candidatesWithScores.sort((a, b) => {
          const scoreA = a.relevance_score ?? -1;
          const scoreB = b.relevance_score ?? -1;
          return scoreB - scoreA;
        });

        const linkedWithAutoFlag = (milestone.mappings || []).map(m => {
          const scoreData = scoresMap.get(`${milestone.id}:${m.journeyQuestion?.id}`);
          return {
            mapping_id: m.id,
            question_id: m.journeyQuestion?.id,
            domain_name: m.journeyQuestion?.domain_name,
            domain_question: m.journeyQuestion?.domain_question,
            week: m.journeyQuestion?.week,
            is_verified: m.verified_by_curator,
            is_auto_generated: m.is_auto_generated,
            weight: m.weight,
            relevance_score: scoreData?.score ?? null,
            ai_reasoning: scoreData?.reasoning ?? null
          };
        });

        return {
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          category: milestone.category,
          target_month: milestone.target_month,
          source: milestone.source,
          linked_questions: linkedWithAutoFlag,
          candidate_questions: candidatesWithScores
        };
      });

      return {
        range_id: range.id,
        range_label: range.label,
        min_month: range.min,
        max_month: range.max,
        milestones: milestonesWithCandidates,
        milestones_count: milestonesWithCandidates.length
      };
    }).filter(range => range.milestones_count > 0);

    return res.status(200).json({
      success: true,
      data: result,
      total_milestones: milestones.length,
      age_ranges: AGE_RANGES
    });
  } catch (error) {
    console.error('Erro ao obter visão de curadoria:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter visão de curadoria',
      error: error.message
    });
  }
};

/**
 * Criar novo mapeamento (vincular pergunta a marco)
 */
const createMapping = async (req, res) => {
  try {
    // Aceita tanto milestone_id/question_id quanto official_milestone_id/journey_question_id
    const milestone_id = req.body.milestone_id || req.body.official_milestone_id;
    const question_id = req.body.question_id || req.body.journey_question_id;
    const { weight, notes } = req.body;

    if (!milestone_id || !question_id) {
      return res.status(400).json({
        success: false,
        message: 'milestone_id e question_id são obrigatórios'
      });
    }

    const milestone = await OfficialMilestone.findByPk(milestone_id);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Marco não encontrado'
      });
    }

    const question = await JourneyBotQuestion.findByPk(question_id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Pergunta não encontrada'
      });
    }

    const existingMapping = await MilestoneMapping.findOne({
      where: {
        official_milestone_id: milestone_id,
        journey_question_id: question_id
      }
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: 'Mapeamento já existe'
      });
    }

    const mapping = await MilestoneMapping.create({
      official_milestone_id: milestone_id,
      journey_question_id: question_id,
      weight: weight || 1.0,
      is_auto_generated: false,
      verified_by_curator: true,
      verified_at: new Date(),
      verified_by: req.user.id,
      notes: notes || null
    });

    console.log(`✅ Mapeamento criado: ${milestone.title} <-> ${question.domain_question}`);

    return res.status(201).json({
      success: true,
      message: 'Mapeamento criado com sucesso',
      data: mapping
    });
  } catch (error) {
    console.error('Erro ao criar mapeamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar mapeamento',
      error: error.message
    });
  }
};

/**
 * AI Matching: Classifica relevância de perguntas candidatas para cada marco
 * usando OpenAI como especialista em desenvolvimento infantil
 */
const runAIMatching = async (req, res) => {
  try {
    console.log('🤖 Iniciando AI Matching...');
    
    await ensureTablesExist();
    
    const { milestoneId } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const milestoneWhere = { is_active: true };
    if (milestoneId) {
      milestoneWhere.id = milestoneId;
    }

    const milestones = await OfficialMilestone.findAll({
      where: milestoneWhere,
      order: [['target_month', 'ASC']]
    });

    if (milestones.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum marco encontrado para processar'
      });
    }

    const allQuestions = await JourneyBotQuestion.findAll({
      where: { is_active: true },
      attributes: ['id', 'domain_name', 'domain_question', 'week', 'meta_min_months']
    });

    const existingMappings = await MilestoneMapping.findAll({
      attributes: ['official_milestone_id', 'journey_question_id']
    });
    const mappedPairs = new Set(
      existingMappings.map(m => `${m.official_milestone_id}:${m.journey_question_id}`)
    );

    let totalProcessed = 0;
    let autoLinked = 0;
    const results = [];

    for (const milestone of milestones) {
      const targetWeek = monthToWeeks(milestone.target_month);
      const minWeek = Math.max(0, targetWeek - 4);
      const maxWeek = targetWeek + 4;

      const candidateQuestions = allQuestions.filter(q => {
        const pairKey = `${milestone.id}:${q.id}`;
        if (mappedPairs.has(pairKey)) return false;
        
        const questionWeek = q.week || monthToWeeks(q.meta_min_months || 0);
        return questionWeek >= minWeek && questionWeek <= maxWeek;
      });

      if (candidateQuestions.length === 0) continue;

      console.log(`📊 Processando ${milestone.title} (${candidateQuestions.length} candidatas)`);

      for (const question of candidateQuestions) {
        try {
          const prompt = `Atue como um Pediatra Especialista em Desenvolvimento Infantil.
Analise se a 'Pergunta do App' serve como evidência de que a criança atingiu o 'Marco Oficial'.

**Marco Oficial:** ${milestone.title}
${milestone.description ? `**Descrição Clínica:** ${milestone.description}` : ''}
**Categoria:** ${milestone.category}
**Idade Esperada:** ${milestone.target_month} meses

**Pergunta do App:** "${question.domain_question}"
**Domínio da Pergunta:** ${question.domain_name || 'Não especificado'}

Dê uma nota de 0 a 5:
5 = Evidência Perfeita - A pergunta mede EXATAMENTE o marco
4 = Fortemente Relacionada - A pergunta indica alta probabilidade do marco
3 = Relacionada - A pergunta tem relação moderada com o marco
2 = Fracamente Relacionada - Apenas tangencialmente relacionada
1 = Muito Fraca - Quase nenhuma relação
0 = Sem Relação - Não há conexão entre pergunta e marco

IMPORTANTE: Uma pergunta de domínio diferente (ex: Social) PODE evidenciar um marco de outro domínio (ex: Cognitivo) se houver correlação funcional.

Retorne APENAS um JSON válido no formato: {"score": <número 0-5>, "reason": "<justificativa breve em português>"}`;

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 200,
            response_format: { type: 'json_object' }
          });

          const responseText = completion.choices[0]?.message?.content || '{}';
          let parsed;
          try {
            parsed = JSON.parse(responseText);
          } catch {
            console.error('Erro ao parsear resposta:', responseText);
            parsed = { score: 0, reason: 'Erro ao processar resposta da IA' };
          }

          const score = Math.min(5, Math.max(0, parseInt(parsed.score) || 0));
          const reason = parsed.reason || '';

          await MilestoneCandidateScore.upsert({
            official_milestone_id: milestone.id,
            journey_question_id: question.id,
            relevance_score: score,
            ai_reasoning: reason
          });

          totalProcessed++;

          if (score === 5) {
            const existsMapping = await MilestoneMapping.findOne({
              where: {
                official_milestone_id: milestone.id,
                journey_question_id: question.id
              }
            });

            if (!existsMapping) {
              await MilestoneMapping.create({
                official_milestone_id: milestone.id,
                journey_question_id: question.id,
                weight: 1.0,
                is_auto_generated: true,
                verified_by_curator: false,
                notes: `Auto-vinculado por IA (score 5): ${reason}`
              });
              autoLinked++;
              console.log(`  ⭐ Auto-vinculado: ${question.domain_question} -> ${milestone.title}`);
            }
          }

        } catch (err) {
          console.error(`Erro ao processar pergunta ${question.id}:`, err.message);
        }
      }

      results.push({
        milestone: milestone.title,
        category: milestone.category,
        processed: candidateQuestions.length
      });
    }

    console.log(`✅ AI Matching concluído: ${totalProcessed} pares processados, ${autoLinked} auto-vinculados`);

    return res.status(200).json({
      success: true,
      message: 'AI Matching concluído com sucesso',
      totalProcessed,
      autoLinked,
      details: results
    });

  } catch (error) {
    console.error('❌ Erro no AI Matching:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao executar AI Matching',
      error: error.message
    });
  }
};

module.exports = {
  seedOfficialMilestones,
  autoLinkMilestones,
  listMilestones,
  listMappings,
  verifyMapping,
  deleteMapping,
  getMilestonesChart,
  getCurationStats,
  getCurationView,
  createMapping,
  runAIMatching
};
