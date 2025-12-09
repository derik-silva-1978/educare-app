const OpenAI = require('openai');
const { KnowledgeDocument } = require('../models');
const { Op } = require('sequelize');
const babyContextService = require('./babyContextService');

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

async function selectKnowledgeDocuments(filters = {}) {
  try {
    const where = {
      is_active: true
    };

    if (filters.age_range) {
      where.age_range = filters.age_range;
    }

    if (filters.domain) {
      where.domain = filters.domain;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        [Op.overlap]: filters.tags
      };
    }

    if (filters.source_type) {
      where.source_type = filters.source_type;
    }

    const documents = await KnowledgeDocument.findAll({
      where,
      attributes: ['id', 'title', 'file_search_id', 'tags', 'age_range', 'domain', 'source_type'],
      order: [['created_at', 'DESC']],
      limit: filters.limit || 10
    });

    return {
      success: true,
      data: documents,
      count: documents.length
    };
  } catch (error) {
    console.error('[RAG] Erro ao selecionar documentos:', error);
    return {
      success: false,
      error: error.message,
      data: []
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
  try {
    const startTime = Date.now();

    const filters = {
      age_range: options.age_range,
      domain: options.domain,
      tags: options.tags,
      source_type: options.source_type,
      limit: options.document_limit || 5
    };

    const docsResult = await selectKnowledgeDocuments(filters);

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

    const processingTime = Date.now() - startTime;

    if (!llmResult.success) {
      return {
        success: false,
        error: llmResult.error,
        processing_time_ms: processingTime
      };
    }

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
        processing_time_ms: processingTime
      }
    };
  } catch (error) {
    console.error('[RAG] Erro geral:', error);
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

module.exports = {
  selectKnowledgeDocuments,
  retrieveFromFileSearch,
  buildLLMPrompt,
  callLLM,
  ask,
  askSimple,
  askWithBabyId,
  isConfigured,
  DEFAULT_SYSTEM_PROMPT,
  babyContextService
};
