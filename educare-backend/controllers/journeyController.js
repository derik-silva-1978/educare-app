/**
 * Controller para o TitiNauta Journey
 * Gerencia o conteúdo das jornadas de desenvolvimento infantil
 */

const { JourneyBotQuestion, JourneyBotSession, JourneyBotResponse } = require('../models');
const { Op } = require('sequelize');

/**
 * Busca o conteúdo da jornada para uma criança com base na idade
 */
exports.getJourneyContent = async (req, res) => {
  try {
    const { childId } = req.params;
    const { ageInMonths } = req.query;

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
    
    // Adicionar mensagem de boas-vindas
    steps.push({
      id: 'welcome',
      type: 'message',
      content: `Olá! Vamos conversar sobre o desenvolvimento no módulo ${adjustedAge}-${adjustedAge+1} meses! 🌟`
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
    
    // Adicionar mensagem de encerramento
    steps.push({
      id: 'closing',
      type: 'message',
      content: 'Parabéns! Você completou todas as perguntas deste módulo. Continue acompanhando o desenvolvimento do seu bebê!'
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
