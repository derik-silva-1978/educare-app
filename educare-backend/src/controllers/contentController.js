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

const generateAIContent = async (req, res) => {
  try {
    const { type = 'news', target_audience = 'all', topic, language = 'pt-BR' } = req.body;

    if (!['news', 'training', 'course'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo invalido. Use: news, training ou course'
      });
    }

    if (!['all', 'parents', 'professionals'].includes(target_audience)) {
      return res.status(400).json({
        success: false,
        message: 'Publico-alvo invalido. Use: all, parents ou professionals'
      });
    }

    const OpenAI = require('openai');
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key nao configurada'
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const typeLabels = {
      news: 'noticia informativa',
      training: 'treinamento educacional',
      course: 'curso estruturado'
    };

    const audienceLabels = {
      all: 'publico geral (pais e profissionais)',
      parents: 'pais e cuidadores',
      professionals: 'profissionais de saude e educacao'
    };

    const topicInstruction = topic
      ? `O tema principal deve ser: "${topic}".`
      : 'Escolha um tema relevante e atual sobre desenvolvimento infantil ou saude materna.';

    const systemPrompt = `Voce e um redator de conteudo especializado para a plataforma Educare+, focada em desenvolvimento infantil (0-6 anos) e saude materna.

Crie um conteudo do tipo "${typeLabels[type]}" direcionado para "${audienceLabels[target_audience]}".
${topicInstruction}

O idioma do conteudo deve ser: ${language}.

Retorne APENAS um JSON valido (sem markdown, sem code blocks) com a seguinte estrutura:
{
  "title": "titulo atrativo e informativo",
  "summary": "resumo de 1-2 frases para exibicao em cards",
  "description": "conteudo completo em HTML rico com tags <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. Minimo de 3 paragrafos bem estruturados.",
  "category": "categoria do conteudo (ex: Desenvolvimento Motor, Saude Materna, Nutricao, etc)",
  "cta_text": "texto para o botao de acao (ex: Leia mais, Iniciar treinamento, Comece agora)"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Gere o conteudo conforme as instrucoes do sistema.` }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const rawContent = response.choices[0].message.content.trim();
    let parsed;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, rawContent);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar resposta da IA'
      });
    }

    res.json({
      success: true,
      data: {
        title: parsed.title || '',
        summary: parsed.summary || '',
        description: parsed.description || '',
        category: parsed.category || '',
        cta_text: parsed.cta_text || 'Saiba mais'
      }
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar conteudo com IA',
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
  updateContentStatus,
  generateAIContent
};
