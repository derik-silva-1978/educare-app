/**
 * Chunking Service
 * FASE 10-UPGRADE: LLM-Assisted Chunking para Ingestão
 * 
 * Responsabilidades:
 * - Divisão inteligente de documentos
 * - Preservação de contexto semântico
 * - Overlap configurável entre chunks
 * - Metadados de posição e hierarquia
 */

const OpenAI = require('openai');

const openai = new OpenAI();

const CHUNKING_ENABLED = process.env.CHUNKING_ENABLED !== 'false';
const MIN_CHUNK_SIZE = parseInt(process.env.MIN_CHUNK_SIZE || '250');
const MAX_CHUNK_SIZE = parseInt(process.env.MAX_CHUNK_SIZE || '1200');
const OVERLAP_SIZE = parseInt(process.env.CHUNK_OVERLAP_SIZE || '100');
const LLM_ASSISTED = process.env.CHUNKING_LLM_ASSISTED === 'true';

/**
 * Divide texto em sentenças
 */
function splitIntoSentences(text) {
  const sentenceEnders = /([.!?])\s+/g;
  const sentences = text.split(sentenceEnders).filter(s => s.trim().length > 0);
  
  const result = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const punctuation = sentences[i + 1] || '';
    if (sentence.trim()) {
      result.push(sentence.trim() + punctuation);
    }
  }
  
  return result.length > 0 ? result : [text];
}

/**
 * Divide texto em parágrafos
 */
function splitIntoParagraphs(text) {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
}

/**
 * Chunking simples baseado em tamanho
 */
function simpleChunk(text, options = {}) {
  const maxSize = options.maxSize || MAX_CHUNK_SIZE;
  const minSize = options.minSize || MIN_CHUNK_SIZE;
  const overlap = options.overlap || OVERLAP_SIZE;

  const paragraphs = splitIntoParagraphs(text);
  const chunks = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxSize && currentChunk.length >= minSize) {
      chunks.push({
        content: currentChunk.trim(),
        index: chunkIndex++,
        start_char: chunks.reduce((sum, c) => sum + c.content.length, 0),
        char_count: currentChunk.length
      });

      const overlapStart = Math.max(0, currentChunk.length - overlap);
      currentChunk = currentChunk.substring(overlapStart) + '\n\n' + paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  if (currentChunk.trim().length >= minSize || chunks.length === 0) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      start_char: chunks.reduce((sum, c) => sum + c.content.length, 0),
      char_count: currentChunk.length
    });
  }

  return chunks;
}

/**
 * Chunking semântico usando LLM para identificar pontos de corte
 */
async function semanticChunk(text, options = {}) {
  if (!LLM_ASSISTED) {
    return simpleChunk(text, options);
  }

  try {
    console.log('[Chunking] Usando chunking semântico assistido por LLM');

    const prompt = `Analise o texto abaixo e identifique os pontos ideais para dividir em chunks semânticos.
Cada chunk deve:
- Ter entre ${MIN_CHUNK_SIZE} e ${MAX_CHUNK_SIZE} caracteres
- Ser semanticamente completo
- Preservar contexto importante

TEXTO:
${text.substring(0, 8000)}

Responda com um JSON array de objetos, cada um com:
- "start": índice do caractere inicial
- "end": índice do caractere final
- "summary": resumo de 1 linha do chunk
- "topics": array de tópicos cobertos

Exemplo de resposta:
[{"start": 0, "end": 500, "summary": "Introdução ao tema", "topics": ["intro", "conceitos"]}]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0
    });

    const boundaries = JSON.parse(response.choices[0].message.content.trim());
    
    return boundaries.map((b, index) => ({
      content: text.substring(b.start, b.end).trim(),
      index,
      start_char: b.start,
      end_char: b.end,
      char_count: b.end - b.start,
      summary: b.summary,
      topics: b.topics,
      llm_assisted: true
    }));
  } catch (error) {
    console.error('[Chunking] Erro no chunking semântico, fallback para simples:', error);
    return simpleChunk(text, options);
  }
}

/**
 * Divide documento com metadados hierárquicos
 */
function hierarchicalChunk(text, options = {}) {
  const sections = text.split(/(?=#{1,3}\s)/);
  const chunks = [];
  let globalIndex = 0;

  for (const section of sections) {
    if (!section.trim()) continue;

    const headerMatch = section.match(/^(#{1,3})\s+(.+)/);
    const level = headerMatch ? headerMatch[1].length : 0;
    const title = headerMatch ? headerMatch[2].trim() : '';
    const content = headerMatch ? section.replace(/^#{1,3}\s+.+\n?/, '') : section;

    const sectionChunks = simpleChunk(content, options);
    
    for (const chunk of sectionChunks) {
      chunks.push({
        ...chunk,
        global_index: globalIndex++,
        section_title: title,
        section_level: level,
        hierarchical: true
      });
    }
  }

  return chunks.length > 0 ? chunks : simpleChunk(text, options);
}

/**
 * Prepara documento para ingestão com chunking apropriado
 */
async function prepareForIngestion(document, options = {}) {
  if (!CHUNKING_ENABLED) {
    return [{
      content: document.content || document.text || '',
      index: 0,
      original_id: document.id,
      title: document.title
    }];
  }

  const text = document.content || document.text || '';
  
  if (text.length <= MAX_CHUNK_SIZE) {
    return [{
      content: text,
      index: 0,
      original_id: document.id,
      title: document.title,
      char_count: text.length
    }];
  }

  const strategy = options.strategy || 'hierarchical';
  
  let chunks;
  switch (strategy) {
    case 'semantic':
      chunks = await semanticChunk(text, options);
      break;
    case 'hierarchical':
      chunks = hierarchicalChunk(text, options);
      break;
    case 'simple':
    default:
      chunks = simpleChunk(text, options);
  }

  return chunks.map(chunk => ({
    ...chunk,
    original_id: document.id,
    title: document.title,
    parent_title: document.title,
    strategy_used: strategy
  }));
}

/**
 * Reconstrói documento original a partir de chunks
 */
function reconstructFromChunks(chunks) {
  const sorted = [...chunks].sort((a, b) => (a.index || 0) - (b.index || 0));
  return sorted.map(c => c.content).join('\n\n');
}

/**
 * Estatísticas de chunking para um documento
 */
function getChunkingStats(chunks) {
  if (!chunks || chunks.length === 0) {
    return { count: 0 };
  }

  const sizes = chunks.map(c => c.char_count || c.content?.length || 0);
  
  return {
    count: chunks.length,
    total_chars: sizes.reduce((a, b) => a + b, 0),
    avg_size: Math.round(sizes.reduce((a, b) => a + b, 0) / chunks.length),
    min_size: Math.min(...sizes),
    max_size: Math.max(...sizes),
    strategies_used: [...new Set(chunks.map(c => c.strategy_used).filter(Boolean))]
  };
}

module.exports = {
  simpleChunk,
  semanticChunk,
  hierarchicalChunk,
  prepareForIngestion,
  reconstructFromChunks,
  getChunkingStats,
  splitIntoSentences,
  splitIntoParagraphs
};
