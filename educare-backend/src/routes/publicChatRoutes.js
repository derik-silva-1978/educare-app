const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const publicChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: {
    success: false,
    error: 'Muitas mensagens. Aguarde um momento antes de enviar outra.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
  handler: (req, res, next, options) => {
    console.warn(`[PUBLIC_CHAT] IP ${req.ip} excedeu rate limit`);
    res.status(429).json(options.message);
  }
});

const LANDING_SYSTEM_PROMPT = `Você é o assistente virtual do Educare+, a plataforma completa para desenvolvimento infantil e saúde materna.

CONTEXTO:
Você está atendendo um visitante no site do Educare+. Esta pessoa provavelmente quer conhecer a plataforma, tirar dúvidas ou entender como funciona.

SOBRE O EDUCARE+:
- Plataforma digital para acompanhamento do desenvolvimento infantil (0-6 anos) e saúde materna
- Conecta pais, educadores e profissionais de saúde
- Oferece avaliações interativas do desenvolvimento, relatórios personalizados
- Possui assistente de IA (TitiNauta) que orienta sobre marcos do desenvolvimento
- Jornada do Desenvolvimento: conteúdo educativo semanal organizado por meses
- Dashboard de saúde do bebê: gráficos de crescimento, vacinas, marcos
- Dashboard de saúde materna: acompanhamento pós-parto, bem-estar, humor
- Cursos e formação profissional na Academia Educare+
- Integração com WhatsApp para comunicação

PLANOS DISPONÍVEIS:
- Plano Gratuito: acesso básico com funcionalidades limitadas
- Plano Premium: acesso completo com todas as funcionalidades
- Plano Profissional: para profissionais de saúde e educadores

INSTRUÇÕES:
- Seja acolhedor, simpático e objetivo
- Use português do Brasil
- Responda de forma concisa (máximo 3-4 parágrafos)
- Se não souber algo específico, sugira que o visitante fale com a equipe no WhatsApp
- Não invente informações sobre preços ou funcionalidades que não foram mencionadas
- Incentive o visitante a criar uma conta gratuita para experimentar
- Se a pergunta for sobre desenvolvimento infantil ou saúde materna, responda com base no seu conhecimento`;

router.post('/', publicChatLimiter, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem é obrigatória'
      });
    }

    if (message.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem muito longa. Máximo de 500 caracteres.'
      });
    }

    const history = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-6)
      : [];

    let ragContext = '';
    try {
      const ragService = require('../services/ragService');
      const ragResult = await ragService.ask(message.trim(), {
        module_type: 'baby',
        use_file_search: false,
        tags: null,
        domain: null,
        age_range: null
      });
      if (ragResult && ragResult.success && ragResult.answer) {
        ragContext = `\n\nCONTEXTO DA BASE DE CONHECIMENTO:\n${ragResult.answer}`;
      }
    } catch (ragErr) {
      console.warn('[PUBLIC_CHAT] RAG lookup failed, proceeding without context:', ragErr.message);
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Serviço de IA temporariamente indisponível'
      });
    }

    const messages = [
      { role: 'system', content: LANDING_SYSTEM_PROMPT + ragContext }
    ];

    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content.slice(0, 500) : ''
        });
      }
    }

    messages.push({ role: 'user', content: message.trim() });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';

    return res.json({
      success: true,
      answer,
      metadata: {
        model: 'gpt-4o-mini',
        has_rag_context: !!ragContext
      }
    });
  } catch (error) {
    console.error('[PUBLIC_CHAT] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar sua mensagem. Tente novamente.'
    });
  }
});

module.exports = router;
