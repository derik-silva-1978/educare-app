const { Quiz, Question, QuizQuestion, QuizSession, Answer, Child } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar quizzes disponíveis
exports.listQuizzes = async (req, res) => {
  try {
    // Opções de filtro
    const filter = { isActive: true };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Filtro de idade
    if (req.query.ageInMonths) {
      const ageInMonths = parseInt(req.query.ageInMonths);
      filter[Op.and] = [
        { [Op.or]: [
          { ageRangeMin: { [Op.lte]: ageInMonths } },
          { ageRangeMin: null }
        ]},
        { [Op.or]: [
          { ageRangeMax: { [Op.gte]: ageInMonths } },
          { ageRangeMax: null }
        ]}
      ];
    }
    
    // Buscar quizzes
    const quizzes = await Quiz.findAll({
      where: filter,
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error('Erro ao listar quizzes:', error);
    return res.status(500).json({ error: 'Erro ao listar quizzes' });
  }
};

// Obter quiz por ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar quiz pelo ID
    const quiz = await Quiz.findByPk(id, {
      include: [
        { 
          model: Question, 
          as: 'questions',
          through: { attributes: ['order', 'weight'] }
        }
      ]
    });
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }
    
    // Verificar se o quiz está ativo ou se o usuário é admin/owner
    if (!quiz.isActive && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Quiz não disponível' });
    }
    
    return res.status(200).json({ quiz });
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    return res.status(500).json({ error: 'Erro ao buscar quiz' });
  }
};

// Criar novo quiz (admin/owner/professional)
exports.createQuiz = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      title, 
      description, 
      type, 
      category, 
      ageRangeMin, 
      ageRangeMax, 
      difficulty, 
      estimatedTime, 
      instructions, 
      isPublic, 
      questionIds,
      passingScore
    } = req.body;
    
    // Criar quiz
    const quiz = await Quiz.create({
      title,
      description,
      type,
      category,
      ageRangeMin,
      ageRangeMax,
      difficulty,
      estimatedTime,
      instructions,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user.id,
      passingScore
    });
    
    // Adicionar perguntas ao quiz
    if (questionIds && questionIds.length > 0) {
      // Verificar se todas as perguntas existem
      const questions = await Question.findAll({
        where: { id: questionIds }
      });
      
      if (questions.length !== questionIds.length) {
        // Algumas perguntas não foram encontradas
        await quiz.destroy();
        return res.status(400).json({ error: 'Uma ou mais perguntas não foram encontradas' });
      }
      
      // Adicionar perguntas ao quiz
      const quizQuestions = questionIds.map((questionId, index) => ({
        quizId: quiz.id,
        questionId,
        order: index + 1,
        weight: 1
      }));
      
      await QuizQuestion.bulkCreate(quizQuestions);
      
      // Atualizar questionOrder no quiz
      quiz.questionOrder = questionIds;
      await quiz.save();
    }
    
    return res.status(201).json({ quiz });
  } catch (error) {
    console.error('Erro ao criar quiz:', error);
    return res.status(500).json({ error: 'Erro ao criar quiz' });
  }
};

// Atualizar quiz
exports.updateQuiz = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { 
      title, 
      description, 
      type, 
      category, 
      ageRangeMin, 
      ageRangeMax, 
      difficulty, 
      estimatedTime, 
      instructions, 
      isActive,
      isPublic, 
      questionIds,
      passingScore
    } = req.body;
    
    // Buscar quiz pelo ID
    const quiz = await Quiz.findByPk(id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }
    
    // Verificar se o usuário tem permissão para atualizar o quiz
    if (quiz.createdBy !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Atualizar campos do quiz
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (type) quiz.type = type;
    if (category) quiz.category = category;
    if (ageRangeMin !== undefined) quiz.ageRangeMin = ageRangeMin;
    if (ageRangeMax !== undefined) quiz.ageRangeMax = ageRangeMax;
    if (difficulty) quiz.difficulty = difficulty;
    if (estimatedTime !== undefined) quiz.estimatedTime = estimatedTime;
    if (instructions) quiz.instructions = instructions;
    if (isActive !== undefined) quiz.isActive = isActive;
    if (isPublic !== undefined) quiz.isPublic = isPublic;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    
    // Atualizar perguntas do quiz
    if (questionIds && questionIds.length > 0) {
      // Verificar se todas as perguntas existem
      const questions = await Question.findAll({
        where: { id: questionIds }
      });
      
      if (questions.length !== questionIds.length) {
        return res.status(400).json({ error: 'Uma ou mais perguntas não foram encontradas' });
      }
      
      // Remover perguntas existentes
      await QuizQuestion.destroy({
        where: { quizId: quiz.id }
      });
      
      // Adicionar novas perguntas
      const quizQuestions = questionIds.map((questionId, index) => ({
        quizId: quiz.id,
        questionId,
        order: index + 1,
        weight: 1
      }));
      
      await QuizQuestion.bulkCreate(quizQuestions);
      
      // Atualizar questionOrder no quiz
      quiz.questionOrder = questionIds;
    }
    
    // Salvar alterações
    await quiz.save();
    
    return res.status(200).json({ quiz });
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error);
    return res.status(500).json({ error: 'Erro ao atualizar quiz' });
  }
};

// Excluir quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar quiz pelo ID
    const quiz = await Quiz.findByPk(id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }
    
    // Verificar se o usuário tem permissão para excluir o quiz
    if (quiz.createdBy !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se o quiz tem sessões
    const sessionsCount = await QuizSession.count({
      where: { quizId: id }
    });
    
    if (sessionsCount > 0) {
      // Não excluir, apenas desativar
      quiz.isActive = false;
      await quiz.save();
      
      return res.status(200).json({ 
        message: 'Quiz desativado (não excluído pois possui sessões)',
        deactivated: true
      });
    }
    
    // Remover perguntas do quiz
    await QuizQuestion.destroy({
      where: { quizId: quiz.id }
    });
    
    // Excluir quiz
    await quiz.destroy();
    
    return res.status(200).json({ message: 'Quiz excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir quiz:', error);
    return res.status(500).json({ error: 'Erro ao excluir quiz' });
  }
};

// Iniciar sessão de quiz
exports.startQuizSession = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { quizId, childId } = req.body;
    
    // Buscar quiz pelo ID
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        { 
          model: Question, 
          as: 'questions',
          through: { attributes: ['order', 'weight'] }
        }
      ]
    });
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }
    
    // Verificar se o quiz está ativo
    if (!quiz.isActive) {
      return res.status(400).json({ error: 'Quiz não está ativo' });
    }
    
    // Verificar se a criança existe e pertence ao usuário
    const child = await Child.findByPk(childId, {
      include: [{ model: Profile, as: 'profile' }]
    });
    
    if (!child) {
      return res.status(404).json({ error: 'Criança não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para acessar a criança
    if (child.profile.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
      // Verificar se o usuário é um profissional com acesso à criança
      // Implementar lógica de verificação de acesso de profissionais aqui
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Criar sessão de quiz
    const session = await QuizSession.create({
      quizId,
      childId,
      startedAt: new Date(),
      status: 'in_progress',
      metadata: {}
    });
    
    return res.status(201).json({ 
      session,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        type: quiz.type,
        instructions: quiz.instructions,
        questionCount: quiz.questions.length
      }
    });
  } catch (error) {
    console.error('Erro ao iniciar sessão de quiz:', error);
    return res.status(500).json({ error: 'Erro ao iniciar sessão de quiz' });
  }
};

// Submeter respostas de quiz
exports.submitQuizAnswers = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { sessionId } = req.params;
    const { answers, timeSpent } = req.body;
    
    // Buscar sessão pelo ID
    const session = await QuizSession.findByPk(sessionId, {
      include: [
        { model: Quiz, as: 'quiz' }
      ]
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    
    // Verificar se a sessão pertence a uma criança do usuário
    const child = await Child.findByPk(session.childId, {
      include: [{ model: Profile, as: 'profile' }]
    });
    
    if (!child || (child.profile.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner')) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a sessão já foi finalizada
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Esta sessão já foi finalizada' });
    }
    
    // Buscar perguntas do quiz
    const quizQuestions = await QuizQuestion.findAll({
      where: { quizId: session.quizId },
      include: [{ model: Question, as: 'question' }]
    });
    
    // Processar respostas
    let totalScore = 0;
    let totalPossibleScore = 0;
    
    // Criar array para armazenar respostas processadas
    const processedAnswers = [];
    
    for (const answer of answers) {
      const { questionId, answer: userAnswer } = answer;
      
      // Buscar pergunta
      const questionItem = quizQuestions.find(q => q.questionId === questionId);
      
      if (!questionItem) {
        continue; // Ignorar respostas para perguntas que não fazem parte do quiz
      }
      
      const question = questionItem.question;
      
      // Verificar se a resposta está correta
      let isCorrect = false;
      let score = 0;
      
      if (question.correctAnswer) {
        // Lógica para verificar se a resposta está correta
        // Depende do tipo de pergunta (múltipla escolha, texto, etc.)
        
        if (question.type === 'multiple_choice' || question.type === 'single_choice') {
          // Para perguntas de múltipla escolha, comparar arrays ou valores
          if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
            isCorrect = JSON.stringify(question.correctAnswer.sort()) === JSON.stringify(userAnswer.sort());
          } else {
            isCorrect = question.correctAnswer === userAnswer;
          }
        } else if (question.type === 'boolean') {
          isCorrect = question.correctAnswer === userAnswer;
        } else if (question.type === 'text') {
          // Para perguntas de texto, poderia haver lógica mais complexa
          // Por simplicidade, consideramos correto se a resposta contém a resposta correta
          if (typeof userAnswer === 'string' && typeof question.correctAnswer === 'string') {
            isCorrect = userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase());
          }
        }
        
        // Calcular pontuação
        if (isCorrect) {
          score = question.points * questionItem.weight;
        }
        
        totalScore += score;
        totalPossibleScore += question.points * questionItem.weight;
      }
      
      // Criar resposta no banco de dados
      const answerRecord = await Answer.create({
        sessionId,
        questionId,
        answer: userAnswer,
        isCorrect,
        score,
        timeSpent: answer.timeSpent || 0
      });
      
      processedAnswers.push(answerRecord);
    }
    
    // Calcular pontuação final
    const finalScore = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
    const passed = finalScore >= session.quiz.passingScore;
    
    // Atualizar sessão
    session.completedAt = new Date();
    session.status = 'completed';
    session.score = finalScore;
    session.timeSpent = timeSpent || 0;
    session.passed = passed;
    session.metadata = {
      ...session.metadata,
      totalScore,
      totalPossibleScore,
      questionCount: quizQuestions.length,
      answeredCount: processedAnswers.length
    };
    
    await session.save();
    
    return res.status(200).json({ 
      session,
      score: finalScore,
      passed,
      answers: processedAnswers
    });
  } catch (error) {
    console.error('Erro ao submeter respostas:', error);
    return res.status(500).json({ error: 'Erro ao submeter respostas' });
  }
};
