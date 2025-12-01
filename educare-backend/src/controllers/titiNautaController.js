/**
 * Controller para o TitiNauta Journey
 * Gerencia o conteúdo das jornadas de desenvolvimento infantil
 */

const { JourneyBotQuestion, JourneyBotSession, JourneyBotResponse, Child } = require('../models');
const { Op } = require('sequelize');
const openaiService = require('../services/openaiService');

/**
 * Busca o conteúdo da jornada para uma criança com base na idade
 */
exports.getJourneyContent = async (req, res) => {
  try {
    const { childId } = req.params;
    const { ageInMonths } = req.query;
    
    // Buscar dados da criança para personalização
    const { Child } = require('../models');
    let childName = '';
    
    try {
      const childData = await Child.findByPk(childId);
      if (childData) {
        childName = childData.name || '';
      }
    } catch (childError) {
      console.warn('Erro ao buscar dados da criança:', childError);
      // Continuar mesmo se não encontrar a criança
    }

    if (!childId) {
      return res.status(400).json({
        success: false,
        error: 'ID da criança não fornecido'
      });
    }

    // Garantir que ageInMonths seja um número
    const age = parseInt(ageInMonths, 10) || 0;
    
    // Ajuste para idade mínima de 1 mês
    const adjustedAge = Math.max(age, 1);

    // Buscar perguntas adequadas para a idade
    const questions = await JourneyBotQuestion.findAll({
      where: {
        meta_min_months: { [Op.lte]: adjustedAge },
        meta_max_months: { [Op.gte]: adjustedAge },
        is_active: true
      },
      order: [['week', 'ASC'], ['order_index', 'ASC']]
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nenhum conteúdo encontrado para esta idade'
      });
    }

    // Agrupar por semanas
    const weekGroups = questions.reduce((groups, question) => {
      const week = question.week || 1;
      if (!groups[week]) {
        groups[week] = [];
      }
      groups[week].push(question);
      return groups;
    }, {});

    // Converter para o formato esperado pelo frontend
    const steps = [];
    
    // Adicionar mensagem de boas-vindas personalizada
    steps.push({
      id: 'welcome',
      type: 'message',
      content: childName 
        ? `Olá! Vamos conversar sobre o desenvolvimento ${childName ? 'do(a) ' + childName : ''} no módulo ${adjustedAge}-${adjustedAge+1} meses! 🌟` 
        : `Olá! Vamos conversar sobre o desenvolvimento no módulo ${adjustedAge}-${adjustedAge+1} meses! 🌟`
    });

    // Adicionar perguntas como steps
    Object.keys(weekGroups).forEach(week => {
      const weekQuestions = weekGroups[week];
      
      // Adicionar título da semana
      if (weekQuestions.length > 0 && weekQuestions[0].week_title) {
        steps.push({
          id: `week-${week}-title`,
          type: 'message',
          content: `**Semana ${week}: ${weekQuestions[0].week_title}**`
        });
      }
      
      // Adicionar descrição da semana
      if (weekQuestions.length > 0 && weekQuestions[0].week_description) {
        steps.push({
          id: `week-${week}-desc`,
          type: 'message',
          content: weekQuestions[0].week_description
        });
      }
      
      // Adicionar perguntas
      weekQuestions.forEach(question => {
        // Adicionar a pergunta
        steps.push({
          id: question.id,
          type: 'question',
          content: question.domain_question || question.question,
          options: [
            { id: `${question.id}-1`, text: 'Sim, com frequência' },
            { id: `${question.id}-2`, text: 'Às vezes' },
            { id: `${question.id}-3`, text: 'Ainda não' }
          ]
        });
        
        // Adicionar feedback baseado na resposta anterior (será mostrado após a resposta)
        steps.push({
          id: `${question.id}-feedback`,
          type: 'message',
          content: question.domain_feedback_1 || 'Obrigado pela sua resposta! Vamos continuar.'
        });
      });
    });
    
    // Adicionar mensagem de encerramento personalizada
    steps.push({
      id: 'closing',
      type: 'message',
      content: childName 
        ? `Parabéns! Você completou todas as perguntas deste módulo. Continue acompanhando o desenvolvimento ${childName ? 'do(a) ' + childName : 'do seu bebê'}!` 
        : 'Parabéns! Você completou todas as perguntas deste módulo. Continue acompanhando o desenvolvimento do seu bebê!'
    });

    // Construir objeto de resposta
    const journeyContent = {
      id: `journey-${adjustedAge}-${adjustedAge+1}-months`,
      title: `Desenvolvimento ${adjustedAge}-${adjustedAge+1} meses`,
      description: `Acompanhamento do desenvolvimento infantil de ${adjustedAge} a ${adjustedAge+1} meses`,
      ageRangeMin: adjustedAge,
      ageRangeMax: adjustedAge + 1,
      steps: steps
    };

    // Buscar ou criar sessão ativa
    let session = await JourneyBotSession.findOne({
      where: {
        child_id: childId,
        status: 'active'
      }
    });

    if (!session) {
      session = await JourneyBotSession.create({
        user_id: req.user.id,
        child_id: childId,
        total_questions: steps.filter(step => step.type === 'question').length,
        answered_questions: 0,
        status: 'active',
        session_data: {}
      });
    }

    return res.json({
      success: true,
      data: journeyContent
    });
  } catch (error) {
    console.error('Erro ao buscar conteúdo da jornada:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar conteúdo da jornada'
    });
  }
};

/**
 * Salva o progresso da jornada
 */
exports.saveProgress = async (req, res) => {
  try {
    const { childId } = req.params;
    const { journeyId, currentStep, completedSteps } = req.body;

    if (!childId || !journeyId) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos'
      });
    }

    // Buscar sessão ativa
    let session = await JourneyBotSession.findOne({
      where: {
        child_id: childId,
        status: 'active'
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Sessão não encontrada'
      });
    }

    // Atualizar sessão
    await session.update({
      answered_questions: completedSteps.length,
      session_data: {
        ...session.session_data,
        journeyId,
        currentStep,
        completedSteps,
        lastUpdated: new Date()
      }
    });

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        progress: (completedSteps.length / session.total_questions) * 100
      }
    });
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao salvar progresso'
    });
  }
};

/**
 * Salva resposta de quiz
 */
exports.saveAnswer = async (req, res) => {
  try {
    const { childId } = req.params;
    const { questionId, selectedOptionId } = req.body;

    if (!childId || !questionId || !selectedOptionId) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos'
      });
    }

    // Extrair número da resposta (1, 2 ou 3) do selectedOptionId
    const answerNumber = parseInt(selectedOptionId.split('-').pop(), 10) || 1;
    
    // Mapear para texto da resposta
    const answerTexts = {
      1: 'Sim, com frequência',
      2: 'Às vezes',
      3: 'Ainda não'
    };
    
    const answerText = answerTexts[answerNumber] || 'Resposta não especificada';

    // Salvar resposta
    const response = await JourneyBotResponse.create({
      user_id: req.user.id,
      child_id: childId,
      question_id: questionId,
      answer: answerNumber,
      answer_text: answerText
    });

    // Buscar sessão ativa
    let session = await JourneyBotSession.findOne({
      where: {
        child_id: childId,
        status: 'active'
      }
    });

    if (session) {
      // Incrementar perguntas respondidas
      await session.update({
        answered_questions: session.answered_questions + 1
      });
    }

    return res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao salvar resposta'
    });
  }
};

/**
 * Busca o histórico de respostas de uma criança
 */
exports.getAnswerHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({
        success: false,
        error: 'ID da criança não fornecido'
      });
    }

    // Buscar respostas
    const responses = await JourneyBotResponse.findAll({
      where: {
        child_id: childId
      },
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de respostas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico de respostas'
    });
  }
};

/**
 * Chat com TitiNauta usando IA
 */
exports.chat = async (req, res) => {
  try {
    const { childId } = req.params;
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem não fornecida'
      });
    }

    if (!openaiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Serviço de IA não configurado'
      });
    }

    let childContext = null;
    
    if (childId) {
      try {
        const child = await Child.findByPk(childId);
        if (child) {
          const birthDate = new Date(child.birthDate);
          const today = new Date();
          const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
          
          childContext = {
            name: child.firstName || child.name,
            ageInMonths,
            gender: child.gender
          };
        }
      } catch (childError) {
        console.warn('Erro ao buscar dados da criança:', childError);
      }
    }

    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const result = await openaiService.chat(messages, childContext);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Erro ao processar mensagem'
      });
    }

    return res.json({
      success: true,
      data: {
        message: result.content,
        usage: result.usage
      }
    });
  } catch (error) {
    console.error('Erro no chat TitiNauta:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar mensagem'
    });
  }
};

/**
 * Gera feedback de IA para uma resposta de quiz
 */
exports.generateAIFeedback = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    if (!questionId || !userAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos'
      });
    }

    if (!openaiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Serviço de IA não configurado'
      });
    }

    const question = await JourneyBotQuestion.findByPk(questionId);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Pergunta não encontrada'
      });
    }

    const questionContext = {
      question: question.domain_question || question.question,
      domain: question.domain,
      minMonths: question.meta_min_months,
      maxMonths: question.meta_max_months
    };

    const result = await openaiService.generateFeedback(questionContext, userAnswer);

    if (!result.success) {
      return res.json({
        success: true,
        data: {
          feedback: question.domain_feedback_1 || 'Obrigado pela sua resposta! Vamos continuar.'
        }
      });
    }

    return res.json({
      success: true,
      data: {
        feedback: result.feedback
      }
    });
  } catch (error) {
    console.error('Erro ao gerar feedback:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao gerar feedback'
    });
  }
};

/**
 * Analisa o progresso de desenvolvimento da criança
 */
exports.analyzeProgress = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({
        success: false,
        error: 'ID da criança não fornecido'
      });
    }

    if (!openaiService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Serviço de IA não configurado'
      });
    }

    const child = await Child.findByPk(childId);
    
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Criança não encontrada'
      });
    }

    const birthDate = new Date(child.birthDate);
    const today = new Date();
    const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));

    const responses = await JourneyBotResponse.findAll({
      where: { child_id: childId },
      include: [{
        model: JourneyBotQuestion,
        as: 'question',
        attributes: ['domain_question', 'domain']
      }],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    if (responses.length === 0) {
      return res.json({
        success: true,
        data: {
          analysis: 'Ainda não há respostas suficientes para gerar uma análise. Continue acompanhando o desenvolvimento da criança através das perguntas da jornada.'
        }
      });
    }

    const formattedResponses = responses.map(r => ({
      question: r.question?.domain_question || 'Pergunta não disponível',
      answer: r.answer_text
    }));

    const childContext = {
      name: child.firstName || child.name,
      ageInMonths,
      gender: child.gender
    };

    const result = await openaiService.analyzeProgress(formattedResponses, childContext);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Erro ao analisar progresso'
      });
    }

    return res.json({
      success: true,
      data: {
        analysis: result.analysis,
        responsesAnalyzed: responses.length
      }
    });
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao analisar progresso'
    });
  }
};

/**
 * Verifica o status da integração OpenAI
 */
exports.getAIStatus = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        configured: openaiService.isConfigured(),
        provider: 'OpenAI'
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status da IA:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar status'
    });
  }
};
