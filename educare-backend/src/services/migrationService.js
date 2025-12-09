/**
 * Migration Service
 * Utilitários para migrar documentos da base legado para tabelas segmentadas
 */

const { KnowledgeDocument, KnowledgeBaby, KnowledgeMother, KnowledgeProfessional } = require('../models');
const { sequelize } = require('../config/database');
const knowledgeBaseRepository = require('../repositories/knowledgeBaseRepository');

/**
 * Analisa documentos da base legado e classifica por categoria
 */
async function analyzeAndClassifyDocuments() {
  try {
    const allDocs = await KnowledgeDocument.findAll({
      raw: true,
      attributes: ['id', 'title', 'content', 'domain', 'age_range', 'specialty', 'tags']
    });

    const classified = {
      baby: [],
      mother: [],
      professional: [],
      ambiguous: []
    };

    allDocs.forEach(doc => {
      let category = null;

      // Inferência baseada em campos
      if (doc.age_range || (doc.domain && ['cognitive', 'motor', 'social', 'language'].includes(doc.domain))) {
        category = 'baby';
      } else if (doc.specialty && ['obstetrics', 'nutrition', 'mental_health', 'postpartum'].includes(doc.specialty)) {
        category = 'mother';
      } else if (doc.specialty && ['pediatrics', 'psychology', 'education', 'nursing'].includes(doc.specialty)) {
        category = 'professional';
      }

      if (category) {
        classified[category].push({
          ...doc,
          inferred_category: category
        });
      } else {
        classified.ambiguous.push(doc);
      }
    });

    return {
      success: true,
      total_documents: allDocs.length,
      classification: {
        baby_count: classified.baby.length,
        mother_count: classified.mother.length,
        professional_count: classified.professional.length,
        ambiguous_count: classified.ambiguous.length
      },
      classified
    };
  } catch (error) {
    console.error('[Migration] Erro ao classificar documentos:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Migra documentos da base legado para tabelas segmentadas
 * Usa dual write para manter referência
 */
async function migrateDocuments(options = {}) {
  const {
    auto_classify = true,
    skip_ambiguous = true,
    batch_size = 10
  } = options;

  const transaction = await sequelize.transaction();
  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    console.log('[Migration] Iniciando migração...');

    // Passo 1: Classificar documentos
    const classifyResult = await analyzeAndClassifyDocuments();
    if (!classifyResult.success) {
      await transaction.rollback();
      return {
        success: false,
        error: 'Erro ao classificar documentos'
      };
    }

    const { classified } = classifyResult;

    // Passo 2: Migrar documentos por categoria
    const categories = ['baby', 'mother', 'professional'];

    for (const category of categories) {
      const docs = classified[category];
      console.log(`[Migration] Migrando ${docs.length} documentos para kb_${category}...`);

      for (let i = 0; i < docs.length; i += batch_size) {
        const batch = docs.slice(i, i + batch_size);

        for (const doc of batch) {
          try {
            // Insere na tabela segmentada usando dual write
            const result = await knowledgeBaseRepository.insertDualWithCategory(
              {
                title: doc.title,
                content: doc.content,
                domain: doc.domain,
                age_range: doc.age_range,
                specialty: doc.specialty,
                tags: doc.tags,
                source_type: doc.source_type || 'migration',
                file_search_id: doc.file_search_id
              },
              category,
              {
                migrated_from: doc.id,
                migration_date: new Date().toISOString()
              },
              { transaction }
            );

            if (result.success) {
              migratedCount++;
            } else {
              throw new Error(result.error || 'Erro ao inserir documento');
            }
          } catch (error) {
            errorCount++;
            errors.push({
              doc_id: doc.id,
              title: doc.title,
              error: error.message
            });
            console.error(`[Migration] Erro ao migrar documento ${doc.id}:`, error.message);
          }
        }
      }
    }

    // Passo 3: Tratar documentos ambíguos
    if (!skip_ambiguous && classified.ambiguous.length > 0) {
      console.log(`[Migration] ${classified.ambiguous.length} documentos ambíguos - sem ação`);
      skippedCount = classified.ambiguous.length;
    } else if (skip_ambiguous && classified.ambiguous.length > 0) {
      skippedCount = classified.ambiguous.length;
    }

    await transaction.commit();

    console.log(`[Migration] Migração concluída: ${migratedCount} migrados, ${skippedCount} pulados, ${errorCount} erros`);

    return {
      success: true,
      summary: {
        total_attempted: classifyResult.total_documents,
        migrated: migratedCount,
        skipped: skippedCount,
        errors: errorCount
      },
      error_details: errors.slice(0, 10) // Primeiros 10 erros
    };
  } catch (error) {
    await transaction.rollback();
    console.error('[Migration] Erro crítico na migração:', error);
    return {
      success: false,
      error: error.message,
      migrated_before_error: migratedCount
    };
  }
}

/**
 * Valida integridade após migração
 */
async function validateMigration() {
  try {
    console.log('[Migration] Validando integridade...');

    // Conta documentos em cada tabela
    const counts = {
      legacy: await KnowledgeDocument.count(),
      kb_baby: await KnowledgeBaby.count(),
      kb_mother: await KnowledgeMother.count(),
      kb_professional: await KnowledgeProfessional.count()
    };

    // Verifica se há documentos migrados em legacy
    const migratedInLegacy = await KnowledgeDocument.count({
      where: {
        migrated_from: { [require('sequelize').Op.not]: null }
      }
    });

    // Verifica referências cruzadas (mesmos IDs em legacy e segmentadas)
    const totalInSegmented = counts.kb_baby + counts.kb_mother + counts.kb_professional;

    return {
      success: true,
      counts,
      migration_status: {
        documents_in_legacy: counts.legacy,
        documents_in_segmented: totalInSegmented,
        migrated_marked_in_legacy: migratedInLegacy,
        coverage_percent: totalInSegmented > 0 ? Math.round((totalInSegmented / (counts.legacy || 1)) * 100) : 0
      },
      recommendations: generateRecommendations(counts, migratedInLegacy)
    };
  } catch (error) {
    console.error('[Migration] Erro na validação:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gera recomendações baseado na validação
 */
function generateRecommendations(counts, migratedInLegacy) {
  const recommendations = [];

  if (counts.legacy > 0 && counts.legacy === migratedInLegacy) {
    recommendations.push('✅ Todos os documentos legados foram marcados como migrados');
  } else if (counts.legacy > migratedInLegacy) {
    recommendations.push(`⚠️  ${counts.legacy - migratedInLegacy} documentos não foram migrados`);
  }

  if (counts.kb_baby > counts.kb_mother && counts.kb_baby > counts.kb_professional) {
    recommendations.push('ℹ️  kb_baby tem mais documentos - normal para conteúdo de desenvolvimento infantil');
  }

  if (counts.kb_professional === 0) {
    recommendations.push('⚠️  kb_professional está vazia - considere adicionar conteúdo para profissionais');
  }

  if ((counts.kb_baby + counts.kb_mother + counts.kb_professional) < counts.legacy) {
    recommendations.push(`ℹ️  ${counts.legacy - (counts.kb_baby + counts.kb_mother + counts.kb_professional)} documentos ainda não foram migrados`);
  }

  return recommendations;
}

/**
 * Rollback: marca documentos como não migrados
 */
async function rollbackMigration(documentIds = null) {
  try {
    console.log('[Migration] Iniciando rollback...');

    const transaction = await sequelize.transaction();

    if (documentIds && documentIds.length > 0) {
      // Rollback parcial
      await KnowledgeDocument.update(
        { migrated_from: null },
        {
          where: {
            id: documentIds
          },
          transaction
        }
      );
    } else {
      // Rollback completo
      await KnowledgeDocument.update(
        { migrated_from: null },
        { transaction }
      );
    }

    await transaction.commit();

    console.log('[Migration] Rollback concluído');
    return {
      success: true,
      message: `Rollback concluído para ${documentIds?.length || 'todos'} documentos`
    };
  } catch (error) {
    console.error('[Migration] Erro no rollback:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  analyzeAndClassifyDocuments,
  migrateDocuments,
  validateMigration,
  rollbackMigration
};
