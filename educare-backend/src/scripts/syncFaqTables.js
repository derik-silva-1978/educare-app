/**
 * Script para sincronizar as tabelas de FAQ no banco de dados externo
 * Uso: node src/scripts/syncFaqTables.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const AppFaq = require('../models/AppFaq');
const FaqUserFeedback = require('../models/FaqUserFeedback');

async function syncFaqTables() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
    
    console.log('\nSincronizando tabela app_faqs...');
    await AppFaq.sync({ alter: true });
    console.log('Tabela app_faqs sincronizada.');
    
    console.log('\nSincronizando tabela faq_user_feedback...');
    await FaqUserFeedback.sync({ alter: true });
    console.log('Tabela faq_user_feedback sincronizada.');
    
    console.log('\n✅ Sincronização concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar tabelas:', error);
    process.exit(1);
  }
}

syncFaqTables();
