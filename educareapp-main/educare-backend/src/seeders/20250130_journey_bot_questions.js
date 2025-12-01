const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const questions = [
      // Perguntas para 0-6 meses
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
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
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
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Perguntas para 6-12 meses
      {
        id: uuidv4(),
        question_text: "O bebê já consegue sentar sem apoio?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, senta sem apoio" },
          { value: "com_apoio", label: "Senta com apoio" },
          { value: "nao", label: "Ainda não senta" }
        ]),
        min_age_months: 6,
        max_age_months: 12,
        category: "motor",
        order_index: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        question_text: "O bebê balbucia e faz sons variados?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, balbucia bastante" },
          { value: "pouco", label: "Balbucia pouco" },
          { value: "nao", label: "Não balbucia" }
        ]),
        min_age_months: 6,
        max_age_months: 12,
        category: "linguagem",
        order_index: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Perguntas para 12-24 meses
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
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        question_text: "A criança fala algumas palavras simples?",
        question_type: "multiple_choice",
        options: JSON.stringify([
          { value: "sim", label: "Sim, fala várias palavras" },
          { value: "poucas", label: "Fala poucas palavras" },
          { value: "nao", label: "Ainda não fala" }
        ]),
        min_age_months: 12,
        max_age_months: 24,
        category: "linguagem",
        order_index: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('journey_bot_questions', questions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('journey_bot_questions', null, {});
  }
};
