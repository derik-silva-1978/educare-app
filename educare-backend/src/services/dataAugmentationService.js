/**
 * Data Augmentation Service
 * FASE 10-UPGRADE: Enriquecimento Automático de Documentos
 * 
 * Responsabilidades:
 * - Geração de variações de perguntas
 * - Extração de entidades e conceitos
 * - Criação de resumos e highlights
 * - Expansão de sinônimos e termos relacionados
 */

const OpenAI = require('openai');

const openai = new OpenAI();

const AUGMENTATION_ENABLED = process.env.AUGMENTATION_ENABLED !== 'false';
const AUGMENTATION_MODEL = process.env.AUGMENTATION_MODEL || 'gpt-4o-mini';

/**
 * Gera perguntas que o documento pode responder
 */
async function generateQuestions(document, count = 5) {
  if (!AUGMENTATION_ENABLED) {
    return [];
  }

  try {
    const content = document.content || document.text || '';
    
    const prompt = `Analise o documento abaixo e gere ${count} perguntas frequentes que ele pode responder.

DOCUMENTO:
${content.substring(0, 4000)}

Gere perguntas variadas que:
- Um pai/mãe de criança pequena faria
- Um profissional de saúde infantil perguntaria
- Uma gestante poderia ter

Responda com um JSON array de strings:
["pergunta 1", "pergunta 2", ...]`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('[DataAugmentation] Erro ao gerar perguntas:', error);
    return [];
  }
}

/**
 * Extrai entidades nomeadas do documento
 */
async function extractEntities(document) {
  if (!AUGMENTATION_ENABLED) {
    return { entities: [] };
  }

  try {
    const content = document.content || document.text || '';
    
    const prompt = `Extraia as entidades importantes do texto abaixo.

TEXTO:
${content.substring(0, 3000)}

Categorias:
- MILESTONE: marcos de desenvolvimento
- AGE_RANGE: faixas etárias (ex: "0-3 meses")
- SYMPTOM: sintomas ou sinais
- ACTIVITY: atividades recomendadas
- PROFESSIONAL: tipos de profissionais
- CONCEPT: conceitos importantes

Responda com JSON:
{
  "entities": [
    {"text": "...", "type": "MILESTONE", "normalized": "..."}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('[DataAugmentation] Erro ao extrair entidades:', error);
    return { entities: [] };
  }
}

/**
 * Gera resumo do documento
 */
async function generateSummary(document, style = 'brief') {
  if (!AUGMENTATION_ENABLED) {
    return null;
  }

  try {
    const content = document.content || document.text || '';
    
    const styles = {
      brief: 'em 1-2 frases',
      detailed: 'em 3-5 frases',
      bullet: 'em 3-5 bullet points'
    };

    const prompt = `Resuma o seguinte documento ${styles[style] || styles.brief}.

DOCUMENTO:
${content.substring(0, 5000)}

Resumo:`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.3
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('[DataAugmentation] Erro ao gerar resumo:', error);
    return null;
  }
}

/**
 * Expande com sinônimos e termos relacionados
 */
async function expandTerms(keywords) {
  if (!AUGMENTATION_ENABLED || !keywords || keywords.length === 0) {
    return {};
  }

  try {
    const prompt = `Para cada termo abaixo, liste sinônimos e termos relacionados usados por pais e profissionais de saúde.

TERMOS: ${keywords.join(', ')}

Responda com JSON:
{
  "termo1": ["sinônimo1", "sinônimo2", "termo relacionado"],
  "termo2": [...]
}`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('[DataAugmentation] Erro ao expandir termos:', error);
    return {};
  }
}

/**
 * Identifica público-alvo do documento
 */
async function identifyAudience(document) {
  if (!AUGMENTATION_ENABLED) {
    return { primary: 'general', secondary: [] };
  }

  try {
    const content = document.content || document.text || '';
    
    const prompt = `Analise o documento e identifique o público-alvo.

DOCUMENTO:
${content.substring(0, 2000)}

Públicos possíveis:
- parents: pais e cuidadores
- pregnant: gestantes
- healthcare: profissionais de saúde
- educators: educadores infantis
- general: público geral

Responda com JSON:
{"primary": "...", "secondary": ["...", "..."]}`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('[DataAugmentation] Erro ao identificar audiência:', error);
    return { primary: 'general', secondary: [] };
  }
}

/**
 * Gera tags para o documento
 */
async function generateTags(document, maxTags = 10) {
  if (!AUGMENTATION_ENABLED) {
    return [];
  }

  try {
    const content = document.content || document.text || '';
    
    const prompt = `Gere até ${maxTags} tags relevantes para indexação do documento abaixo.

DOCUMENTO:
${content.substring(0, 3000)}

Tags devem ser:
- Palavras-chave específicas
- Em português
- Relevantes para busca

Responda com JSON array:
["tag1", "tag2", ...]`;

    const response = await openai.chat.completions.create({
      model: AUGMENTATION_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('[DataAugmentation] Erro ao gerar tags:', error);
    return [];
  }
}

/**
 * Aumenta documento com todos os metadados
 */
async function augmentDocument(document, options = {}) {
  if (!AUGMENTATION_ENABLED) {
    return document;
  }

  console.log(`[DataAugmentation] Enriquecendo documento: ${document.title || document.id}`);

  const startTime = Date.now();

  const [questions, entities, summary, audience, tags] = await Promise.all([
    options.skipQuestions ? [] : generateQuestions(document),
    options.skipEntities ? { entities: [] } : extractEntities(document),
    options.skipSummary ? null : generateSummary(document),
    options.skipAudience ? { primary: 'general' } : identifyAudience(document),
    options.skipTags ? [] : generateTags(document)
  ]);

  const augmented = {
    ...document,
    augmentation: {
      generated_questions: questions,
      entities: entities.entities,
      summary,
      audience,
      tags,
      augmented_at: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    }
  };

  console.log(`[DataAugmentation] Documento enriquecido em ${Date.now() - startTime}ms`);

  return augmented;
}

module.exports = {
  generateQuestions,
  extractEntities,
  generateSummary,
  expandTerms,
  identifyAudience,
  generateTags,
  augmentDocument
};
