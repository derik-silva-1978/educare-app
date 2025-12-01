'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    return queryInterface.bulkInsert('subscription_plans', [
      {
        id: uuidv4(),
        name: 'Plano Gratuito',
        description: 'Plano básico com recursos limitados para experimentar a plataforma.',
        price: 0.00,
        currency: 'BRL',
        billing_cycle: 'monthly',
        trial_days: 0,
        features: JSON.stringify({
          ai_whatsapp: true,
          basic_assessments: true,
          chat_support: true,
          blog_access: true
        }),
        limits: JSON.stringify({
          max_children: 1,
          max_quizzes: 5,
          max_journeys: 2
        }),
        is_active: true,
        is_public: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'Plano Básico',
        description: 'Acesso a recursos essenciais para acompanhamento do desenvolvimento infantil.',
        price: 29.90,
        currency: 'BRL',
        billing_cycle: 'monthly',
        trial_days: 7,
        features: JSON.stringify({
          ai_web: true,
          basic_reports: true,
          notifications: true,
          academy_access: true,
          blog_access: true
        }),
        limits: JSON.stringify({
          max_children: 1,
          max_quizzes: 15,
          max_journeys: 5,
          max_documents: 10
        }),
        is_active: true,
        is_public: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'Plano Premium',
        description: 'Acesso completo a todos os recursos para famílias.',
        price: 59.90,
        currency: 'BRL',
        billing_cycle: 'monthly',
        trial_days: 7,
        features: JSON.stringify({
          ai_web: true,
          ai_whatsapp: true,
          detailed_reports: true,
          professional_sharing: true,
          support_groups: true,
          live_sessions: true,
          mentoring: true,
          academy_access: true,
          blog_access: true
        }),
        limits: JSON.stringify({
          max_children: 1,
          max_quizzes: 'unlimited',
          max_journeys: 'unlimited',
          max_documents: 50,
          max_professionals: 3
        }),
        is_active: true,
        is_public: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'Plano Empresarial',
        description: 'Solução completa para escolas, clínicas e instituições.',
        price: 199.90,
        currency: 'BRL',
        billing_cycle: 'monthly',
        trial_days: 14,
        features: JSON.stringify({
          ai_enterprise: true,
          dashboard: true,
          advanced_reports: true,
          academy_full_access: true,
          group_mentoring: true,
          priority_support: true,
          api_access: true,
          custom_branding: true
        }),
        limits: JSON.stringify({
          max_children: 5,
          max_quizzes: 'unlimited',
          max_journeys: 'unlimited',
          max_documents: 'unlimited',
          max_professionals: 10,
          max_teams: 3
        }),
        is_active: true,
        is_public: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('subscription_plans', null, {});
  }
};
