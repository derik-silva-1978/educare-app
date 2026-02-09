#!/usr/bin/env node
'use strict';

const { Sequelize } = require('sequelize');

async function seedPlans() {
  const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );

  try {
    await sequelize.authenticate();
    console.log('  DB connected for seeding');

    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM subscription_plans');
    const count = parseInt(results[0].count, 10);

    if (count > 0) {
      console.log(`  subscription_plans already has ${count} rows, skipping seed`);
      await sequelize.close();
      return;
    }

    console.log('  subscription_plans is empty, inserting default plans...');

    await sequelize.query(`
      INSERT INTO subscription_plans (id, name, description, price, currency, billing_cycle, trial_days, features, limits, is_active, is_public, sort_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'Plano Gratuito', 'Plano básico com recursos limitados para experimentar a plataforma.', 0.00, 'BRL', 'monthly', 0, '{"ai_whatsapp":true,"basic_assessments":true,"chat_support":true,"blog_access":true}', '{"max_children":1,"max_quizzes":5,"max_journeys":2}', true, true, 1, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Básico', 'Acesso a recursos essenciais para acompanhamento do desenvolvimento infantil.', 29.90, 'BRL', 'monthly', 7, '{"ai_web":true,"basic_reports":true,"notifications":true,"academy_access":true,"blog_access":true}', '{"max_children":1,"max_quizzes":15,"max_journeys":5,"max_documents":10}', true, true, 2, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Premium', 'Acesso completo a todos os recursos para famílias.', 59.90, 'BRL', 'monthly', 7, '{"ai_web":true,"ai_whatsapp":true,"detailed_reports":true,"professional_sharing":true,"support_groups":true,"live_sessions":true,"mentoring":true,"academy_access":true,"blog_access":true}', '{"max_children":1,"max_quizzes":"unlimited","max_journeys":"unlimited","max_documents":50,"max_professionals":3}', true, true, 3, NOW(), NOW()),
        (gen_random_uuid(), 'Plano Empresarial', 'Solução completa para escolas, clínicas e instituições.', 199.90, 'BRL', 'monthly', 14, '{"ai_enterprise":true,"dashboard":true,"advanced_reports":true,"academy_full_access":true,"group_mentoring":true,"priority_support":true,"api_access":true,"custom_branding":true}', '{"max_children":5,"max_quizzes":"unlimited","max_journeys":"unlimited","max_documents":"unlimited","max_professionals":10,"max_teams":3}', true, true, 4, NOW(), NOW())
    `);

    console.log('  4 subscription plans inserted successfully!');
    await sequelize.close();
  } catch (error) {
    console.error('  Seed plans error:', error.message);
    try { await sequelize.close(); } catch (e) {}
  }
}

seedPlans();
