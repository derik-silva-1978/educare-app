const { ContentItem, User } = require('../models');
const { Op } = require('sequelize');

const getPublishedContent = async (req, res) => {
  try {
    const { type, audience, limit = 10 } = req.query;
    
    const where = {
      status: 'published',
      [Op.or]: [
        { publish_date: null },
        { publish_date: { [Op.lte]: new Date() } }
      ],
      [Op.and]: [
        {
          [Op.or]: [
            { expire_date: null },
            { expire_date: { [Op.gte]: new Date() } }
          ]
        }
      ]
    };

    if (type) {
      where.type = type;
    }

    if (audience) {
      where.target_audience = { [Op.in]: ['all', audience] };
    }

    const content = await ContentItem.findAll({
      where,
      order: [
        ['sort_order', 'ASC'],
        ['publish_date', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }]
    });

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching published content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar conteúdo',
      error: error.message
    });
  }
};

const getAllContent = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const where = {};
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: content } = await ContentItem.findAndCountAll({
      where,
      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }]
    });

    res.json({
      success: true,
      data: content,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching all content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar conteúdo',
      error: error.message
    });
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await ContentItem.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }, {
        model: User,
        as: 'updater',
        attributes: ['id', 'name']
      }]
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content by id:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar conteúdo',
      error: error.message
    });
  }
};

const createContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      title,
      description,
      summary,
      image_url,
      category,
      duration,
      level,
      cta_url,
      cta_text,
      target_audience,
      status,
      publish_date,
      expire_date,
      sort_order,
      metadata
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'Tipo e título são obrigatórios'
      });
    }

    const content = await ContentItem.create({
      type,
      title,
      description,
      summary,
      image_url,
      category,
      duration,
      level,
      cta_url,
      cta_text,
      target_audience: target_audience || 'all',
      status: status || 'draft',
      publish_date,
      expire_date,
      sort_order: sort_order || 0,
      metadata,
      created_by: userId
    });

    res.status(201).json({
      success: true,
      message: 'Conteúdo criado com sucesso',
      data: content
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conteúdo',
      error: error.message
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const content = await ContentItem.findByPk(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }

    const {
      type,
      title,
      description,
      summary,
      image_url,
      category,
      duration,
      level,
      cta_url,
      cta_text,
      target_audience,
      status,
      publish_date,
      expire_date,
      sort_order,
      metadata
    } = req.body;

    await content.update({
      type: type || content.type,
      title: title || content.title,
      description: description !== undefined ? description : content.description,
      summary: summary !== undefined ? summary : content.summary,
      image_url: image_url !== undefined ? image_url : content.image_url,
      category: category !== undefined ? category : content.category,
      duration: duration !== undefined ? duration : content.duration,
      level: level !== undefined ? level : content.level,
      cta_url: cta_url !== undefined ? cta_url : content.cta_url,
      cta_text: cta_text !== undefined ? cta_text : content.cta_text,
      target_audience: target_audience || content.target_audience,
      status: status || content.status,
      publish_date: publish_date !== undefined ? publish_date : content.publish_date,
      expire_date: expire_date !== undefined ? expire_date : content.expire_date,
      sort_order: sort_order !== undefined ? sort_order : content.sort_order,
      metadata: metadata !== undefined ? metadata : content.metadata,
      updated_by: userId
    });

    res.json({
      success: true,
      message: 'Conteúdo atualizado com sucesso',
      data: content
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar conteúdo',
      error: error.message
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await ContentItem.findByPk(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }

    await content.destroy();

    res.json({
      success: true,
      message: 'Conteúdo excluído com sucesso'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir conteúdo',
      error: error.message
    });
  }
};

const updateContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const content = await ContentItem.findByPk(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }

    await content.update({
      status,
      updated_by: userId,
      publish_date: status === 'published' && !content.publish_date ? new Date() : content.publish_date
    });

    res.json({
      success: true,
      message: `Conteúdo ${status === 'published' ? 'publicado' : status === 'archived' ? 'arquivado' : 'salvo como rascunho'} com sucesso`,
      data: content
    });
  } catch (error) {
    console.error('Error updating content status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do conteúdo',
      error: error.message
    });
  }
};

const getPublicContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await ContentItem.findOne({
      where: {
        id,
        status: 'published',
        [Op.or]: [
          { publish_date: null },
          { publish_date: { [Op.lte]: new Date() } }
        ]
      },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }]
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado ou não publicado'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching public content by id:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar conteúdo',
      error: error.message
    });
  }
};

const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await ContentItem.findByPk(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }

    await content.increment('view_count');

    res.json({
      success: true,
      message: 'Visualização registrada'
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar visualização',
      error: error.message
    });
  }
};

module.exports = {
  getPublishedContent,
  getAllContent,
  getContentById,
  getPublicContentById,
  incrementViewCount,
  createContent,
  updateContent,
  deleteContent,
  updateContentStatus
};
