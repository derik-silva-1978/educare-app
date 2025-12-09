const { Op } = require('sequelize');
const KbBaby = require('../models/KbBaby');
const KbMother = require('../models/KbMother');
const KbProfessional = require('../models/KbProfessional');
const KnowledgeDocument = require('../models/KnowledgeDocument');

class KnowledgeBaseRepository {
  
  async insertBabyDoc(data) {
    try {
      const document = await KbBaby.create(data);
      return { success: true, data: document };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] insertBabyDoc error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async insertMotherDoc(data) {
    try {
      const document = await KbMother.create(data);
      return { success: true, data: document };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] insertMotherDoc error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async insertProfessionalDoc(data) {
    try {
      const document = await KbProfessional.create(data);
      return { success: true, data: document };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] insertProfessionalDoc error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async queryBaby(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      const documents = await KbBaby.findAll({
        where,
        attributes: ['id', 'title', 'content', 'file_search_id', 'tags', 'age_range', 'domain', 'source_type'],
        order: [['created_at', 'DESC']],
        limit: filters.limit || 10
      });
      return { success: true, data: documents, count: documents.length };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] queryBaby error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async queryMother(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      if (filters.trimester) where.trimester = filters.trimester;
      const documents = await KbMother.findAll({
        where,
        attributes: ['id', 'title', 'content', 'file_search_id', 'tags', 'trimester', 'domain', 'source_type'],
        order: [['created_at', 'DESC']],
        limit: filters.limit || 10
      });
      return { success: true, data: documents, count: documents.length };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] queryMother error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async queryProfessional(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      if (filters.specialty) where.specialty = filters.specialty;
      const documents = await KbProfessional.findAll({
        where,
        attributes: ['id', 'title', 'content', 'file_search_id', 'tags', 'specialty', 'domain', 'source_type'],
        order: [['created_at', 'DESC']],
        limit: filters.limit || 10
      });
      return { success: true, data: documents, count: documents.length };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] queryProfessional error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async queryByTable(tableName, filters = {}) {
    switch (tableName) {
      case 'kb_baby':
        return this.queryBaby(filters);
      case 'kb_mother':
        return this.queryMother(filters);
      case 'kb_professional':
        return this.queryProfessional(filters);
      case 'knowledge_documents':
        return this._queryLegacy(filters);
      default:
        return { success: false, error: `Unknown table: ${tableName}` };
    }
  }

  async insertByCategory(category, data) {
    switch (category) {
      case 'baby':
        return this.insertBabyDoc(data);
      case 'mother':
        return this.insertMotherDoc(data);
      case 'professional':
        return this.insertProfessionalDoc(data);
      default:
        return { success: false, error: `Unknown category: ${category}` };
    }
  }

  async countByTable(tableName) {
    try {
      let count = 0;
      switch (tableName) {
        case 'kb_baby':
          count = await KbBaby.count({ where: { is_active: true } });
          break;
        case 'kb_mother':
          count = await KbMother.count({ where: { is_active: true } });
          break;
        case 'kb_professional':
          count = await KbProfessional.count({ where: { is_active: true } });
          break;
        case 'knowledge_documents':
          count = await KnowledgeDocument.count({ where: { is_active: true } });
          break;
        default:
          return { success: false, error: `Unknown table: ${tableName}` };
      }
      return { success: true, count };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] countByTable error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async _queryLegacy(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      const documents = await KnowledgeDocument.findAll({
        where,
        attributes: ['id', 'title', 'file_search_id', 'tags', 'age_range', 'domain', 'source_type'],
        order: [['created_at', 'DESC']],
        limit: filters.limit || 10
      });
      return { success: true, data: documents, count: documents.length };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] _queryLegacy error:', error.message);
      return { success: false, error: error.message };
    }
  }

  _buildWhereClause(filters) {
    const where = { is_active: true };
    
    if (filters.age_range) where.age_range = filters.age_range;
    if (filters.domain) where.domain = filters.domain;
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { [Op.overlap]: filters.tags };
    }
    if (filters.source_type) where.source_type = filters.source_type;
    
    return where;
  }
}

module.exports = new KnowledgeBaseRepository();
