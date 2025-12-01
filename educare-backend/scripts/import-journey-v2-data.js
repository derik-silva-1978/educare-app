/**
 * Script para importar dados da Jornada 2.0 dos arquivos JSON para o banco de dados
 * 
 * Este script lê os arquivos JSON da pasta jorney_v2 e importa os dados para as tabelas
 * da Jornada 2.0 no banco de dados.
 * 
 * IMPORTANTE: Antes de executar este script, certifique-se de que as migrações foram executadas:
 * npx sequelize-cli db:migrate
 * 
 * Uso: node import-journey-v2-data.js
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { 
  sequelize,
  JourneyV2, 
  JourneyV2Week, 
  JourneyV2Topic, 
  JourneyV2Quiz,
  JourneyV2Badge
} = require('../src/models');

// Caminhos para os arquivos JSON
const JOURNEYS_DIR = path.join(__dirname, '../../jorney_v2/journeys');
const QUIZZES_DIR = path.join(__dirname, '../../jorney_v2/quizzes');

// Mapeamento de IDs para referências
const idMappings = {
  journeys: {},
  weeks: {}
};

/**
 * Importa as jornadas do bebê
 */
async function importBabyJourneys() {
  try {
    console.log('Importando jornadas do bebê...');
    
    // Ler o arquivo baby-journey.json
    const babyJourneyPath = path.join(JOURNEYS_DIR, 'baby-journey.json');
    const babyJourneyData = JSON.parse(fs.readFileSync(babyJourneyPath, 'utf8'));
    
    // Criar jornada principal
    const babyJourney = await JourneyV2.create({
      trail: 'baby',
      title: 'Jornada do Bebê',
      description: 'Acompanhe o desenvolvimento do seu bebê mês a mês',
      icon: '👶'
    });
    
    idMappings.journeys['baby'] = babyJourney.id;
    
    // Processar cada mês/semana
    for (const journeyMonth of babyJourneyData) {
      const { journey } = journeyMonth;
      
      // Processar cada semana
      for (const weekData of journey) {
        const { week, title, description, topics } = weekData;
        
        // Criar semana
        const weekRecord = await JourneyV2Week.create({
          journey_id: babyJourney.id,
          week,
          title,
          description,
          icon: '📅'
        });
        
        idMappings.weeks[`baby_week_${week}`] = weekRecord.id;
        
        // Processar tópicos
        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i];
          
          await JourneyV2Topic.create({
            week_id: weekRecord.id,
            title: topic.title,
            content: topic.content,
            order_index: i
          });
        }
      }
    }
    
    console.log('Jornadas do bebê importadas com sucesso!');
  } catch (error) {
    console.error('Erro ao importar jornadas do bebê:', error);
  }
}

/**
 * Importa as jornadas da mãe
 */
async function importMotherJourneys() {
  try {
    console.log('Importando jornadas da mãe...');
    
    // Ler o arquivo mother-journey.json
    const motherJourneyPath = path.join(JOURNEYS_DIR, 'mother-journey.json');
    const motherJourneyData = JSON.parse(fs.readFileSync(motherJourneyPath, 'utf8'));
    
    // Criar jornada principal
    const motherJourney = await JourneyV2.create({
      trail: 'mother',
      title: 'Jornada da Mãe',
      description: 'Acompanhe sua jornada como mãe mês a mês',
      icon: '👩‍👦'
    });
    
    idMappings.journeys['mother'] = motherJourney.id;
    
    // Processar cada mês/semana
    for (const journeyMonth of motherJourneyData) {
      const { journey } = journeyMonth;
      
      // Processar cada semana
      for (const weekData of journey) {
        const { week, title, description, topics } = weekData;
        
        // Criar semana
        const weekRecord = await JourneyV2Week.create({
          journey_id: motherJourney.id,
          week,
          title,
          description,
          icon: '📅'
        });
        
        idMappings.weeks[`mother_week_${week}`] = weekRecord.id;
        
        // Processar tópicos
        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i];
          
          await JourneyV2Topic.create({
            week_id: weekRecord.id,
            title: topic.title,
            content: topic.content,
            order_index: i
          });
        }
      }
    }
    
    console.log('Jornadas da mãe importadas com sucesso!');
  } catch (error) {
    console.error('Erro ao importar jornadas da mãe:', error);
  }
}

/**
 * Importa os quizzes
 */
async function importQuizzes() {
  try {
    console.log('Importando quizzes...');
    
    // Ler os arquivos de quizzes
    const quizzesFiles = [
      { path: path.join(QUIZZES_DIR, 'quizzes.json'), month: null },
      { path: path.join(QUIZZES_DIR, 'quizzes-mes-2.json'), month: 2 },
      { path: path.join(QUIZZES_DIR, 'quizzes-mes-3.json'), month: 3 }
    ];
    
    for (const quizFile of quizzesFiles) {
      if (!fs.existsSync(quizFile.path)) {
        console.log(`Arquivo ${quizFile.path} não encontrado, pulando...`);
        continue;
      }
      
      const quizData = JSON.parse(fs.readFileSync(quizFile.path, 'utf8'));
      
      // Processar cada semana de quiz
      for (const [weekKey, weekData] of Object.entries(quizData)) {
        if (weekKey === 'month3Summary' || weekKey.includes('Summary')) {
          // Processar resumo do mês
          const month = weekData.month;
          const weekNumber = null;
          
          // Criar semana de resumo
          const weekRecord = await JourneyV2Week.create({
            journey_id: idMappings.journeys['baby'], // Associar ao bebê por padrão
            week: month * 100, // Usar um número grande para representar o resumo do mês
            title: weekData.title,
            description: weekData.description,
            icon: weekData.icon || '🌟',
            is_summary: true
          });
          
          // Processar domínios do bebê
          if (weekData.baby_domains) {
            for (const domain of weekData.baby_domains) {
              await JourneyV2Quiz.create({
                week_id: weekRecord.id,
                domain: 'baby_domains',
                domain_id: domain.id,
                title: domain.title,
                question: domain.question,
                options: domain.options,
                feedback: domain.feedback,
                knowledge: domain.knowledge
              });
            }
          }
          
          // Processar domínios da mãe
          if (weekData.mother_domains) {
            for (const domain of weekData.mother_domains) {
              await JourneyV2Quiz.create({
                week_id: weekRecord.id,
                domain: 'mother_domains',
                domain_id: domain.id,
                title: domain.title,
                question: domain.question,
                options: domain.options,
                feedback: domain.feedback,
                knowledge: domain.knowledge
              });
            }
          }
          
          // Processar badges
          if (weekData.badge_on_complete) {
            if (typeof weekData.badge_on_complete === 'object' && !Array.isArray(weekData.badge_on_complete)) {
              // Badge único ou separado por tipo
              if (weekData.badge_on_complete.baby) {
                const badge = weekData.badge_on_complete.baby;
                await JourneyV2Badge.create({
                  id: badge.id,
                  name: badge.nome,
                  icon: badge.icone,
                  description: badge.description,
                  type: 'baby',
                  week_id: weekRecord.id
                });
              }
              
              if (weekData.badge_on_complete.mother) {
                const badge = weekData.badge_on_complete.mother;
                await JourneyV2Badge.create({
                  id: badge.id,
                  name: badge.nome,
                  icon: badge.icone,
                  description: badge.description,
                  type: 'mother',
                  week_id: weekRecord.id
                });
              }
              
              // Badge geral
              if (weekData.badge_on_complete.id) {
                await JourneyV2Badge.create({
                  id: weekData.badge_on_complete.id,
                  name: weekData.badge_on_complete.nome,
                  icon: weekData.badge_on_complete.icone,
                  description: weekData.badge_on_complete.description,
                  type: 'general',
                  week_id: weekRecord.id
                });
              }
            }
          }
        } else {
          // Processar semana regular
          const week = weekData.week;
          const month = weekData.month;
          
          // Encontrar a semana correspondente ou criar uma nova
          let weekRecord;
          const weekId = `baby_week_${week}`;
          
          if (idMappings.weeks[weekId]) {
            weekRecord = await JourneyV2Week.findByPk(idMappings.weeks[weekId]);
          } else {
            weekRecord = await JourneyV2Week.create({
              journey_id: idMappings.journeys['baby'], // Associar ao bebê por padrão
              week,
              title: weekData.title,
              description: weekData.description,
              icon: weekData.icon || '📅'
            });
            
            idMappings.weeks[weekId] = weekRecord.id;
          }
          
          // Processar domínios do bebê
          if (weekData.baby_domains) {
            for (const domain of weekData.baby_domains) {
              await JourneyV2Quiz.create({
                week_id: weekRecord.id,
                domain: 'baby_domains',
                domain_id: domain.id,
                title: domain.title,
                question: domain.question,
                options: domain.options,
                feedback: domain.feedback,
                knowledge: domain.knowledge
              });
            }
          }
          
          // Processar domínios da mãe
          if (weekData.mother_domains) {
            for (const domain of weekData.mother_domains) {
              await JourneyV2Quiz.create({
                week_id: weekRecord.id,
                domain: 'mother_domains',
                domain_id: domain.id,
                title: domain.title,
                question: domain.question,
                options: domain.options,
                feedback: domain.feedback,
                knowledge: domain.knowledge
              });
            }
          }
          
          // Processar badges
          if (weekData.badge_on_complete) {
            if (typeof weekData.badge_on_complete === 'object' && !Array.isArray(weekData.badge_on_complete)) {
              // Badge único ou separado por tipo
              if (weekData.badge_on_complete.baby) {
                const badge = weekData.badge_on_complete.baby;
                await JourneyV2Badge.create({
                  id: badge.id,
                  name: badge.nome,
                  icon: badge.icone,
                  description: badge.description,
                  type: 'baby',
                  week_id: weekRecord.id
                });
              }
              
              if (weekData.badge_on_complete.mother) {
                const badge = weekData.badge_on_complete.mother;
                await JourneyV2Badge.create({
                  id: badge.id,
                  name: badge.nome,
                  icon: badge.icone,
                  description: badge.description,
                  type: 'mother',
                  week_id: weekRecord.id
                });
              }
              
              // Badge geral
              if (weekData.badge_on_complete.id) {
                await JourneyV2Badge.create({
                  id: weekData.badge_on_complete.id,
                  name: weekData.badge_on_complete.nome,
                  icon: weekData.badge_on_complete.icone,
                  description: weekData.badge_on_complete.description,
                  type: 'general',
                  week_id: weekRecord.id
                });
              }
            }
          }
        }
      }
    }
    
    console.log('Quizzes importados com sucesso!');
  } catch (error) {
    console.error('Erro ao importar quizzes:', error);
  }
}

/**
 * Função principal para executar a importação
 */
async function main() {
  try {
    console.log('Iniciando importação de dados da Jornada 2.0...');
    
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Importar dados
    await importBabyJourneys();
    await importMotherJourneys();
    await importQuizzes();
    
    console.log('Importação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a importação:', error);
    process.exit(1);
  }
}

// Executar o script
main();
