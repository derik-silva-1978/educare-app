const OpenAI = require('openai');

let openaiInstance = null;

function getOpenAI() {
  if (!openaiInstance && process.env.OPENAI_API_KEY) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiInstance;
}

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

function needsOptionsReformat(options) {
  if (isEmpty(options)) return true;
  if (!Array.isArray(options)) return true;
  if (options.length === 0) return true;
  const firstItem = options[0];
  if (typeof firstItem === 'string') return true;
  if (typeof firstItem === 'object' && firstItem !== null && firstItem.id && firstItem.text !== undefined && firstItem.value !== undefined) {
    return false;
  }
  return true;
}

function hasFeedbackContent(feedback) {
  if (isEmpty(feedback)) return false;
  if (typeof feedback !== 'object') return false;
  const hasPositive = !!(feedback.positive || feedback.positivo);
  const hasNegative = !!(feedback.negative || feedback.negativo);
  return hasPositive && hasNegative;
}

async function autoFillQuizFields(quiz, trail, weekNumber) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      console.error('QuizAIService: OpenAI não configurado');
      return null;
    }

    const needsOptions = needsOptionsReformat(quiz.options);
    const needsFeedback = !hasFeedbackContent(quiz.feedback);

    if (!needsOptions && !needsFeedback) {
      return {
        options_filled: false,
        feedback_filled: false,
        options: quiz.options,
        feedback: quiz.feedback
      };
    }

    const systemPrompt = trail === 'baby'
      ? 'Você é TitiNauta Infantil, especialista em desenvolvimento infantil da plataforma Educare+. Gere conteúdo acolhedor para quiz de desenvolvimento do bebê. NÃO existe resposta certa ou errada — são observações dos pais sobre o comportamento do bebê.'
      : 'Você é TitiNauta Materna, especialista em saúde materna da plataforma Educare+. Gere conteúdo acolhedor para quiz de saúde da mãe. NÃO existe resposta certa ou errada — são experiências reais da mãe.';

    const trailLabel = trail === 'baby' ? 'Desenvolvimento do Bebê' : 'Saúde Materna';

    const userPrompt = `Pergunta do quiz: "${quiz.question}"
Título: "${quiz.title}" 
Semana: ${weekNumber}
Trilha: ${trailLabel}

Gere em JSON:
{
  "options": [
    { "id": "opt1", "text": "(resposta curta, 5-15 palavras)", "value": 1 },
    { "id": "opt2", "text": "(resposta curta, 5-15 palavras)", "value": 2 },
    { "id": "opt3", "text": "(resposta curta, 5-15 palavras)", "value": 3 }
  ],
  "feedback": {
    "positive": "(mensagem acolhedora, 20-40 palavras, sem certo/errado)",
    "negative": "(mensagem respeitosa e encorajadora, 20-40 palavras, sem certo/errado)"
  }
}

IMPORTANTE:
- As opções devem ser curtas, diretas e compatíveis com a pergunta
- Sempre gere exatamente 3 opções
- Os feedbacks devem ser acolhedores e respeitosos, sem indicar certo ou errado
- Use linguagem simples e empática`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        console.error('QuizAIService: Não foi possível encontrar JSON na resposta');
        return null;
      }
    } catch (parseError) {
      console.error('QuizAIService: Erro ao parsear JSON da resposta:', parseError.message);
      return null;
    }

    return {
      options_filled: needsOptions,
      feedback_filled: needsFeedback,
      options: needsOptions ? parsed.options : quiz.options,
      feedback: needsFeedback ? parsed.feedback : quiz.feedback
    };
  } catch (error) {
    console.error('QuizAIService autoFillQuizFields Error:', error);
    return null;
  }
}

function getAgeDescription(month) {
  if (month <= 0) return 'recém-nascido';
  const years = Math.floor(month / 12);
  const months = month % 12;
  if (years === 0) return `${month} ${month === 1 ? 'mês' : 'meses'} de vida`;
  let desc = `${years} ano${years > 1 ? 's' : ''}`;
  if (months > 0) desc += ` e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  return desc;
}

function getDevStageContext(month, trail) {
  if (trail === 'mother') {
    if (month <= 6) return 'Período pós-parto inicial. Foco em recuperação, amamentação, saúde emocional e adaptação à maternidade.';
    if (month <= 12) return 'Primeiro ano como mãe. Foco em rotina, retorno ao trabalho, autocuidado e equilíbrio emocional.';
    if (month <= 24) return 'Mãe de criança pequena (1-2 anos). Foco em alimentação da família, desenvolvimento pessoal, prevenção de burnout parental.';
    if (month <= 36) return 'Mãe de criança em fase pré-escolar (2-3 anos). Foco em disciplina positiva, socialização, equilíbrio vida-trabalho.';
    if (month <= 48) return 'Mãe de criança de 3-4 anos. Foco em educação, autonomia da criança, relacionamento familiar e saúde preventiva.';
    if (month <= 60) return 'Mãe de criança de 4-5 anos. Foco em preparação escolar, comunicação e fortalecimento de vínculos.';
    return 'Mãe de criança de 5-6 anos. Foco em transição escolar, independência da criança e bem-estar materno continuado.';
  }
  if (month <= 3) return 'Recém-nascido. Marcos: reflexos, reconhecimento facial, primeiros sons, controle básico da cabeça.';
  if (month <= 6) return 'Bebê 3-6 meses. Marcos: rolar, pegar objetos, balbuciar, sorriso social, início da alimentação complementar.';
  if (month <= 9) return 'Bebê 6-9 meses. Marcos: sentar sem apoio, engatinhar, pinça inferior, primeiras sílabas, ansiedade de separação.';
  if (month <= 12) return 'Bebê 9-12 meses. Marcos: ficar em pé, primeiros passos, primeiras palavras, apontar, imitação.';
  if (month <= 18) return 'Criança 12-18 meses. Marcos: andar, vocabulário crescente, jogo simbólico inicial, independência alimentar.';
  if (month <= 24) return 'Criança 18-24 meses. Marcos: correr, frases de 2 palavras, birras, exploração ativa, desfralde possível.';
  if (month <= 36) return 'Criança 2-3 anos. Marcos: frases complexas, brincar de faz-de-conta, socialização, controle esfincteriano, autonomia.';
  if (month <= 48) return 'Criança 3-4 anos. Marcos: perguntas constantes, jogos cooperativos, desenho com formas, narrativas simples, empatia crescente.';
  if (month <= 60) return 'Criança 4-5 anos. Marcos: leitura pré-escolar, jogos com regras, amizades estáveis, raciocínio lógico inicial.';
  return 'Criança 5-6 anos. Marcos: prontidão escolar, leitura/escrita inicial, pensamento abstrato, autorregulação emocional.';
}

async function generateQuizContent(params) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      console.error('QuizAIService: OpenAI não configurado');
      return null;
    }

    const { axis, month, weeks, count, domain, instructions } = params;
    const isQuiz = axis.endsWith('-quiz');
    const trail = axis.startsWith('baby') ? 'baby' : 'mother';
    const ageDesc = getAgeDescription(month);
    const devContext = getDevStageContext(month, trail);

    const systemPrompts = {
      'baby-quiz': `Você é TitiNauta Infantil, especialista em desenvolvimento infantil de 0 a 6 anos. Crie perguntas de quiz sobre desenvolvimento da criança para a plataforma Educare+. Adapte o conteúdo à faixa etária específica.`,
      'mother-quiz': `Você é TitiNauta Materna, especialista em saúde e bem-estar materno durante toda a jornada de criação dos filhos (0-6 anos). Crie perguntas de quiz sobre saúde materna para a plataforma Educare+.`,
      'baby-content': `Você é TitiNauta Infantil, especialista em desenvolvimento infantil de 0 a 6 anos. Crie conteúdo educativo sobre desenvolvimento da criança para a plataforma Educare+. Adapte o conteúdo à faixa etária específica.`,
      'mother-content': `Você é TitiNauta Materna, especialista em saúde e bem-estar materno durante toda a jornada de criação dos filhos (0-6 anos). Crie conteúdo educativo sobre saúde materna para a plataforma Educare+.`
    };

    const systemPrompt = systemPrompts[axis];

    const contextBlock = `CONTEXTO ETÁRIO: Mês ${month} do acompanhamento — criança com aproximadamente ${ageDesc}.
${devContext}`;

    let userPrompt;

    if (isQuiz) {
      userPrompt = `${contextBlock}

Gere ${count} pergunta(s) de quiz para CADA uma das semanas: ${weeks.join(', ')} do mês ${month}.
${domain ? `Domínio específico: ${domain}` : 'Domínios variados'}
${instructions ? `Instruções adicionais: ${instructions}` : ''}

Retorne um array JSON com os itens no seguinte formato:
[{
  "month": ${month},
  "week": <número da semana (${weeks.join(', ')})>,
  "title": "<título curto e descritivo>",
  "question": "<pergunta clara e acolhedora, adequada para criança com ${ageDesc}>",
  "options": [
    { "id": "opt1", "text": "<resposta curta, 5-15 palavras>", "value": 1 },
    { "id": "opt2", "text": "<resposta curta, 5-15 palavras>", "value": 2 },
    { "id": "opt3", "text": "<resposta curta, 5-15 palavras>", "value": 3 }
  ],
  "feedback": {
    "positive": "<mensagem acolhedora, 20-40 palavras, sem certo/errado>",
    "negative": "<mensagem respeitosa e encorajadora, 20-40 palavras, sem certo/errado>"
  },
  "knowledge": {},
  "domain_id": "${domain || '<domínio_apropriado>'}"
}]

IMPORTANTE:
- Gere exatamente ${count} item(ns) para cada semana listada
- As opções devem ser observações/comportamentos adequados para criança com ${ageDesc}
- Feedbacks acolhedores e sem julgamento
- Use linguagem simples e empática
- As semanas são relativas ao mês (1-5), NÃO absolutas — alguns meses podem ter 5 semanas`;
    } else {
      userPrompt = `${contextBlock}

Gere ${count} conteúdo(s) educativo(s) para CADA uma das semanas: ${weeks.join(', ')} do mês ${month}.
${domain ? `Domínio específico: ${domain}` : 'Domínios variados'}
${instructions ? `Instruções adicionais: ${instructions}` : ''}

Retorne um array JSON com os itens no seguinte formato:
[{
  "month": ${month},
  "week": <número da semana (${weeks.join(', ')})>,
  "title": "<título curto e descritivo>",
  "content": {
    "microcards": [
      { "title": "<título do microcard>", "body": "<conteúdo informativo adequado para criança com ${ageDesc}, 30-60 palavras>" }
    ],
    "action_text": "<texto de ação prática para os pais, 15-30 palavras>"
  },
  "order_index": <índice começando em 0>
}]

IMPORTANTE:
- Gere exatamente ${count} item(ns) para cada semana listada
- Os microcards devem conter informações práticas e baseadas em evidências, adequadas à faixa etária
- O action_text deve ser uma atividade ou ação prática
- Use linguagem simples e empática
- As semanas são relativas ao mês (1-5), NÃO absolutas — alguns meses podem ter 5 semanas`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content;

    let parsed;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        console.error('QuizAIService: Não foi possível encontrar array JSON na resposta');
        return null;
      }
    } catch (parseError) {
      console.error('QuizAIService: Erro ao parsear JSON da resposta:', parseError.message);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('QuizAIService generateQuizContent Error:', error);
    return null;
  }
}

module.exports = { autoFillQuizFields, generateQuizContent };
