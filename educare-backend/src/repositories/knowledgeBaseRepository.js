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
      console.log('[KnowledgeBaseRepository] queryProfessional - where:', JSON.stringify(where));
      const documents = await KbProfessional.findAll({
        where,
        attributes: ['id', 'title', 'content', 'file_search_id', 'tags', 'specialty', 'domain', 'source_type'],
        order: [['created_at', 'DESC']],
        limit: filters.limit || 10
      });
      console.log('[KnowledgeBaseRepository] queryProfessional - encontrados:', documents.length);
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

  async insertDualWithCategory(category, legacyData, segmentedData = null) {
    const transaction = null;
    try {
      // Always insert into legacy table for backward compatibility
      const legacyResult = await KnowledgeDocument.create(legacyData);
      
      if (!segmentedData) {
        return { 
          success: true, 
          data: { 
            legacy: legacyResult, 
            segmented: null 
          } 
        };
      }

      // Add reference to legacy document
      segmentedData.migrated_from = legacyResult.id;

      // Insert into appropriate segmented table
      let segmentedResult = null;
      switch (category) {
        case 'baby':
          segmentedResult = await KbBaby.create(segmentedData);
          break;
        case 'mother':
          segmentedResult = await KbMother.create(segmentedData);
          break;
        case 'professional':
          segmentedResult = await KbProfessional.create(segmentedData);
          break;
        case 'landing':
          segmentedResult = legacyResult;
          break;
        default:
          return { 
            success: true, 
            data: { 
              legacy: legacyResult, 
              segmented: null 
            },
            warning: `Unknown category: ${category}. Document saved to legacy table only.`
          };
      }

      return { 
        success: true, 
        data: { 
          legacy: legacyResult, 
          segmented: segmentedResult 
        } 
      };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] insertDualWithCategory error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async insertMultiCategory(categories, legacyData, baseSegmentedData) {
    try {
      const legacyResult = await KnowledgeDocument.create(legacyData);
      const segmentedResults = [];

      for (const cat of categories) {
        const segData = {
          title: baseSegmentedData.title,
          content: baseSegmentedData.content || '',
          description: baseSegmentedData.description,
          source_type: baseSegmentedData.source_type,
          file_search_id: baseSegmentedData.file_search_id,
          file_path: baseSegmentedData.file_path,
          original_filename: baseSegmentedData.original_filename,
          file_size: baseSegmentedData.file_size,
          mime_type: baseSegmentedData.mime_type,
          tags: baseSegmentedData.tags,
          is_active: baseSegmentedData.is_active,
          created_by: baseSegmentedData.created_by,
          metadata: baseSegmentedData.metadata,
          migrated_from: legacyResult.id,
          domain: baseSegmentedData.domain
        };

        if (cat === 'baby') {
          segData.age_range = baseSegmentedData.age_range;
          segData.subcategory = baseSegmentedData.subcategory;
        } else if (cat === 'mother') {
          segData.trimester = baseSegmentedData.trimester;
          segData.subcategory = baseSegmentedData.subcategory;
        } else if (cat === 'professional') {
          segData.specialty = baseSegmentedData.specialty;
          segData.subcategory = baseSegmentedData.subcategory;
        }

        try {
          let result = null;
          switch (cat) {
            case 'baby':
              result = await KbBaby.create(segData);
              break;
            case 'mother':
              result = await KbMother.create(segData);
              break;
            case 'professional':
              result = await KbProfessional.create(segData);
              break;
            case 'landing':
              result = legacyResult;
              break;
          }
          if (result) segmentedResults.push({ category: cat, id: result.id });
        } catch (segErr) {
          console.warn(`[KnowledgeBaseRepository] insertMultiCategory - falha em ${cat}:`, segErr.message);
        }
      }

      return {
        success: true,
        data: { legacy: legacyResult, segmented: segmentedResults }
      };
    } catch (error) {
      console.error('[KnowledgeBaseRepository] insertMultiCategory error:', error.message);
      return { success: false, error: error.message };
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
