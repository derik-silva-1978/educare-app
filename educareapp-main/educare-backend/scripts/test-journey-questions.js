const { JourneyBotQuestion } = require('../src/models');

async function testJourneyQuestions() {
  try {
    console.log('🧪 Testando operações CRUD do modelo JourneyBotQuestion...');

    // Teste 1: Criar uma pergunta
    console.log('\n1️⃣ Testando criação de pergunta...');
    const newQuestion = await JourneyBotQuestion.create({
      question_text: 'Seu bebê consegue sustentar a cabeça quando está de bruços?',
      question_type: 'multiple_choice',
      options: [
        { value: 'sim', label: 'Sim, sempre' },
        { value: 'as_vezes', label: 'Às vezes' },
        { value: 'nao', label: 'Ainda não' }
      ],
      min_age_months: 2,
      max_age_months: 4,
      category: 'motor',
      order_index: 1,
      is_active: true,
      feedback_positive: 'Excelente! Seu bebê está desenvolvendo bem a força do pescoço.',
      feedback_negative: 'Não se preocupe, cada bebê tem seu ritmo. Continue estimulando.',
      feedback_neutral: 'Continue praticando! O desenvolvimento acontece gradualmente.',
      tips: {
        activities: ['Tempo de bruços supervisionado', 'Brinquedos coloridos à frente'],
        warning_signs: ['Não consegue sustentar aos 4 meses']
      }
    });
    console.log('✅ Pergunta criada com ID:', newQuestion.id);

    // Teste 2: Listar perguntas
    console.log('\n2️⃣ Testando listagem de perguntas...');
    const questions = await JourneyBotQuestion.findAll({
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    console.log(`✅ Encontradas ${questions.length} perguntas`);

    // Teste 3: Buscar por filtros
    console.log('\n3️⃣ Testando busca por filtros...');
    const motorQuestions = await JourneyBotQuestion.findAll({
      where: {
        category: 'motor',
        is_active: true
      }
    });
    console.log(`✅ Encontradas ${motorQuestions.length} perguntas da categoria motor`);

    // Teste 4: Contar total
    console.log('\n4️⃣ Testando contagem total...');
    const totalCount = await JourneyBotQuestion.count();
    console.log(`✅ Total de perguntas no banco: ${totalCount}`);

    // Teste 5: Atualizar pergunta
    console.log('\n5️⃣ Testando atualização de pergunta...');
    await newQuestion.update({
      question_text: 'Seu bebê consegue sustentar a cabeça quando está de bruços? (Atualizada)'
    });
    console.log('✅ Pergunta atualizada com sucesso');

    // Teste 6: Deletar pergunta de teste
    console.log('\n6️⃣ Limpando pergunta de teste...');
    await newQuestion.destroy();
    console.log('✅ Pergunta de teste removida');

    console.log('\n🎉 Todos os testes passaram! O modelo JourneyBotQuestion está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    console.error('Stack:', error.stack);
  }
}

testJourneyQuestions();
