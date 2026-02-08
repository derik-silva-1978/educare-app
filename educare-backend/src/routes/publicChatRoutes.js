const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const promptService = require('../services/promptService');

const publicChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: {
    success: false,
    error: 'Muitas mensagens. Aguarde um momento antes de enviar outra.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const LANDING_SYSTEM_PROMPT = `Você é o Educare+ MyChat, assistente inteligente de pré-vendas e suporte inicial do Educare+ Tech.

OBJETIVO PRINCIPAL
- Ajudar o visitante a entender rapidamente o Educare+ Tech
- Avançar o visitante no funil de conhecimento (descoberta → interesse → ação)

CONTEXTO DO PRODUTO
Educare+ Tech é uma plataforma digital completa para acompanhamento do desenvolvimento infantil (0-6 anos) e saúde materna. Conecta pais, educadores e profissionais de saúde.

FUNCIONALIDADES PRINCIPAIS:
- Jornada do Desenvolvimento: conteúdo educativo semanal organizado por meses (trilha bebê e trilha mãe)
- TitiNauta: assistente de IA especializado em desenvolvimento infantil que responde dúvidas personalizadas
- Dashboard de saúde do bebê: gráficos de crescimento (peso, altura, perímetro cefálico), checklist de vacinas, marcos do desenvolvimento
- Dashboard de saúde materna: acompanhamento pós-parto, diário de saúde (humor, sono, alimentação), consultas
- Avaliações interativas do desenvolvimento com relatórios personalizados
- Relatórios gerados por IA para compartilhar com profissionais de saúde
- Academia Educare+: cursos e formação profissional
- Integração com WhatsApp para comunicação e acompanhamento
- Portal do Profissional: ferramentas especializadas para psicólogos, terapeutas e educadores

PLANOS DISPONÍVEIS:
- Plano Gratuito: acesso básico com funcionalidades limitadas
- Plano Premium: acesso completo com todas as funcionalidades avançadas
- Plano Profissional: para profissionais de saúde e educadores com ferramentas especializadas

REGRAS DE COMUNICAÇÃO
- Português do Brasil
- Tom acolhedor, humano e objetivo
- Respostas curtas (máximo 3-4 parágrafos)
- Fazer no máximo 1 pergunta clara de continuidade
- Nunca repetir mensagens anteriores
- Nunca inventar informações sobre preços específicos
- Se não souber algo, sugira que o visitante fale com a equipe pelo WhatsApp para informações mais detalhadas

REGRAS DE COMPORTAMENTO
- Se a mensagem for apenas um cumprimento (ex: "bom dia", "oi"):
  1) acolha o visitante
  2) explique o Educare+ Tech em 1 frase
  3) faça 1 pergunta de qualificação
- Se o visitante perguntar sobre preços específicos que você não tem, sugira falar pelo WhatsApp
- Incentive o visitante a criar uma conta gratuita para experimentar
- Se a pergunta for sobre desenvolvimento infantil ou saúde materna, responda com base no contexto da base de conhecimento quando disponível`;

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
        use_file_search: true,
        tags: null,
        domain: null,
        age_range: null
      });
      if (ragResult && ragResult.success && ragResult.answer) {
        ragContext = `\n\nCONTEXTO DA BASE DE CONHECIMENTO (use para enriquecer sua resposta):\n${ragResult.answer}`;
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

    let systemPrompt = LANDING_SYSTEM_PROMPT;
    try {
      const centralPrompt = await promptService.getProcessedPrompt('landing_chat');
      if (centralPrompt) {
        systemPrompt = centralPrompt.systemPrompt;
        console.log(`[LandingChat] Usando prompt da Central: v${centralPrompt.version}`);
      }
    } catch (err) {
      console.warn('[LandingChat] Fallback para prompt local:', err.message);
    }

    const chatMessages = [
      { role: 'system', content: systemPrompt + ragContext }
    ];

    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        chatMessages.push({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content.slice(0, 500) : ''
        });
      }
    }

    chatMessages.push({ role: 'user', content: message.trim() });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';

    console.log(`[PUBLIC_CHAT] Processed message (RAG: ${!!ragContext}) - ${message.trim().substring(0, 50)}...`);

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
