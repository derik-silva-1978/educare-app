/**
 * RAG Service
 * FASE 08-11-UPGRADE: Integração completa com Enterprise Features
 */

const OpenAI = require('openai');
const { KnowledgeDocument } = require('../models');
const { Op } = require('sequelize');
const babyContextService = require('./babyContextService');
const knowledgeBaseSelector = require('./knowledgeBaseSelector');
const knowledgeBaseRepository = require('../repositories/knowledgeBaseRepository');
const ragMetricsService = require('./ragMetricsService');

// FASE 10: Enterprise Services
const rerankingService = require('./rerankingService');
const confidenceService = require('./confidenceService');
const contextSafetyService = require('./contextSafetyService');

// FASE 11: Feedback Service
const ragFeedbackService = require('./ragFeedbackService');

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

const FILE_SEARCH_TIMEOUT_MS = 60000;
const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ATTEMPTS = 60;

async function pollRunWithTimeout(openai, threadId, runId, timeoutMs = FILE_SEARCH_TIMEOUT_MS) {
  const startTime = Date.now();
  let attempts = 0;

  while (Date.now() - startTime < timeoutMs && attempts < MAX_POLL_ATTEMPTS) {
    attempts++;
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    console.log(`[RAG] Poll ${attempts}: status=${run.status}, elapsed=${Date.now() - startTime}ms`);

    if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
      return run;
    }

    if (run.status === 'requires_action') {
      console.warn('[RAG] Run requer ação - não suportado');
      return run;
    }

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  console.error(`[RAG] Timeout após ${attempts} tentativas (${Date.now() - startTime}ms)`);
  return { status: 'timeout', error: 'Timeout ao aguardar resposta do File Search' };
}

async function retrieveFromFileSearch(question, fileSearchIds) {
  const startTime = Date.now();
  let assistantId = null;

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

    console.log(`[RAG] Iniciando File Search com ${validFileIds.length} arquivos`);

    const assistant = await openai.beta.assistants.create({
      name: "Educare RAG Assistant",
      instructions: "Você é um assistente de busca de informações sobre desenvolvimento infantil.",
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }]
    });
    assistantId = assistant.id;
    console.log(`[RAG] Assistant criado: ${assistantId} (${Date.now() - startTime}ms)`);

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
    console.log(`[RAG] Thread criada: ${thread.id} (${Date.now() - startTime}ms)`);

    const initialRun = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    console.log(`[RAG] Run iniciado: ${initialRun.id} (${Date.now() - startTime}ms)`);

    const run = await pollRunWithTimeout(openai, thread.id, initialRun.id, FILE_SEARCH_TIMEOUT_MS);

    if (run.status === 'timeout') {
      console.error(`[RAG] File Search timeout após ${Date.now() - startTime}ms`);
      try {
        await openai.beta.threads.runs.cancel(thread.id, initialRun.id);
      } catch (cancelError) {
        console.warn('[RAG] Erro ao cancelar run:', cancelError.message);
      }
      if (assistantId) {
        try {
          await openai.beta.assistants.del(assistantId);
          console.log(`[RAG] Assistant ${assistantId} deletado após timeout`);
        } catch (cleanupError) {
          console.warn('[RAG] Erro ao limpar assistant após timeout:', cleanupError.message);
        }
        assistantId = null;
      }
      return {
        success: false,
        error: 'Timeout: A busca demorou mais de 60 segundos',
        chunks: [],
        processing_time_ms: Date.now() - startTime
      };
    }

    if (run.status !== 'completed') {
      console.warn(`[RAG] Run não completou: ${run.status}`);
      if (assistantId) {
        try {
          await openai.beta.assistants.del(assistantId);
          console.log(`[RAG] Assistant ${assistantId} deletado após run não-completado`);
        } catch (cleanupError) {
          console.warn('[RAG] Erro ao limpar assistant após run não-completado:', cleanupError.message);
        }
        assistantId = null;
      }
      return {
        success: false,
        error: `Run status: ${run.status}`,
        chunks: [],
        processing_time_ms: Date.now() - startTime
      };
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');

    await openai.beta.assistants.del(assistant.id);
    assistantId = null;

    if (!assistantMessage) {
      return {
        success: true,
        chunks: [],
        message: 'Nenhuma resposta do assistente',
        processing_time_ms: Date.now() - startTime
      };
    }

    const textContent = assistantMessage.content
      .filter(c => c.type === 'text')
      .map(c => c.text.value)
      .join('\n');

    console.log(`[RAG] File Search concluído em ${Date.now() - startTime}ms`);

    return {
      success: true,
      chunks: [{ text: textContent, source: 'file_search' }],
      processing_time_ms: Date.now() - startTime
    };
  } catch (error) {
    console.error(`[RAG] Erro no File Search após ${Date.now() - startTime}ms:`, error);
    
    if (assistantId) {
      try {
        const openai = getOpenAI();
        await openai.beta.assistants.del(assistantId);
      } catch (cleanupError) {
        console.warn('[RAG] Erro ao limpar assistant:', cleanupError.message);
      }
    }

    return {
      success: false,
      error: error.message,
      chunks: [],
      processing_time_ms: Date.now() - startTime
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
    let fileSearchFailed = false;

    // ===== ESTRATÉGIA RAG HÍBRIDO - FILE SEARCH PRIORITÁRIO (PRD) =====
    // 1. PRIMEIRO: Tenta File Search (busca semântica prioritária)
    // 2. FALLBACK: Se File Search falhar, usa conteúdo local das tabelas KB
    
    if (docsResult.success && docsResult.data.length > 0) {
      const fileSearchIds = docsResult.data
        .map(d => d.file_search_id)
        .filter(id => id);

      // PRIORIDADE 1: File Search (quando disponível e não desabilitado)
      if (fileSearchIds.length > 0 && options.use_file_search !== false) {
        console.log(`[RAG] PRIORIDADE: Tentando File Search com ${fileSearchIds.length} documentos`);
        const searchResult = await retrieveFromFileSearch(question, fileSearchIds);
        
        if (searchResult.success && searchResult.chunks.length > 0) {
          retrievedChunks = searchResult.chunks;
          fileSearchUsed = true;
          console.log(`[RAG] File Search SUCESSO: ${searchResult.chunks.length} chunks recuperados em ${searchResult.processing_time_ms}ms`);
        } else {
          fileSearchFailed = true;
          console.warn(`[RAG] File Search sem resultados ou falhou: ${searchResult.error || 'Nenhum chunk recuperado'}`);
        }
      }

      // FALLBACK: Usa descrição/conteúdo local dos documentos se File Search falhou
      if (!fileSearchUsed && (fileSearchFailed || fileSearchIds.length === 0)) {
        console.log(`[RAG] FALLBACK: Usando conteúdo local dos documentos (${docsResult.data.length} docs)`);
        
        // Extrai conteúdo textual dos documentos como fallback
        const localChunks = docsResult.data
          .filter(doc => doc.description || doc.content || doc.title)
          .map(doc => ({
            text: doc.content || doc.description || `Documento: ${doc.title}`,
            source: 'local_fallback',
            document_id: doc.id,
            title: doc.title
          }));
        
        if (localChunks.length > 0) {
          retrievedChunks = localChunks;
          console.log(`[RAG] Fallback local: ${localChunks.length} chunks de documentos locais`);
        }
      }
    }

    // FASE 10: Re-ranking dos documentos encontrados
    let rankedDocs = docsResult.data;
    let rerankingStats = null;
    
    if (docsResult.data.length > 1 && options.enable_reranking !== false) {
      try {
        const rerankResult = await rerankingService.rerank(question, docsResult.data, {
          module: filters.module_type,
          topK: filters.limit
        });
        if (rerankResult.reranked) {
          rankedDocs = rerankResult.documents;
          rerankingStats = rerankResult.stats;
        }
      } catch (rerankError) {
        console.warn('[RAG] Erro no reranking (continuando sem):', rerankError.message);
      }
    }

    // FASE 10: Context Safety Audit da query
    let safetyAudit = null;
    if (options.enable_safety !== false) {
      try {
        safetyAudit = contextSafetyService.auditContext({
          query: question,
          documents: rankedDocs
        });
      } catch (safetyError) {
        console.warn('[RAG] Erro no safety audit:', safetyError.message);
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

      // FASE 11: Log event de erro
      ragFeedbackService.logEvent('query_error', {
        query: question,
        module: filters.module_type,
        error: llmResult.error
      });

      return {
        success: false,
        error: llmResult.error,
        processing_time_ms: processingTime
      };
    }

    // FASE 10: Audit da resposta gerada
    let responseAudit = null;
    let disclaimers = [];
    if (options.enable_safety !== false && safetyAudit) {
      try {
        responseAudit = contextSafetyService.auditContext({
          query: question,
          documents: rankedDocs,
          response: llmResult.content
        });
        disclaimers = contextSafetyService.generateDisclaimer(responseAudit);
      } catch (safetyError) {
        console.warn('[RAG] Erro no response audit:', safetyError.message);
      }
    }

    // FASE 10: Calcular confidence score
    let confidence = null;
    if (options.enable_confidence !== false) {
      try {
        confidence = confidenceService.analyzeRAGResponse({
          documents: rankedDocs,
          query: question,
          responseText: llmResult.content,
          responseTime: processingTime,
          usedFallback: docsResult.metadata?.fallback_used || false,
          moduleMatch: true,
          context: {
            healthRelated: safetyAudit?.findings?.some(f => f.type === 'emergency_terms')
          }
        });
      } catch (confError) {
        console.warn('[RAG] Erro no confidence scoring:', confError.message);
      }
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
      file_search_failed: fileSearchFailed,  // PRD: Rastreia falhas do File Search
      local_fallback_used: fileSearchFailed && retrievedChunks.length > 0,  // PRD: Rastreia uso do fallback local
      chunks_retrieved: retrievedChunks.length,
      reranked: !!rerankingStats,
      confidence_level: confidence?.level
    });

    // FASE 11: Log event de sucesso
    ragFeedbackService.logEvent('query_success', {
      query: question,
      module: filters.module_type,
      documents_found: rankedDocs.length,
      confidence_level: confidence?.level,
      response_time_ms: processingTime,
      fallback_used: docsResult.metadata?.fallback_used
    });

    // Prepara resposta final (com disclaimers se necessário)
    let finalAnswer = llmResult.content;
    if (disclaimers.length > 0) {
      finalAnswer = disclaimers.join('\n') + '\n\n' + llmResult.content;
    }

    return {
      success: true,
      answer: finalAnswer,
      response_id: `rag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        documents_found: docsResult.data.length,
        documents_used: rankedDocs.map(d => ({
          id: d.id,
          title: d.title,
          source_type: d.source_type,
          relevance_score: d.relevance_score
        })),
        file_search_used: fileSearchUsed,
        file_search_failed: fileSearchFailed,  // PRD: Indica se File Search falhou
        local_fallback_used: fileSearchFailed && retrievedChunks.length > 0,  // PRD: Indica uso de fallback local
        chunks_retrieved: retrievedChunks.length,
        model: llmResult.model,
        usage: llmResult.usage,
        processing_time_ms: processingTime,
        knowledge_base: docsResult.metadata,
        strict_mode: strictMode,
        reranking: rerankingStats,
        confidence,
        safety: {
          query_audit: safetyAudit?.findings?.length > 0 ? safetyAudit.findings : null,
          response_audit: responseAudit?.findings?.length > 0 ? responseAudit.findings : null,
          disclaimers_added: disclaimers.length > 0
        }
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
