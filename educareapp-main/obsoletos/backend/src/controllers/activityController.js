const Activity = require('../models/Activity');
const { Op } = require('sequelize');

const activityController = {
  // Listar atividades com filtros
  async listActivities(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        age_months,
        category,
        difficulty_level,
        search,
        is_active = true
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Construir filtros
      const whereClause = {};
      
      if (is_active !== undefined) {
        whereClause.is_active = is_active === 'true';
      }
      
      if (age_months) {
        whereClause.age_min_months = { [Op.lte]: parseInt(age_months) };
        whereClause.age_max_months = { [Op.gte]: parseInt(age_months) };
      }
      
      if (category) {
        whereClause.category = category;
      }
      
      if (difficulty_level) {
        whereClause.difficulty_level = parseInt(difficulty_level);
      }
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { instructions: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Activity.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset,
        include: [{
          model: require('../models/User'),
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }]
      });

      res.json({
        success: true,
        data: rows,
        meta: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
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
  },

  // Buscar atividades por faixa etária (para o TitiNauta)
  async getActivitiesByAge(req, res) {
    try {
      const { age_months, category, limit = 3 } = req.query;

      if (!age_months) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro age_months é obrigatório'
        });
      }

      const activities = await Activity.findByAgeRange(parseInt(age_months), {
        category,
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Erro ao buscar atividades por idade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Obter atividade por ID
  async getActivityById(req, res) {
    try {
      const { id } = req.params;

      const activity = await Activity.findByPk(id, {
        include: [{
          model: require('../models/User'),
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }]
      });

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
      console.error('Erro ao buscar atividade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Criar nova atividade
  async createActivity(req, res) {
    try {
      const {
        title,
        description,
        ageMinMonths,
        ageMaxMonths,
        category,
        difficultyLevel = 1,
        durationMinutes,
        materialsNeeded = [],
        instructions,
        benefits,
        safetyTips,
        variations,
        imageUrl,
        isActive = true
      } = req.body;

      // Validações básicas
      if (!title || !description || !instructions) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: title, description, instructions'
        });
      }

      if (ageMinMonths === undefined || ageMaxMonths === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Campos obrigatórios: ageMinMonths, ageMaxMonths'
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Campo obrigatório: category'
        });
      }

      const activity = await Activity.create({
        title,
        description,
        age_min_months: ageMinMonths,
        age_max_months: ageMaxMonths,
        category,
        difficulty_level: difficultyLevel,
        duration_minutes: durationMinutes,
        materials_needed: materialsNeeded,
        instructions,
        benefits,
        safety_tips: safetyTips,
        variations,
        image_url: imageUrl,
        is_active: isActive,
        created_by: req.user.id
      });

      res.status(201).json({
        success: true,
        data: activity,
        message: 'Atividade criada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Atualizar atividade
  async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        ageMinMonths,
        ageMaxMonths,
        category,
        difficultyLevel,
        durationMinutes,
        materialsNeeded,
        instructions,
        benefits,
        safetyTips,
        variations,
        imageUrl,
        isActive
      } = req.body;

      const activity = await Activity.findByPk(id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }

      const updateData = {};
      
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (ageMinMonths !== undefined) updateData.age_min_months = ageMinMonths;
      if (ageMaxMonths !== undefined) updateData.age_max_months = ageMaxMonths;
      if (category !== undefined) updateData.category = category;
      if (difficultyLevel !== undefined) updateData.difficulty_level = difficultyLevel;
      if (durationMinutes !== undefined) updateData.duration_minutes = durationMinutes;
      if (materialsNeeded !== undefined) updateData.materials_needed = materialsNeeded;
      if (instructions !== undefined) updateData.instructions = instructions;
      if (benefits !== undefined) updateData.benefits = benefits;
      if (safetyTips !== undefined) updateData.safety_tips = safetyTips;
      if (variations !== undefined) updateData.variations = variations;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      if (isActive !== undefined) updateData.is_active = isActive;

      await activity.update(updateData);

      res.json({
        success: true,
        data: activity,
        message: 'Atividade atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Deletar atividade (soft delete)
  async deleteActivity(req, res) {
    try {
      const { id } = req.params;

      const activity = await Activity.findByPk(id);

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Atividade não encontrada'
        });
      }

      await activity.update({ is_active: false });

      res.json({
        success: true,
        message: 'Atividade desativada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Obter categorias disponíveis
  async getCategories(req, res) {
    try {
      const categories = Activity.getCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Obter níveis de dificuldade
  async getDifficultyLevels(req, res) {
    try {
      const levels = Activity.getDifficultyLevels();
      res.json({
        success: true,
        data: levels
      });
    } catch (error) {
      console.error('Erro ao buscar níveis de dificuldade:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  // Estatísticas de atividades
  async getActivityStats(req, res) {
    try {
      const totalActivities = await Activity.count({
        where: { is_active: true }
      });

      const activitiesByCategory = await Activity.findAll({
        attributes: [
          'category',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        where: { is_active: true },
        group: ['category'],
        raw: true
      });

      const activitiesByAgeRange = await Activity.findAll({
        attributes: [
          'age_min_months',
          'age_max_months',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        where: { is_active: true },
        group: ['age_min_months', 'age_max_months'],
        order: [['age_min_months', 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          totalActivities,
          activitiesByCategory,
          activitiesByAgeRange
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
};

module.exports = activityController;
