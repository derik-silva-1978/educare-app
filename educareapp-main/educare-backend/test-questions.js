const { sequelize } = require('./src/config/database');
const { v4: uuidv4 } = require('uuid');

// Inicializar modelos
const JourneyBotQuestion = require('./src/models/JourneyBotQuestion')(sequelize);

async function insertTestQuestions() {
  try {
    console.log('🔄 Inserindo perguntas de teste...');
    
    const questions = [
      {
        id: uuidv4(),
        question_text: "Como está o desenvolvimento motor do seu bebê? Ele consegue sustentar a cabeça?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, sustenta bem a cabeça" },
          { value: "parcialmente", label: "Sustenta parcialmente" },
          { value: "nao", label: "Ainda não sustenta" }
        ]),
        min_age_months: 0,
        max_age_months: 6,
        category: "motor",
        order_index: 1,
        is_active: true
      },
      {
        id: uuidv4(),
        question_text: "O bebê reage a sons e vozes familiares?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, reage bem" },
          { value: "as_vezes", label: "Às vezes" },
          { value: "nao", label: "Não reage" }
        ]),
        min_age_months: 0,
        max_age_months: 6,
        category: "auditivo",
        order_index: 2,
        is_active: true
      },
      {
        id: uuidv4(),
        question_text: "A criança já caminha sozinha?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, caminha sozinha" },
          { value: "com_apoio", label: "Caminha com apoio" },
          { value: "engatinha", label: "Ainda engatinha" }
        ]),
        min_age_months: 12,
        max_age_months: 24,
        category: "motor",
        order_index: 1,
        is_active: true
      }
    ];

    for (const question of questions) {
      await JourneyBotQuestion.create(question);
      console.log(`✅ Pergunta criada: ${question.question_text.substring(0, 50)}...`);
    }

    console.log('🎉 Perguntas inseridas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao inserir perguntas:', error);
    process.exit(1);
  }
}

insertTestQuestions();
