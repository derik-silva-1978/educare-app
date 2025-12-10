/**
 * Script para criar tabelas de Knowledge Base
 * Execute com: node src/scripts/createKnowledgeTables.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const KbBaby = require('../models/KbBaby');
const KbMother = require('../models/KbMother');
const KbProfessional = require('../models/KbProfessional');

async function createTables() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
    
    console.log('Criando/atualizando tabelas de Knowledge Base...');
    
    // Sincroniza as tabelas individualmente
    await KnowledgeDocument.sync({ alter: true });
    console.log('✅ Tabela knowledge_documents sincronizada');
    
    await KbBaby.sync({ alter: true });
    console.log('✅ Tabela kb_baby sincronizada');
    
    await KbMother.sync({ alter: true });
    console.log('✅ Tabela kb_mother sincronizada');
    
    await KbProfessional.sync({ alter: true });
    console.log('✅ Tabela kb_professional sincronizada');
    
    console.log('\n🎉 Todas as tabelas de Knowledge Base foram criadas/atualizadas!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createTables();
