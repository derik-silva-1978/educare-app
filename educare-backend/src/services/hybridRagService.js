const geminiFileSearchService = require('./geminiFileSearchService');
const qdrantService = require('./qdrantService');
const hybridIngestionService = require('./hybridIngestionService');

const ENABLE_GEMINI = process.env.ENABLE_GEMINI_RAG !== 'false';
const ENABLE_QDRANT = process.env.ENABLE_QDRANT_RAG !== 'false';
const PRIMARY_PROVIDER = process.env.RAG_PRIMARY_PROVIDER || 'gemini';

async function query(userQuery, options = {}) {
  const startTime = Date.now();
  
  const results = {
    answer: null,
    citations: [],
    sources: [],
    provider_used: null,
    fallback_used: false,
    query_time_ms: 0,
    success: false
  };

  console.log(`[HybridRAG] Query: "${userQuery.substring(0, 50)}..." (primary: ${PRIMARY_PROVIDER})`);

  const providers = determineQueryOrder(options);

  for (const provider of providers) {
    try {
      const providerResult = await queryProvider(provider, userQuery, options);
      
      if (providerResult.success && providerResult.answer) {
        results.answer = providerResult.answer;
        results.citations = providerResult.citations || [];
        results.sources = providerResult.sources || [];
        results.provider_used = provider;
        results.fallback_used = provider !== providers[0];
        results.success = true;
        results.query_time_ms = Date.now() - startTime;
        
        console.log(`[HybridRAG] ✓ Resposta de ${provider} (${results.query_time_ms}ms)`);
        return results;
      }
    } catch (error) {
      console.error(`[HybridRAG] Erro em ${provider}:`, error.message);
    }
  }

  results.query_time_ms = Date.now() - startTime;
  results.error = 'Nenhum provedor RAG conseguiu responder';
  
  console.log(`[HybridRAG] ✗ Nenhum provedor disponível (${results.query_time_ms}ms)`);
  
  return results;
}

function determineQueryOrder(options) {
  const providers = [];
  
  if (options.preferred_provider) {
    if (options.preferred_provider === 'gemini' && ENABLE_GEMINI && geminiFileSearchService.isConfigured()) {
      providers.push('gemini');
    } else if (options.preferred_provider === 'qdrant' && ENABLE_QDRANT && qdrantService.isConfigured()) {
      providers.push('qdrant');
    }
  }

  if (PRIMARY_PROVIDER === 'gemini') {
    if (ENABLE_GEMINI && geminiFileSearchService.isConfigured() && !providers.includes('gemini')) {
      providers.push('gemini');
    }
    if (ENABLE_QDRANT && qdrantService.isConfigured() && !providers.includes('qdrant')) {
      providers.push('qdrant');
    }
  } else {
    if (ENABLE_QDRANT && qdrantService.isConfigured() && !providers.includes('qdrant')) {
      providers.push('qdrant');
    }
    if (ENABLE_GEMINI && geminiFileSearchService.isConfigured() && !providers.includes('gemini')) {
      providers.push('gemini');
    }
  }

  return providers;
}

async function queryProvider(provider, userQuery, options) {
  if (provider === 'gemini') {
    return await queryGemini(userQuery, options);
  } else if (provider === 'qdrant') {
    return await queryQdrant(userQuery, options);
  }
  
  return { success: false, error: 'Provedor desconhecido' };
}

async function queryGemini(userQuery, options) {
  const metadataFilter = buildGeminiFilter(options);
  
  const result = await geminiFileSearchService.queryKnowledgeBase(userQuery, {
    metadataFilter,
    systemPrompt: options.systemPrompt,
    model: options.model
  });

  if (result.success) {
    return {
      success: true,
      answer: result.answer,
      citations: result.citations,
      sources: result.citations.map(c => ({
        title: c.title,
        source: c.source,
        provider: 'gemini'
      })),
      query_time_ms: result.query_time_ms
    };
  }

  return result;
}

async function queryQdrant(userQuery, options) {
  const embeddingResult = await hybridIngestionService.generateEmbedding(userQuery);
  
  if (!embeddingResult.success) {
    return { success: false, error: embeddingResult.error };
  }

  const searchResult = await qdrantService.search(embeddingResult.embedding, {
    knowledge_category: options.knowledge_category,
    source_type: options.source_type,
    domain: options.domain,
    limit: options.limit || 5,
    score_threshold: options.score_threshold || 0.6
  });

  if (!searchResult.success) {
    return searchResult;
  }

  if (searchResult.results.length === 0) {
    return {
      success: false,
      error: 'Nenhum documento relevante encontrado'
    };
  }

  const context = searchResult.results.map((r, i) => 
    `[Fonte ${i + 1}: ${r.payload.title}]\n${r.payload.content_preview || r.payload.description || 'Documento relevante encontrado.'}`
  ).join('\n\n');

  const answer = await generateAnswerWithContext(userQuery, context, options);

  return {
    success: true,
    answer: answer,
    citations: searchResult.results.map(r => ({
      content: r.payload.content_preview || r.payload.description,
      title: r.payload.title,
      score: r.score
    })),
    sources: searchResult.results.map(r => ({
      title: r.payload.title,
      id: r.id,
      score: r.score,
      provider: 'qdrant'
    })),
    query_time_ms: searchResult.search_time_ms
  };
}

async function generateAnswerWithContext(query, context, options) {
  try {
    const { GoogleGenAI } = require('@google/genai');
    
    if (!process.env.GEMINI_API_KEY) {
      return `Com base nos documentos encontrados:\n\n${context}`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = options.systemPrompt || `Você é TitiNauta, assistente especializado em desenvolvimento infantil e saúde materna.
Responda à pergunta do usuário com base APENAS no contexto fornecido.
Se a informação não estiver no contexto, diga que não tem essa informação.
Seja preciso e cite as fontes quando relevante.`;

    const response = await ai.models.generateContent({
      model: options.model || 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nContexto:\n${context}\n\nPergunta: ${query}`,
    });

    return response.text;
  } catch (error) {
    console.error('[HybridRAG] Erro ao gerar resposta:', error.message);
    return `Com base nos documentos encontrados:\n\n${context}`;
  }
}

function buildGeminiFilter(options) {
  const filters = [];
  
  if (options.knowledge_category) {
    filters.push(`knowledge_category="${options.knowledge_category}"`);
  }
  
  if (options.source_type) {
    filters.push(`source_type="${options.source_type}"`);
  }
  
  if (options.domain) {
    filters.push(`domain="${options.domain}"`);
  }

  return filters.length > 0 ? filters.join(' AND ') : undefined;
}

async function getProviderStatus() {
  return await hybridIngestionService.getSystemStatus();
}

function getActiveProviders() {
  return hybridIngestionService.getActiveProviders();
}

module.exports = {
  query,
  getProviderStatus,
  getActiveProviders,
  queryGemini,
  queryQdrant
};
