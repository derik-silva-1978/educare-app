const { Sequelize } = require('sequelize');

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

const migrationToTable = {
  '01-create-users.js': 'users',
  '02-create-profiles.js': 'profiles',
  '03-create-children.js': 'children',
  '04-create-subscription-plans.js': 'subscription_plans',
  '05-create-subscriptions.js': 'subscriptions',
  '06-create-teams.js': 'teams',
  '07-create-team-members.js': 'team_members',
  '08-create-quizzes.js': 'quizzes',
  '09-create-questions.js': 'questions',
  '10-create-quiz-sessions.js': 'quiz_sessions',
  '11-create-answers.js': 'answers',
  '12-create-journeys.js': 'journeys',
  '13-create-user-journeys.js': 'user_journeys',
  '14-create-achievements.js': 'achievements',
  '15-create-user-achievements.js': 'user_achievements',
  '16-create-licenses.js': 'licenses',
  '17-fix-children-special-needs.js': 'children',
  '18-create-journey-v2.js': 'journey_v2_trails',
  '19-create-journey-v2-weeks.js': 'journey_v2_weeks',
  '20-create-journey-v2-topics.js': 'journey_v2_topics',
  '21-create-journey-v2-quizzes.js': 'journey_v2_quizzes',
  '22-create-journey-v2-badges.js': 'journey_v2_badges',
  '23-create-user-journey-v2-progress.js': 'user_journey_v2_progress',
  '24-create-user-journey-v2-badges.js': 'user_journey_v2_badges',
  '25-add-dev-domain-content-hash-to-v2.js': 'journey_v2_quizzes',
};

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('  DB connection OK');

    await sequelize.query(`CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) NOT NULL PRIMARY KEY)`);

    const [existing] = await sequelize.query(`SELECT name FROM "SequelizeMeta"`);
    const applied = new Set(existing.map(r => r.name));

    if (applied.size > 0) {
      console.log(`  SequelizeMeta already has ${applied.size} entries, skipping bootstrap.`);
      await sequelize.close();
      return;
    }

    let count = 0;
    for (const [migration, table] of Object.entries(migrationToTable)) {
      const [result] = await sequelize.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table)`,
        { replacements: { table } }
      );
      if (result[0].exists) {
        await sequelize.query(
          `INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT DO NOTHING`,
          { replacements: { name: migration } }
        );
        count++;
      }
    }

    console.log(`  Bootstrapped ${count} migrations into SequelizeMeta`);
    await sequelize.close();
  } catch (err) {
    console.error(`  Bootstrap error: ${err.message}`);
    process.exit(0);
  }
}

bootstrap();
