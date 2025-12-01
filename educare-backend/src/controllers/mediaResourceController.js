const MediaResource = require('../models/MediaResource');
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

/**
 * Controller para gerenciamento de recursos audiovisuais
 */
class MediaResourceController {
  /**
   * Listar todos os recursos com filtros
   */
  async list(req, res) {
    try {
      const {
        type,
        category,
        is_active,
        is_public,
        search,
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const where = {};
      
      // Filtros
      if (type) where.resource_type = type;
      if (category) where.category = category;
      if (is_active !== undefined) where.is_active = is_active === 'true';
      if (is_public !== undefined) where.is_public = is_public === 'true';
      
      // Busca por título ou descrição
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await MediaResource.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sort_by, sort_order]]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar recursos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar recursos',
        error: error.message
      });
    }
  }

  /**
   * Buscar recurso por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const resource = await MediaResource.findByPk(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      // Incrementar contador de visualizações
      await resource.increment('view_count');

      res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      console.error('Erro ao buscar recurso:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar recurso',
        error: error.message
      });
    }
  }

  /**
   * Criar novo recurso
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const resourceData = {
        ...req.body,
        created_by: userId,
        updated_by: userId
      };

      // Processar tags se vier como string JSON
      if (resourceData.tags && typeof resourceData.tags === 'string') {
        try {
          resourceData.tags = JSON.parse(resourceData.tags);
        } catch (e) {
          resourceData.tags = [];
        }
      }

      // Se houver arquivo, processar
      if (req.file) {
        resourceData.file_url = `/uploads/${req.file.filename}`;
        resourceData.file_name = req.file.originalname;
        resourceData.file_size = req.file.size;
        resourceData.mime_type = req.file.mimetype;
      }

      const resource = await MediaResource.create(resourceData);

      res.status(201).json({
        success: true,
        message: 'Recurso criado com sucesso',
        data: resource
      });
    } catch (error) {
      console.error('Erro ao criar recurso:', error);
      
      // Se houver erro e arquivo foi enviado, deletar o arquivo
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao deletar arquivo:', unlinkError);
        }
      }

      res.status(400).json({
        success: false,
        message: 'Erro ao criar recurso',
        error: error.message
      });
    }
  }

  /**
   * Atualizar recurso
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const resource = await MediaResource.findByPk(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      const updateData = {
        ...req.body,
        updated_by: userId
      };

      // Se houver novo arquivo
      if (req.file) {
        // Deletar arquivo antigo se existir
        if (resource.file_url) {
          const oldFilePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(resource.file_url));
          try {
            await fs.unlink(oldFilePath);
          } catch (error) {
            console.error('Erro ao deletar arquivo antigo:', error);
          }
        }

        updateData.file_url = `/uploads/${req.file.filename}`;
        updateData.file_name = req.file.originalname;
        updateData.file_size = req.file.size;
        updateData.mime_type = req.file.mimetype;
      }

      await resource.update(updateData);

      res.json({
        success: true,
        message: 'Recurso atualizado com sucesso',
        data: resource
      });
    } catch (error) {
      console.error('Erro ao atualizar recurso:', error);
      
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao deletar arquivo:', unlinkError);
        }
      }

      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar recurso',
        error: error.message
      });
    }
  }

  /**
   * Deletar recurso
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const resource = await MediaResource.findByPk(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      // Deletar arquivo se existir
      if (resource.file_url) {
        const filePath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(resource.file_url));
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Erro ao deletar arquivo:', error);
        }
      }

      await resource.destroy();

      res.json({
        success: true,
        message: 'Recurso deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar recurso:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar recurso',
        error: error.message
      });
    }
  }

  /**
   * Gerar áudio via TTS
   */
  async generateTTS(req, res) {
    try {
      const { id } = req.params;
      const { text, voice } = req.body;

      const resource = await MediaResource.findByPk(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
      }

      if (!resource.tts_enabled || !resource.tts_endpoint) {
        return res.status(400).json({
          success: false,
          message: 'TTS não está habilitado para este recurso'
        });
      }

      // Fazer requisição para o endpoint TTS
      const fetch = require('node-fetch');
      const ttsResponse = await fetch(resource.tts_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text || resource.content,
          voice: voice || resource.tts_voice || 'default'
        })
      });

      if (!ttsResponse.ok) {
        throw new Error('Erro ao gerar áudio via TTS');
      }

      const audioData = await ttsResponse.json();

      res.json({
        success: true,
        message: 'Áudio gerado com sucesso',
        data: audioData
      });
    } catch (error) {
      console.error('Erro ao gerar TTS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar áudio via TTS',
        error: error.message
      });
    }
  }

  /**
   * Obter estatísticas dos recursos
   */
  async getStats(req, res) {
    try {
      const stats = await MediaResource.findAll({
        attributes: [
          'resource_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('view_count')), 'total_views']
        ],
        group: ['resource_type']
      });

      const totalResources = await MediaResource.count();
      const activeResources = await MediaResource.count({ where: { is_active: true } });
      const publicResources = await MediaResource.count({ where: { is_public: true } });

      res.json({
        success: true,
        data: {
          by_type: stats,
          total: totalResources,
          active: activeResources,
          public: publicResources
        }
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas',
        error: error.message
      });
    }
  }

  /**
   * Buscar recursos por categoria
   */
  async getByCategory(req, res) {
    try {
      const { category } = req.params;

      const resources = await MediaResource.findAll({
        where: {
          category,
          is_active: true
        },
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: resources
      });
    } catch (error) {
      console.error('Erro ao buscar recursos por categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar recursos',
        error: error.message
      });
    }
  }
}

module.exports = new MediaResourceController();
