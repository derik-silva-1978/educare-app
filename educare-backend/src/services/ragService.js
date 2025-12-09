/**
 * RAG Service
 * FASE 08-UPGRADE: Suporte a modo strict (sem fallback legacy)
 */

const OpenAI = require('openai');
const { KnowledgeDocument } = require('../models');
const { Op } = require('sequelize');
const babyContextService = require('./babyContextService');
const knowledgeBaseSelector = require('./knowledgeBaseSelector');
const knowledgeBaseRepository = require('../repositories/knowledgeBaseRepository');
const ragMetricsService = require('./ragMetricsService');

let openaiInstance = null;

function getOpenAI() {
  if (!openaiInstance && process.env.OPENAI_API_KEY) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiInstance;
}

const DEFAULT_SYSTEM_PROMPT = `Você é TitiNauta, a assistente oficial do Educare App, especializada em desenvolvimento infantil (0-6 anos).

INSTRUÇÕES DE COMPORTAMENTO:
- Fale sempre de forma acolhedora, clara e segura
- Use linguagem simples que cuidadores podem entender facilmente
- Personalize suas respostas para a criança específica quando o contexto for fornecido
- Baseie suas respostas nas informações dos documentos de referência fornecidos
- Seja concisa e prática nas orientações

REGRAS DE SEGURANÇA EDUCARE:
- Nunca crie diagnósticos médicos ou psicológicos
- Nunca use termos alarmistas que possam assustar os cuidadores
- Sempre ofereça orientações práticas baseadas em evidências
- Identifique sinais de alerta reais (OMS / Educare) e recomende-os com cuidado
- Oriente a buscar atendimento médico para emergências
- Não substitua orientação profissional de saúde

REGRAS RAG:
- Use exclusivamente os trechos recuperados dos documentos de referência quando disponíveis
- Se os trechos não forem suficientes para responder, diga isso claramente
- Não invente fatos clínicos ou dados científicos
- Quando não houver documentos de referência, use seu conhecimento geral mas deixe claro

FORMATAÇÃO:
- Use parágrafos curtos e claros
- Quando apropriado, use listas para organizar informações
- Inclua emojis ocasionalmente para tornar a conversa acolhedora 😊
- Prefira frases curtas, diretas e claras`;

// FASE 08: Mensagem de fallback amigável para modo strict
const LOW_CONFIDENCE_MESSAGE = `Ainda estou aprendendo sobre este tema específico. 🌱

Posso ajudar com outras perguntas sobre desenvolvimento infantil, saúde materna ou orientações para profissionais. Continue me enviando suas dúvidas!

Se precisar de orientação urgente, recomendo consultar um profissional de saúde.`;

async function selectKnowledgeDocuments(filters = {}) {
  try {
    // Determina qual base de conhecimento usar (legado ou segmentada)
    const selector = knowledgeBaseSelector.select({
      module_type: filters.module_type,
      baby_id: filters.baby_id,
      user_role: filters.user_role,
      route_context: filters.route_context,
      force_legacy: filters.force_legacy
    });

    const primaryTable = selector.primary_table;
    const fallbackTable = selector.fallback_table;
    const useFallback = selector.use_fallback;
    const strictMode = selector.strict_mode;

    console.log(`[RAG] Selecionando documentos - tabela primária: ${primaryTable}, motivo: ${selector.selection_reason}, strict: ${strictMode}`);

    // Prepara os filtros comuns
    const commonFilters = {
      age_range: filters.age_range,
      domain: filters.domain,
      tags: filters.tags,
      source_type: filters.source_type,
      limit: filters.limit || 10
    };

    let documents = [];
    let usedTable = primaryTable;
    let fallbackWasUsed = false;

    // Consulta tabela primária
    if (primaryTable === 'knowledge_documents') {
      // Consulta legado
      const result = await knowledgeBaseRepository.queryByTable('knowledge_documents', commonFilters);
      if (result.success) {
        documents = result.data;
      }
    } else if (['kb_baby', 'kb_mother', 'kb_professional'].includes(primaryTable)) {
      // Consulta base segmentada
      const result = await knowledgeBaseRepository.queryByTable(primaryTable, commonFilters);
      if (result.success) {
        documents = result.data;
      }

      // FASE 08: Só usa fallback se NÃO estiver em modo strict
      if (documents.length === 0 && useFallback && fallbackTable && !strictMode) {
        console.log(`[RAG] Nenhum documento em ${primaryTable}, tentando fallback para ${fallbackTable}`);
        const fallbackResult = await knowledgeBaseRepository.queryByTable(fallbackTable, commonFilters);
        if (fallbackResult.success) {
          documents = fallbackResult.data;
          usedTable = fallbackTable;
          fallbackWasUsed = true;
        }
      } else if (documents.length === 0 && strictMode) {
        console.log(`[RAG] Nenhum documento em ${primaryTable}, STRICT MODE ativo - sem fallback`);
      }
    }

    return {
      success: true,
      data: documents,
      count: documents.length,
      metadata: {
        primary_table: primaryTable,
        used_table: usedTable,
        fallback_used: fallbackWasUsed,
        strict_mode: strictMode,
        selection_reason: selector.selection_reason,
        inferred_module: selector.inferred_module
      }
    };
  } catch (error) {
    console.error('[RAG] Erro ao selecionar documentos:', error);
    return {
      success: false,
      error: error.message,
      data: [],
      metadata: {
        error_details: error.message
      }
    };
  }
}

async function retrieveFromFileSearch(question, fileSearchIds) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado',
        chunks: []
      };
    }

    if (!fileSearchIds || fileSearchIds.length === 0) {
      return {
        success: true,
        chunks: [],
        message: 'Nenhum documento para pesquisar'
      };
    }

    const validFileIds = fileSearchIds.filter(id => id && id.trim() !== '');
    
    if (validFileIds.length === 0) {
      return {
        success: true,
        chunks: [],
        message: 'Nenhum file_search_id válido'
      };
    }

    const assistant = await openai.beta.assistants.create({
      name: "Educare RAG Assistant",
      instructions: "Você é um assistente de busca de informações sobre desenvolvimento infantil.",
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }]
    });

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: question,
          attachments: validFileIds.map(id => ({
            file_id: id,
            tools: [{ type: "file_search" }]
          }))
        }
      ]
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    if (run.status !== 'completed') {
      console.warn('[RAG] Run não completou:', run.status);
      return {
        success: false,
        error: `Run status: ${run.status}`,
        chunks: []
      };
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');

    await openai.beta.assistants.del(assistant.id);

    if (!assistantMessage) {
      return {
        success: true,
        chunks: [],
        message: 'Nenhuma resposta do assistente'
      };
    }

    const textContent = assistantMessage.content
      .filter(c => c.type === 'text')
      .map(c => c.text.value)
      .join('\n');

    return {
      success: true,
      chunks: [{ text: textContent, source: 'file_search' }]
    };
  } catch (error) {
    console.error('[RAG] Erro no File Search:', error);
    return {
      success: false,
      error: error.message,
      chunks: []
    };
  }
}

function buildLLMPrompt(question, retrievedChunks, childContext = null, customSystemPrompt = null) {
  const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  let contextSection = '';

  if (childContext) {
    if (childContext.age_formatted) {
      contextSection = `\n\n${babyContextService.formatContextForPrompt(childContext)}`;
    } else {
      contextSection += `\n\nCONTEXTO DA CRIANÇA:
- Nome: ${childContext.name || 'Não informado'}
- Idade: ${childContext.ageInMonths || childContext.age_months || 'Não informada'} meses
- Gênero: ${childContext.gender === 'M' ? 'Masculino' : childContext.gender === 'F' ? 'Feminino' : 'Não informado'}`;

      if (childContext.specialNeeds || childContext.special_needs) {
        contextSection += `\n- Necessidades especiais: ${childContext.specialNeeds || childContext.special_needs}`;
      }

      if (childContext.educare_track) {
        contextSection += `\n- Etapa Educare: ${childContext.educare_track.current_stage}`;
      }

      if (childContext.milestones) {
        if (childContext.milestones.achieved && childContext.milestones.achieved.length > 0) {
          contextSection += `\n- Marcos atingidos recentes: ${childContext.milestones.achieved.slice(0, 3).map(m => m.domain).join(', ')}`;
        }
        if (childContext.milestones.delayed && childContext.milestones.delayed.length > 0) {
          contextSection += `\n- Áreas que precisam de atenção: ${childContext.milestones.delayed.slice(0, 3).map(m => m.domain).join(', ')}`;
        }
      }
    }
  }

  let documentsSection = '';
  if (retrievedChunks && retrievedChunks.length > 0) {
    documentsSection = '\n\nDOCUMENTOS DE REFERÊNCIA (FILE SEARCH):';
    retrievedChunks.forEach((chunk, index) => {
      documentsSection += `\n\n[Trecho ${index + 1}]:\n${chunk.text}`;
    });
    documentsSection += '\n\nINSTRUÇÕES:';
    documentsSection += '\n- Personalize a resposta para a criança acima.';
    documentsSection += '\n- Use os trechos fornecidos como base.';
    documentsSection += '\n- Aplique o tom acolhedor Educare.';
    documentsSection += '\n- Oriente o cuidador de forma clara e gentil.';
  }

  const fullSystemPrompt = systemPrompt + contextSection + documentsSection;

  return {
    systemPrompt: fullSystemPrompt,
    userMessage: question
  };
}

async function callLLM(systemPrompt, userMessage, options = {}) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1500
    });

    return {
      success: true,
      content: response.choices[0].message.content,
      usage: response.usage,
      model: response.model
    };
  } catch (error) {
    console.error('[RAG] Erro ao chamar LLM:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function ask(question, options = {}) {
  let processingTime = 0;
  let success = false;
  let error = null;
  const startTime = Date.now();

  try {
    const filters = {
      age_range: options.age_range,
      domain: options.domain,
      tags: options.tags,
      source_type: options.source_type,
      limit: options.document_limit || 5,
      module_type: options.module_type || 'baby',  // Default para baby
      baby_id: options.baby_id,
      user_role: options.user_role,
      route_context: options.route_context,
      force_legacy: options.force_legacy
    };

    const docsResult = await selectKnowledgeDocuments(filters);

    // FASE 08: Verifica modo strict com resultado vazio
    const strictMode = docsResult.metadata?.strict_mode || false;
    const noDocuments = docsResult.data.length === 0;

    if (strictMode && noDocuments) {
      processingTime = Date.now() - startTime;

      // Registra query com resultado vazio em modo strict
      ragMetricsService.recordQuery({
        question,
        module_type: filters.module_type,
        success: true,  // É sucesso técnico, mas sem conteúdo
        response_time_ms: processingTime,
        primary_table: docsResult.metadata?.primary_table,
        used_table: docsResult.metadata?.used_table,
        fallback_used: false,
        strict_mode: true,
        documents_found: 0,
        file_search_used: false,
        chunks_retrieved: 0
      });

      console.log(`[RAG] STRICT MODE: Retornando resposta de baixa confiança para módulo ${filters.module_type}`);

      return {
        success: true,
        answer: LOW_CONFIDENCE_MESSAGE,
        metadata: {
          documents_found: 0,
          documents_used: [],
          file_search_used: false,
          chunks_retrieved: 0,
          model: 'fallback',
          processing_time_ms: processingTime,
          knowledge_base: docsResult.metadata,
          low_confidence: true,
          strict_mode: true
        }
      };
    }

    let retrievedChunks = [];
    let fileSearchUsed = false;

    if (docsResult.success && docsResult.data.length > 0) {
      const fileSearchIds = docsResult.data
        .map(d => d.file_search_id)
        .filter(id => id);

      if (fileSearchIds.length > 0 && options.use_file_search !== false) {
        const searchResult = await retrieveFromFileSearch(question, fileSearchIds);
        if (searchResult.success && searchResult.chunks.length > 0) {
          retrievedChunks = searchResult.chunks;
          fileSearchUsed = true;
        }
      }
    }

    const promptData = buildLLMPrompt(
      question,
      retrievedChunks,
      options.childContext,
      options.customSystemPrompt
    );

    const llmResult = await callLLM(
      promptData.systemPrompt,
      promptData.userMessage,
      {
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.max_tokens
      }
    );

    processingTime = Date.now() - startTime;

    if (!llmResult.success) {
      error = llmResult.error;
      ragMetricsService.recordQuery({
        question,
        module_type: filters.module_type,
        success: false,
        response_time_ms: processingTime,
        primary_table: docsResult.metadata?.primary_table,
        used_table: docsResult.metadata?.used_table,
        fallback_used: docsResult.metadata?.fallback_used,
        strict_mode: strictMode,
        documents_found: 0,
        file_search_used: false,
        chunks_retrieved: 0,
        error
      });

      return {
        success: false,
        error: llmResult.error,
        processing_time_ms: processingTime
      };
    }

    success = true;

    // Registra query bem-sucedida
    ragMetricsService.recordQuery({
      question,
      module_type: filters.module_type,
      success: true,
      response_time_ms: processingTime,
      primary_table: docsResult.metadata?.primary_table,
      used_table: docsResult.metadata?.used_table,
      fallback_used: docsResult.metadata?.fallback_used,
      strict_mode: strictMode,
      documents_found: docsResult.data.length,
      file_search_used: fileSearchUsed,
      chunks_retrieved: retrievedChunks.length
    });

    return {
      success: true,
      answer: llmResult.content,
      metadata: {
        documents_found: docsResult.data.length,
        documents_used: docsResult.data.map(d => ({
          id: d.id,
          title: d.title,
          source_type: d.source_type
        })),
        file_search_used: fileSearchUsed,
        chunks_retrieved: retrievedChunks.length,
        model: llmResult.model,
        usage: llmResult.usage,
        processing_time_ms: processingTime,
        knowledge_base: docsResult.metadata,
        strict_mode: strictMode
      }
    };
  } catch (error) {
    processingTime = Date.now() - startTime;
    console.error('[RAG] Erro geral:', error);

    ragMetricsService.recordQuery({
      question,
      module_type: options.module_type || 'baby',
      success: false,
      response_time_ms: processingTime,
      documents_found: 0,
      file_search_used: false,
      chunks_retrieved: 0,
      error: error.message
    });

    return {
      success: false,
      error: error.message || 'Erro interno do RAG'
    };
  }
}

async function askSimple(question, childContext = null) {
  return ask(question, {
    childContext,
    use_file_search: false
  });
}

async function askWithBabyId(question, babyId, options = {}) {
  try {
    let childContext = null;
    let inferredAgeRange = options.age_range;

    if (babyId) {
      const contextResult = await babyContextService.getBabyContext(babyId);
      if (contextResult.success) {
        childContext = contextResult.data;
        
        if (!inferredAgeRange && childContext.educare_track) {
          inferredAgeRange = childContext.educare_track.age_range;
        }
      }
    }

    return ask(question, {
      ...options,
      baby_id: babyId,
      module_type: options.module_type || 'baby',  // Force baby module for child context
      childContext,
      age_range: inferredAgeRange
    });
  } catch (error) {
    console.error('[RAG] Erro em askWithBabyId:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function isConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * FASE 08: Retorna status das flags de fallback
 */
function getFallbackStatus() {
  return knowledgeBaseSelector.getFallbackStatus();
}

module.exports = {
  selectKnowledgeDocuments,
  retrieveFromFileSearch,
  buildLLMPrompt,
  callLLM,
  ask,
  askSimple,
  askWithBabyId,
  isConfigured,
  getFallbackStatus,
  DEFAULT_SYSTEM_PROMPT,
  LOW_CONFIDENCE_MESSAGE,
  babyContextService,
  ragMetricsService
};
