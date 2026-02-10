const { sequelize } = require('../config/database');

async function autoSeedContentItems() {
  try {
    const [result] = await sequelize.query(
      `SELECT COUNT(*) as cnt FROM content_items`
    );
    const count = parseInt(result[0]?.cnt || '0');

    if (count > 0) {
      console.log(`[AutoSeed] content_items já possui ${count} itens. Pulando seed.`);
      return;
    }

    console.log('[AutoSeed] content_items vazio. Inserindo conteúdo inicial...');

    const seeder = require('./seeders/04-content-items');
    const queryInterface = sequelize.getQueryInterface();
    await seeder.up(queryInterface, sequelize.constructor);

    const [afterCount] = await sequelize.query(
      `SELECT COUNT(*) as cnt FROM content_items`
    );
    console.log(`[AutoSeed] content_items: ${afterCount[0]?.cnt} itens inseridos com sucesso.`);
  } catch (err) {
    console.warn('[AutoSeed] Erro ao seed content_items (não-fatal):', err.message);
  }
}

async function autoSeedSubscriptionPlans() {
  try {
    const [result] = await sequelize.query(
      `SELECT COUNT(*) as cnt FROM subscription_plans`
    );
    const count = parseInt(result[0]?.cnt || '0');

    if (count > 0) {
      console.log(`[AutoSeed] subscription_plans já possui ${count} planos. Pulando seed.`);
      return;
    }

    console.log('[AutoSeed] subscription_plans vazio. Inserindo planos iniciais...');

    const seeder = require('./seeders/01-subscription-plans');
    const queryInterface = sequelize.getQueryInterface();
    await seeder.up(queryInterface, sequelize.constructor);

    console.log('[AutoSeed] subscription_plans inseridos com sucesso.');
  } catch (err) {
    console.warn('[AutoSeed] Erro ao seed subscription_plans (não-fatal):', err.message);
  }
}

async function runAutoSeed() {
  if (process.env.AUTO_SEED_ENABLED === 'false') {
    console.log('[AutoSeed] Desativado via AUTO_SEED_ENABLED=false');
    return;
  }

  console.log('[AutoSeed] Verificando dados iniciais...');
  await autoSeedSubscriptionPlans();
  await autoSeedContentItems();
  console.log('[AutoSeed] Verificação concluída.');
}

module.exports = { runAutoSeed };
