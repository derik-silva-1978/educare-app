require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../src/config/database');

const JourneyV2 = require('../src/models/JourneyV2');
const JourneyV2Week = require('../src/models/JourneyV2Week');
const JourneyV2Topic = require('../src/models/JourneyV2Topic');
const JourneyV2Quiz = require('../src/models/JourneyV2Quiz');
const JourneyV2Badge = require('../src/models/JourneyV2Badge');

const CONTENT_DIR = path.resolve(__dirname, '../../conteudo_quiz');

async function syncTables() {
  console.log('Sincronizando tabelas da Jornada 2.0...');
  await JourneyV2.sync({ force: true });
  await JourneyV2Week.sync({ force: true });
  await JourneyV2Topic.sync({ force: true });
  await JourneyV2Quiz.sync({ force: true });
  await JourneyV2Badge.sync({ force: true });
  console.log('Tabelas criadas com sucesso.');
}

async function importJourneyContent(filePath, trail) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`\nImportando ${trail} journey (${data.length} meses)...`);

  const weekIdMap = {};

  for (const monthEntry of data) {
    const monthNumber = parseInt(monthEntry.title.match(/Mês (\d+)/)?.[1] || '0');

    const journey = await JourneyV2.create({
      trail,
      title: monthEntry.title,
      month: monthNumber
    });

    console.log(`  Mês ${monthNumber}: ${monthEntry.title}`);

    for (const weekEntry of monthEntry.journey) {
      const hasQuizRef = !!weekEntry.interactive_flow?.quiz_ref;

      const week = await JourneyV2Week.create({
        journey_id: journey.id,
        week: weekEntry.week,
        title: weekEntry.title,
        description: weekEntry.description,
        is_summary: false
      });

      weekIdMap[`${trail}_week_${weekEntry.week}`] = week.id;

      for (let i = 0; i < weekEntry.topics.length; i++) {
        const topic = weekEntry.topics[i];

        await JourneyV2Topic.create({
          week_id: week.id,
          title: topic.title,
          content: topic.content,
          order_index: i
        });

        if (topic.content?.badge) {
          const badge = topic.content.badge;
          try {
            await JourneyV2Badge.create({
              id: badge.id,
              name: badge.nome || badge.name || badge.id,
              icon: badge.icone || badge.icon || '',
              description: badge.description || '',
              type: 'topic',
              week_id: week.id
            });
          } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') throw e;
          }
        }
      }

      console.log(`    Semana ${weekEntry.week}: ${weekEntry.topics.length} tópicos${hasQuizRef ? ' (quiz_ref)' : ''}`);
    }
  }

  return weekIdMap;
}

async function importQuizzes(filePath, babyWeekMap, motherWeekMap) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const keys = Object.keys(data);
  console.log(`\nImportando quizzes (${keys.length} entradas)...`);

  for (const key of keys) {
    const entry = data[key];
    const weekNum = entry.week;
    const isSummary = entry.summary === true;
    const monthNum = entry.month;

    let babyWeekId = babyWeekMap[`baby_week_${weekNum}`];
    let motherWeekId = motherWeekMap[`mother_week_${weekNum}`];

    if (isSummary) {
      const summaryJourney = await JourneyV2.findOne({
        where: { trail: 'baby', month: monthNum }
      });

      if (summaryJourney) {
        const summaryWeek = await JourneyV2Week.create({
          journey_id: summaryJourney.id,
          week: weekNum || monthNum * 4,
          title: entry.title,
          description: entry.description,
          icon: entry.icon,
          is_summary: true
        });
        babyWeekId = summaryWeek.id;
        motherWeekId = summaryWeek.id;

        if (entry.recomendacao_geral) {
          await JourneyV2Topic.create({
            week_id: summaryWeek.id,
            title: 'Recomendação Geral',
            content: { text: entry.recomendacao_geral, type: 'summary_recommendation' },
            order_index: 0
          });
        }

        if (entry.badge_on_complete) {
          const badge = entry.badge_on_complete;
          try {
            await JourneyV2Badge.create({
              id: badge.id,
              name: badge.nome || badge.name || '',
              icon: badge.icone || badge.icon || '',
              description: badge.descricao || badge.description || '',
              type: 'month_summary',
              week_id: summaryWeek.id
            });
          } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') throw e;
          }
        }

        console.log(`  ${key}: summary do mês ${monthNum}`);
      }
    }

    if (entry.baby_domains && babyWeekId) {
      for (const domain of entry.baby_domains) {
        await JourneyV2Quiz.create({
          week_id: babyWeekId,
          domain: 'baby',
          domain_id: domain.id,
          title: domain.title,
          question: domain.question,
          options: domain.options,
          feedback: domain.feedback,
          knowledge: domain.knowledge
        });
      }
    }

    if (entry.mother_domains && motherWeekId) {
      for (const domain of entry.mother_domains) {
        await JourneyV2Quiz.create({
          week_id: motherWeekId,
          domain: 'mother',
          domain_id: domain.id,
          title: domain.title,
          question: domain.question,
          options: domain.options,
          feedback: domain.feedback,
          knowledge: domain.knowledge
        });
      }
    }

    if (entry.badge_on_complete && !isSummary) {
      const badges = entry.badge_on_complete;

      if (badges.baby && babyWeekId) {
        try {
          await JourneyV2Badge.create({
            id: badges.baby.id,
            name: badges.baby.nome || badges.baby.name || '',
            icon: badges.baby.icone || badges.baby.icon || '',
            description: badges.baby.description || '',
            type: 'quiz_baby',
            week_id: babyWeekId
          });
        } catch (e) {
          if (e.name !== 'SequelizeUniqueConstraintError') throw e;
        }
      }

      if (badges.mother && motherWeekId) {
        try {
          await JourneyV2Badge.create({
            id: badges.mother.id,
            name: badges.mother.nome || badges.mother.name || '',
            icon: badges.mother.icone || badges.mother.icon || '',
            description: badges.mother.description || '',
            type: 'quiz_mother',
            week_id: motherWeekId
          });
        } catch (e) {
          if (e.name !== 'SequelizeUniqueConstraintError') throw e;
        }
      }
    }

    if (!isSummary) {
      console.log(`  ${key}: ${(entry.baby_domains || []).length} baby + ${(entry.mother_domains || []).length} mother domains`);
    }
  }
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados OK.\n');

    await syncTables();

    const babyFile = path.join(CONTENT_DIR, 'baby-journey.json');
    const motherFile = path.join(CONTENT_DIR, 'mother-journey.json');
    const quizFile = path.join(CONTENT_DIR, 'quizzes.json');

    const babyWeekMap = await importJourneyContent(babyFile, 'baby');
    const motherWeekMap = await importJourneyContent(motherFile, 'mother');
    await importQuizzes(quizFile, babyWeekMap, motherWeekMap);

    const journeyCount = await JourneyV2.count();
    const weekCount = await JourneyV2Week.count();
    const topicCount = await JourneyV2Topic.count();
    const quizCount = await JourneyV2Quiz.count();
    const badgeCount = await JourneyV2Badge.count();

    console.log('\n=== Resumo da Importação ===');
    console.log(`Jornadas (meses):  ${journeyCount}`);
    console.log(`Semanas:           ${weekCount}`);
    console.log(`Tópicos:           ${topicCount}`);
    console.log(`Quiz Domains:      ${quizCount}`);
    console.log(`Badges:            ${badgeCount}`);
    console.log('============================\n');
    console.log('Importação concluída com sucesso!');

    process.exit(0);
  } catch (error) {
    console.error('Erro na importação:', error);
    process.exit(1);
  }
}

main();
