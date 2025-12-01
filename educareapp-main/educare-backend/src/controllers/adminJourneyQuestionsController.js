const { JourneyBotQuestion } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Listar todas as perguntas com filtros
exports.listQuestions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      min_age_months, 
      max_age_months, 
      is_active,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filtros
    if (category) where.domain_name = category;
    
    // Filtro de idade: buscar perguntas que se aplicam à faixa etária
    // Exemplo: criança de 3 meses deve ver perguntas de 0-6 meses
    // Lógica: meta_min_months <= idade_crianca AND meta_max_months >= idade_crianca
    if (min_age_months && max_age_months) {
      // Quando ambos são fornecidos, buscar perguntas que se sobrepõem à faixa
      where[Op.and] = [
        { meta_min_months: { [Op.lte]: parseInt(max_age_months) } },
        { meta_max_months: { [Op.gte]: parseInt(min_age_months) } }
      ];
    } else if (min_age_months) {
      // Apenas idade mínima: perguntas que terminam depois dessa idade
      where.meta_max_months = { [Op.gte]: parseInt(min_age_months) };
    } else if (max_age_months) {
      // Apenas idade máxima: perguntas que começam antes dessa idade
      where.meta_min_months = { [Op.lte]: parseInt(max_age_months) };
    }
    
    if (is_active !== undefined) where.is_active = is_active === 'true';
    if (search) {
      where[Op.or] = [
        { domain_question: { [Op.iLike]: `%${search}%` } },
        { domain_name: { [Op.iLike]: `%${search}%` } },
        { meta_title: { [Op.iLike]: `%${search}%` } },
        { week_title: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await JourneyBotQuestion.findAndCountAll({
      where,
      order: [['meta_min_months', 'ASC'], ['week', 'ASC'], ['order_index', 'ASC'], ['created_at', 'DESC']],
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
    console.error('Erro ao listar perguntas:', error);
    return res.status(500).json({ error: 'Erro ao listar perguntas' });
  }
};

// Obter pergunta por ID
exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await JourneyBotQuestion.findByPk(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    return res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    return res.status(500).json({ error: 'Erro ao buscar pergunta' });
  }
};

// Criar nova pergunta
exports.createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const questionData = {
      id: uuidv4(),
      ...req.body
    };

    const question = await JourneyBotQuestion.create(questionData);

    return res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    return res.status(500).json({ error: 'Erro ao criar pergunta' });
  }
};

// Atualizar pergunta
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const question = await JourneyBotQuestion.findByPk(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    await question.update(req.body);

    return res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    return res.status(500).json({ error: 'Erro ao atualizar pergunta' });
  }
};

// Excluir pergunta
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await JourneyBotQuestion.findByPk(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    await question.destroy();

    return res.status(200).json({ success: true, message: 'Pergunta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pergunta:', error);
    return res.status(500).json({ error: 'Erro ao excluir pergunta' });
  }
};

// Buscar quizzes de uma semana específica
exports.getWeekQuizzes = async (req, res) => {
  try {
    const { weekNumber } = req.params;
    const { min_age_months, max_age_months } = req.query;
    
    console.log(`[getWeekQuizzes] Buscando quizzes para semana ${weekNumber}, idade ${min_age_months}-${max_age_months} meses`);
    
    if (!weekNumber) {
      return res.status(400).json({ 
        success: false,
        error: 'Número da semana é obrigatório' 
      });
    }
    
    const { JourneyV2Quiz, JourneyV2Week } = require('../models');
    
    // Buscar semana que corresponde ao número e faixa etária
    const weeks = await JourneyV2Week.findAll({
      where: {
        week_number: parseInt(weekNumber),
        ...(min_age_months && max_age_months ? {
          [Op.and]: [
            { min_age_months: { [Op.lte]: parseInt(max_age_months) } },
            { max_age_months: { [Op.gte]: parseInt(min_age_months) } }
          ]
        } : {})
      }
    });
    
    console.log(`[getWeekQuizzes] Encontradas ${weeks.length} semanas`);
    
    if (weeks.length === 0) {
      console.log(`[getWeekQuizzes] Nenhuma semana encontrada, retornando array vazio`);
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Buscar quizzes dessas semanas
    const weekIds = weeks.map(w => w.id);
    const quizzes = await JourneyV2Quiz.findAll({
      where: {
        week_id: { [Op.in]: weekIds }
      },
      order: [['created_at', 'ASC']]
    });
    
    console.log(`[getWeekQuizzes] Encontrados ${quizzes.length} quizzes`);
    
    return res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    console.error('[getWeekQuizzes] Erro ao buscar quizzes da semana:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar quizzes',
      details: error.message 
    });
  }
};

// Importar perguntas via CSV
exports.importFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo CSV é obrigatório' });
    }

    const results = [];
    const errors = [];
    let lineNumber = 1;

    // Ler e processar CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        lineNumber++;
        try {
          // Validar campos obrigatórios
          if (!data.question_text || !data.min_age_months || !data.max_age_months || !data.category) {
            errors.push({
              line: lineNumber,
              error: 'Campos obrigatórios: question_text, min_age_months, max_age_months, category'
            });
            return;
          }

          // Processar opções (se existir)
          let options = null;
          if (data.options) {
            try {
              options = JSON.parse(data.options);
            } catch (e) {
              options = data.options.split('|').map(opt => ({ value: opt.trim(), label: opt.trim() }));
            }
          }

          const questionData = {
            id: uuidv4(),
            question_text: data.question_text,
            question_type: data.question_type || 'multiple_choice',
            options: options,
            min_age_months: parseInt(data.min_age_months),
            max_age_months: parseInt(data.max_age_months),
            category: data.category,
            order_index: parseInt(data.order_index) || 0,
            is_active: data.is_active !== 'false',
            feedback_positive: data.feedback_positive || null,
            feedback_negative: data.feedback_negative || null,
            feedback_neutral: data.feedback_neutral || null,
            tips: data.tips ? JSON.parse(data.tips) : null
          };

          results.push(questionData);
        } catch (error) {
          errors.push({
            line: lineNumber,
            error: error.message
          });
        }
      })
      .on('end', async () => {
        try {
          // Inserir perguntas válidas
          if (results.length > 0) {
            await JourneyBotQuestion.bulkCreate(results);
          }

          // Limpar arquivo temporário
          fs.unlinkSync(req.file.path);

          return res.status(200).json({
            success: true,
            message: `${results.length} perguntas importadas com sucesso`,
            imported: results.length,
            errors: errors.length,
            errorDetails: errors
          });
        } catch (error) {
          console.error('Erro ao importar perguntas:', error);
          return res.status(500).json({ error: 'Erro ao importar perguntas' });
        }
      });

  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    return res.status(500).json({ error: 'Erro ao processar arquivo CSV' });
  }
};

// Exportar perguntas para CSV
exports.exportToCSV = async (req, res) => {
  try {
    const questions = await JourneyBotQuestion.findAll({
      order: [['meta_min_months', 'ASC'], ['week', 'ASC'], ['order_index', 'ASC']]
    });

    // Converter para CSV com todos os campos
    const csvData = questions.map(q => ({
      id: q.id,
      // Metadados
      meta_title: q.meta_title || '',
      meta_min_months: q.meta_min_months,
      meta_max_months: q.meta_max_months,
      meta_description: q.meta_description || '',
      // Dados da semana
      week: q.week || '',
      week_title: q.week_title || '',
      week_description: q.week_description || '',
      // Gamificação - Boas-vindas
      gamification_welcome_title: q.gamification_welcome_title || '',
      gamification_welcome_message: q.gamification_welcome_message || '',
      // Gamificação - Badge
      gamification_badge_name: q.gamification_badge_name || '',
      gamification_badge_description: q.gamification_badge_description || '',
      // Gamificação - Progresso
      gamification_progress_message: q.gamification_progress_message || '',
      // Gamificação - Desafio semanal
      gamification_weekly_challenge_title: q.gamification_weekly_challenge_title || '',
      gamification_weekly_challenge_description: q.gamification_weekly_challenge_description || '',
      // Gamificação - Dicas
      gamification_tips: q.gamification_tips || '',
      // Gamificação - Mensagem de encerramento
      gamification_closing_message_title: q.gamification_closing_message_title || '',
      gamification_closing_message_message: q.gamification_closing_message_message || '',
      // Gamificação - Registro afetivo
      gamification_registro_afetivo_question: q.gamification_registro_afetivo_question || '',
      gamification_registro_afetivo_options: q.gamification_registro_afetivo_options || '',
      // Gamificação - Mensagem personalizada
      gamification_personalized_message_title: q.gamification_personalized_message_title || '',
      gamification_personalized_message_message: q.gamification_personalized_message_message || '',
      // Dados da pergunta principal
      domain_name: q.domain_name,
      domain_question: q.domain_question,
      domain_importance: q.domain_importance || '',
      // Feedbacks
      domain_feedback_1: q.domain_feedback_1 || '',
      domain_feedback_2: q.domain_feedback_2 || '',
      domain_feedback_3: q.domain_feedback_3 || '',
      // Atividades e alertas
      domain_activities: q.domain_activities || '',
      domain_alert_missing: q.domain_alert_missing || '',
      // Campos de controle
      order_index: q.order_index,
      is_active: q.is_active,
      created_at: q.created_at,
      updated_at: q.updated_at
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=journey_questions.csv');
    
    // Cabeçalhos CSV
    const headers = Object.keys(csvData[0] || {}).join(',');
    let csvContent = headers + '\n';
    
    // Dados CSV
    csvData.forEach(row => {
      const values = Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      );
      csvContent += values.join(',') + '\n';
    });

    return res.send(csvContent);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return res.status(500).json({ error: 'Erro ao exportar CSV' });
  }
};

// Obter estatísticas das perguntas
exports.getStatistics = async (req, res) => {
  try {
    const totalQuestions = await JourneyBotQuestion.count();
    const activeQuestions = await JourneyBotQuestion.count({ where: { is_active: true } });
    
    const questionsByCategory = await JourneyBotQuestion.findAll({
      attributes: [
        'domain_name',
        [JourneyBotQuestion.sequelize.fn('COUNT', JourneyBotQuestion.sequelize.col('id')), 'count']
      ],
      group: ['domain_name'],
      raw: true
    });

    const questionsByAgeRange = await JourneyBotQuestion.findAll({
      attributes: [
        'meta_min_months',
        'meta_max_months',
        [JourneyBotQuestion.sequelize.fn('COUNT', JourneyBotQuestion.sequelize.col('id')), 'count']
      ],
      group: ['meta_min_months', 'meta_max_months'],
      order: [['meta_min_months', 'ASC']],
      raw: true
    });

    const questionsByWeek = await JourneyBotQuestion.findAll({
      attributes: [
        'week',
        'week_title',
        [JourneyBotQuestion.sequelize.fn('COUNT', JourneyBotQuestion.sequelize.col('id')), 'count']
      ],
      group: ['week', 'week_title'],
      order: [['week', 'ASC']],
      raw: true
    });

    return res.status(200).json({
      success: true,
      data: {
        total: totalQuestions,
        active: activeQuestions,
        inactive: totalQuestions - activeQuestions,
        byCategory: questionsByCategory.map(item => ({
          category: item.domain_name,
          count: parseInt(item.count)
        })),
        byAgeRange: questionsByAgeRange.map(item => ({
          min_age_months: item.meta_min_months,
          max_age_months: item.meta_max_months,
          count: parseInt(item.count)
        })),
        byWeek: questionsByWeek.map(item => ({
          week: item.week,
          week_title: item.week_title,
          count: parseInt(item.count)
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
};
