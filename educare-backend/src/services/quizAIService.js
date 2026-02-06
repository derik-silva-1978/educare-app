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

    const systemPrompts = {
      'baby-quiz': 'Você é TitiNauta Infantil, especialista em desenvolvimento infantil. Crie perguntas de quiz sobre desenvolvimento do bebê para a plataforma Educare+.',
      'mother-quiz': 'Você é TitiNauta Materna, especialista em saúde materna. Crie perguntas de quiz sobre saúde materna para a plataforma Educare+.',
      'baby-content': 'Você é TitiNauta Infantil, especialista em desenvolvimento infantil. Crie conteúdo educativo sobre desenvolvimento do bebê para a plataforma Educare+.',
      'mother-content': 'Você é TitiNauta Materna, especialista em saúde materna. Crie conteúdo educativo sobre saúde materna para a plataforma Educare+.'
    };

    const systemPrompt = systemPrompts[axis];

    let userPrompt;

    if (isQuiz) {
      userPrompt = `Gere ${count} pergunta(s) de quiz para CADA uma das semanas: ${weeks.join(', ')} do mês ${month}.
${domain ? `Domínio específico: ${domain}` : 'Domínios variados'}
${instructions ? `Instruções adicionais: ${instructions}` : ''}

Retorne um array JSON com os itens no seguinte formato:
[{
  "month": ${month},
  "week": <número da semana>,
  "title": "<título curto e descritivo>",
  "question": "<pergunta clara e acolhedora>",
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
- As opções devem ser observações/comportamentos, NÃO respostas certas/erradas
- Feedbacks acolhedores e sem julgamento
- Use linguagem simples e empática`;
    } else {
      userPrompt = `Gere ${count} conteúdo(s) educativo(s) para CADA uma das semanas: ${weeks.join(', ')} do mês ${month}.
${domain ? `Domínio específico: ${domain}` : 'Domínios variados'}
${instructions ? `Instruções adicionais: ${instructions}` : ''}

Retorne um array JSON com os itens no seguinte formato:
[{
  "month": ${month},
  "week": <número da semana>,
  "title": "<título curto e descritivo>",
  "content": {
    "microcards": [
      { "title": "<título do microcard>", "body": "<conteúdo informativo, 30-60 palavras>" }
    ],
    "action_text": "<texto de ação prática para os pais, 15-30 palavras>"
  },
  "order_index": <índice começando em 0>
}]

IMPORTANTE:
- Gere exatamente ${count} item(ns) para cada semana listada
- Os microcards devem conter informações práticas e baseadas em evidências
- O action_text deve ser uma atividade ou ação prática
- Use linguagem simples e empática`;
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
