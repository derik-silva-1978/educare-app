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

const TITINAUTA_SYSTEM_PROMPT = `Você é TitiNauta, um assistente virtual amigável e especializado em desenvolvimento infantil da plataforma Educare+.

Seu papel é:
- Orientar pais e cuidadores sobre marcos de desenvolvimento infantil (0-6 anos)
- Responder dúvidas sobre alimentação, sono, comportamento e saúde infantil
- Fornecer dicas práticas e atividades estimuladoras para cada faixa etária
- Acalmar preocupações comuns de forma empática e baseada em evidências
- Indicar quando é importante consultar um profissional de saúde

Diretrizes:
- Use linguagem simples e acolhedora
- Seja empática e reconheça os desafios da parentalidade
- Forneça informações baseadas em evidências científicas
- Nunca faça diagnósticos médicos
- Sempre encoraje a consulta com profissionais quando apropriado
- Use emojis ocasionalmente para tornar a conversa mais acolhedora
- Mantenha respostas concisas e práticas

Contexto sobre a criança (quando disponível) será fornecido em cada mensagem.`;

async function chat(messages, childContext = null) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const systemMessage = childContext 
      ? `${TITINAUTA_SYSTEM_PROMPT}\n\nContexto da criança:\n- Nome: ${childContext.name || 'Não informado'}\n- Idade: ${childContext.ageInMonths || 'Não informada'} meses\n- Gênero: ${childContext.gender || 'Não informado'}`
      : TITINAUTA_SYSTEM_PROMPT;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      success: true,
      content: response.choices[0].message.content,
      usage: response.usage
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao comunicar com a IA'
    };
  }
}

async function generateFeedback(questionContext, userAnswer) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const prompt = `Com base na seguinte pergunta de avaliação de desenvolvimento infantil e na resposta do cuidador, gere um feedback curto, acolhedor e informativo (máximo 2-3 frases).

Pergunta: ${questionContext.question}
Domínio de desenvolvimento: ${questionContext.domain || 'Geral'}
Idade alvo: ${questionContext.minMonths}-${questionContext.maxMonths} meses
Resposta do cuidador: ${userAnswer}

Forneça um feedback que:
1. Valide a resposta do cuidador
2. Ofereça uma dica prática relacionada ao desenvolvimento
3. Seja encorajador`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é TitiNauta, um especialista em desenvolvimento infantil. Seja breve, acolhedor e prático.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return {
      success: true,
      feedback: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI Feedback Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function analyzeProgress(responses, childContext) {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return {
        success: false,
        error: 'OpenAI não configurado'
      };
    }

    const responseSummary = responses.map(r => 
      `- ${r.question}: ${r.answer}`
    ).join('\n');

    const prompt = `Analise o seguinte progresso de desenvolvimento de uma criança de ${childContext.ageInMonths} meses chamada ${childContext.name}:

${responseSummary}

Forneça uma análise breve que inclua:
1. Pontos fortes observados
2. Áreas que podem precisar de mais atenção
3. Sugestões de atividades estimuladoras
4. Quando buscar orientação profissional (se aplicável)

Mantenha um tom positivo e encorajador.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: TITINAUTA_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return {
      success: true,
      analysis: response.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
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
  chat,
  generateFeedback,
  analyzeProgress,
  isConfigured
};
