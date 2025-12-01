const { Activity } = require('../models');
const { Op } = require('sequelize');

// Listar atividades com filtros e paginação
const getActivities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      difficulty_level,
      min_age_months,
      max_age_months,
      is_active
    } = req.query;

    // Construir filtros
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty_level) {
      where.difficulty_level = difficulty_level;
    }

    if (min_age_months !== undefined) {
      where.min_age_months = { [Op.gte]: parseInt(min_age_months) };
    }

    if (max_age_months !== undefined) {
      where.max_age_months = { [Op.lte]: parseInt(max_age_months) };
    }

    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    // Calcular offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Buscar atividades
    const { count, rows: activities } = await Activity.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    // Calcular paginação
    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter atividade específica
const getActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Erro ao obter atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Criar nova atividade
const createActivity = async (req, res) => {
  try {
    const {
      title,
      description,
      min_age_months,
      max_age_months,
      category,
      difficulty_level,
      duration_minutes = 15,
      materials_needed = [],
      instructions = [],
      benefits = [],
      safety_tips = [],
      is_active = true
    } = req.body;

    // Validações básicas
    if (!title || !description || !category || !difficulty_level) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: title, description, category, difficulty_level'
      });
    }

    if (min_age_months >= max_age_months) {
      return res.status(400).json({
        success: false,
        message: 'Idade mínima deve ser menor que a idade máxima'
      });
    }

    // Criar atividade
    const activity = await Activity.create({
      title,
      description,
      min_age_months,
      max_age_months,
      category,
      difficulty_level,
      duration_minutes,
      materials_needed,
      instructions,
      benefits,
      safety_tips,
      is_active
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar atividade
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      min_age_months,
      max_age_months,
      category,
      difficulty_level,
      duration_minutes,
      materials_needed,
      instructions,
      benefits,
      safety_tips,
      is_active
    } = req.body;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    // Validar idades se fornecidas
    if (min_age_months !== undefined && max_age_months !== undefined) {
      if (min_age_months >= max_age_months) {
        return res.status(400).json({
          success: false,
          message: 'Idade mínima deve ser menor que a idade máxima'
        });
      }
    }

    // Atualizar campos fornecidos
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (min_age_months !== undefined) updateData.min_age_months = min_age_months;
    if (max_age_months !== undefined) updateData.max_age_months = max_age_months;
    if (category !== undefined) updateData.category = category;
    if (difficulty_level !== undefined) updateData.difficulty_level = difficulty_level;
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;
    if (materials_needed !== undefined) updateData.materials_needed = materials_needed;
    if (instructions !== undefined) updateData.instructions = instructions;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (safety_tips !== undefined) updateData.safety_tips = safety_tips;
    if (is_active !== undefined) updateData.is_active = is_active;

    await activity.update(updateData);

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Excluir atividade
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    await activity.destroy();

    res.json({
      success: true,
      message: 'Atividade excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Alternar status da atividade
const toggleActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    await activity.update({
      is_active: !activity.is_active
    });

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Erro ao alterar status da atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter estatísticas das atividades
const getActivityStats = async (req, res) => {
  try {
    // Total de atividades
    const totalActivities = await Activity.count();

    // Atividades ativas e inativas
    const activeActivities = await Activity.count({ where: { is_active: true } });
    const inactiveActivities = totalActivities - activeActivities;

    // Distribuição por categoria
    const categoryStats = await Activity.findAll({
      attributes: [
        'category',
        [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    // Distribuição por dificuldade
    const difficultyStats = await Activity.findAll({
      attributes: [
        'difficulty_level',
        [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']
      ],
      group: ['difficulty_level'],
      raw: true
    });

    // Distribuição por faixa etária (agrupada)
    const ageRangeStats = await Activity.findAll({
      attributes: [
        'min_age_months',
        'max_age_months',
        [Activity.sequelize.fn('COUNT', Activity.sequelize.col('id')), 'count']
      ],
      group: ['min_age_months', 'max_age_months'],
      raw: true
    });

    // Processar faixas etárias para agrupamento mais amigável
    const processedAgeRanges = ageRangeStats.map(stat => {
      const formatAge = (months) => {
        if (months < 12) return `${months}m`;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (remainingMonths === 0) return `${years}a`;
        return `${years}a${remainingMonths}m`;
      };
      
      return {
        age_range: `${formatAge(stat.min_age_months)} - ${formatAge(stat.max_age_months)}`,
        count: parseInt(stat.count)
      };
    });

    res.json({
      success: true,
      data: {
        total_activities: totalActivities,
        active_activities: activeActivities,
        inactive_activities: inactiveActivities,
        categories: categoryStats.map(stat => ({
          category: stat.category,
          count: parseInt(stat.count)
        })),
        difficulty_distribution: difficultyStats.map(stat => ({
          difficulty_level: stat.difficulty_level,
          count: parseInt(stat.count)
        })),
        age_range_distribution: processedAgeRanges
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas das atividades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter atividades para uma idade específica
const getActivitiesForAge = async (req, res) => {
  try {
    const { ageInMonths } = req.params;
    const age = parseInt(ageInMonths);

    if (isNaN(age) || age < 0 || age > 60) {
      return res.status(400).json({
        success: false,
        message: 'Idade deve ser um número entre 0 e 60 meses'
      });
    }

    const activities = await Activity.findAll({
      where: {
        min_age_months: { [Op.lte]: age },
        max_age_months: { [Op.gte]: age },
        is_active: true
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        activities
      }
    });
  } catch (error) {
    console.error('Erro ao obter atividades para idade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  toggleActivityStatus,
  getActivityStats,
  getActivitiesForAge
};
