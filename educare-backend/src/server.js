const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerConfig = require('./config/swagger');
require('dotenv').config();

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const childRoutes = require('./routes/childRoutes');
const quizRoutes = require('./routes/quizRoutes');
const journeyRoutes = require('./routes/journeyRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const teamRoutes = require('./routes/teamRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminChildrenRoutes = require('./routes/adminChildrenRoutes');
const journeyBotRoutes = require('./routes/journeyBotRoutes');
const titiNautaRoutes = require('./routes/titiNautaRoutes');
const adminJourneyQuestionsRoutes = require('./routes/adminJourneyQuestionsRoutes');
const journeyQuestionsRoutes = require('./routes/journeyQuestionsRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userActivitiesRoutes = require('./routes/userActivitiesRoutes');
const journeyV2Routes = require('./routes/journeyV2Routes');
const adminJourneyV2Routes = require('./routes/adminJourneyV2Routes');
const externalApiRoutes = require('./routes/externalApiRoutes');
const mediaResourceRoutes = require('./routes/mediaResourceRoutes');
const healthRoutes = require('./routes/healthRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const contentRoutes = require('./routes/contentRoutes');
const maternalHealthRoutes = require('./routes/maternalHealthRoutes');

// Stripe services
const { initStripe } = require('./services/stripeInit');
const { WebhookHandlers } = require('./services/webhookHandlers');

// Inicialização do app Express
const app = express();

app.set('trust proxy', 1);

// Rate limiters
const { generalLimiter, authLimiter, externalLimiter } = require('./middlewares/rateLimiter');

// CORS configuration
const getProductionOrigins = () => {
  if (process.env.CORS_ORIGINS) return process.env.CORS_ORIGINS.split(',');
  if (process.env.REPLIT_DOMAINS) {
    return process.env.REPLIT_DOMAINS.split(',').map(d => `https://${d}`);
  }
  return ['https://educareapp.com.br'];
};

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? getProductionOrigins()
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  maxAge: 86400
};

// Basic middlewares (before Stripe webhook)
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));

// CRITICAL: Register Stripe webhook routes BEFORE express.json()
// These routes need raw Buffer body for signature verification

// Handle webhook with UUID (managed webhook)
app.post(
  '/api/stripe/webhook/:uuid',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      const { uuid } = req.params;
      await WebhookHandlers.processWebhook(req.body, sig, uuid);

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

// Handle webhook without UUID (fallback)
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await WebhookHandlers.processWebhook(req.body, sig, null);

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

// Now apply JSON middleware for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiter globally
app.use(generalLimiter);

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(process.env.UPLOAD_PATH || './uploads'));

// Rotas
// app.use('/api', routes); // TODO: Implementar rota principal que gerencia todas as outras

// Rotas específicas
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/children', childRoutes);
app.use('/api/teams', teamRoutes);
// app.use('/api/licenses', licenseRoutes); // TODO: Implementar rotas de licenças
app.use('/api/quizzes', quizRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-invites', require('./routes/chatInviteRoutes'));
app.use('/api/team-invites', require('./routes/teamInviteRoutes'));
app.use('/api/admin/children', adminChildrenRoutes);
app.use('/api/journey-bot', journeyBotRoutes);
app.use('/api/admin/journey-questions', adminJourneyQuestionsRoutes);
app.use('/api/journey-questions', journeyQuestionsRoutes); // Rota pública para usuários
app.use('/api/activities', activityRoutes);
app.use('/api/admin/user-activities', userActivitiesRoutes);
app.use('/api/journey-v2', journeyV2Routes);
app.use('/api/admin/journey-v2', adminJourneyV2Routes);
app.use('/api/external', externalLimiter, externalApiRoutes);
// Novas rotas do TitiNauta
app.use('/api/journey', titiNautaRoutes); // Interface moderna do TitiNauta
app.use('/api/media-resources', mediaResourceRoutes); // Gestão de recursos audiovisuais
app.use('/api/maternal-health', maternalHealthRoutes);

// Rotas do RAG (Knowledge Management)
const adminKnowledgeRoutes = require('./routes/adminKnowledgeRoutes');
const ragRoutes = require('./routes/ragRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const migrationRoutes = require('./routes/migrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const guardrailsRoutes = require('./routes/guardrailsRoutes');
app.use('/api/admin/knowledge', adminKnowledgeRoutes); // Ingestão de documentos (Super Admin)
app.use('/api/rag', ragRoutes); // Consulta RAG (autenticado e via API Key)
app.use('/api/metrics', metricsRoutes); // Métricas do RAG (autenticado)
app.use('/api/admin/migration', migrationRoutes); // Migração de documentos (Super Admin)
app.use('/api/admin', adminRoutes); // FASE 09: Legacy shutdown management (Super Admin)
app.use('/api/guardrails', guardrailsRoutes); // Guardrails para n8n/WhatsApp

// Hybrid RAG routes (Gemini + PgVector)
const hybridRagRoutes = require('./routes/hybridRagRoutes');
app.use('/api/hybrid-rag', hybridRagRoutes);

// Stripe payment routes
app.use('/api/stripe', stripeRoutes);

// Content management routes (WelcomeHub)
app.use('/api/content', contentRoutes);

// FAQ Dinâmica Contextual routes
const faqRoutes = require('./routes/faqRoutes');
app.use('/api/faqs', faqRoutes);

// Public landing page chat (no auth, rate-limited)
const publicChatRoutes = require('./routes/publicChatRoutes');
app.use('/api/public/chat', publicChatRoutes);

// Milestones (Marcos do Desenvolvimento) routes
const milestonesRoutes = require('./routes/milestonesRoutes');
app.use('/api/admin/milestones', milestonesRoutes);

// Curadoria V2 (4 Eixos) routes
const curationRoutes = require('./routes/curationRoutes');
app.use('/api/admin/curation', curationRoutes);

// Development Reports routes
const developmentReportRoutes = require('./routes/developmentReportRoutes');
app.use('/api/development-reports', developmentReportRoutes);

// n8n Integration routes (v3.0 - Omnicanal)
const n8nRoutes = require('./routes/n8nRoutes');
app.use('/api/n8n', externalLimiter, n8nRoutes);

const conversationRoutes = require('./routes/conversationRoutes');
app.use('/api/conversation', conversationRoutes);

const whatsappFlowRoutes = require('./routes/whatsappFlowRoutes');
app.use('/api/whatsapp-flow', externalLimiter, whatsappFlowRoutes);

// Cloud file integration routes (Google Drive, OneDrive)
const cloudRoutes = require('./routes/cloudRoutes');
app.use('/api/cloud', cloudRoutes);

// Assistant Prompt Management routes (Owner only)
const assistantPromptRoutes = require('./routes/assistantPromptRoutes');
app.use('/api/assistant-prompts', assistantPromptRoutes);

// LLM Configuration routes (Owner only)
const llmConfigRoutes = require('./routes/llmConfigRoutes');
app.use('/api/llm-configs', llmConfigRoutes);

// AI Agents Control Center routes (Owner only)
const agentControlCenterRoutes = require('./routes/agentControlCenterRoutes');
app.use('/api/agent-control', agentControlCenterRoutes);

// Training content routes (FASE 2)
const trainingRoutes = require('./routes/trainingRoutes');
app.use('/api/trainings', trainingRoutes);

// Vimeo integration routes (FASE 2)
const vimeoRoutes = require('./routes/vimeoRoutes');
app.use('/api/vimeo', vimeoRoutes);

app.post('/api/admin/run-migrations', async (req, res) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { sequelize } = require('./config/database');
    const { Sequelize } = require('sequelize');
    const log = [];

    await sequelize.authenticate();
    log.push('DB connection OK');

    await sequelize.query(`CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) NOT NULL PRIMARY KEY)`);

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

    for (const [migration, table] of Object.entries(migrationToTable)) {
      const [already] = await sequelize.query(
        `SELECT 1 FROM "SequelizeMeta" WHERE name = :name`, { replacements: { name: migration } }
      );
      if (already.length > 0) continue;

      const [exists] = await sequelize.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table)`,
        { replacements: { table } }
      );
      if (exists[0].exists) {
        await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES (:name)`, { replacements: { name: migration } });
        log.push(`Bootstrapped: ${migration}`);
      }
    }

    const fs = require('fs');
    const pathModule = require('path');
    const migrationDir = pathModule.join(__dirname, 'database/migrations');
    const allMigrationFiles = fs.readdirSync(migrationDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    const queryInterface = sequelize.getQueryInterface();
    let hasFailure = false;

    for (const migrationFile of allMigrationFiles) {
      const [already] = await sequelize.query(
        `SELECT 1 FROM "SequelizeMeta" WHERE name = :name`, { replacements: { name: migrationFile } }
      );
      if (already.length > 0) continue;

      try {
        const migration = require(pathModule.join(migrationDir, migrationFile));
        await migration.up(queryInterface, Sequelize);
        await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES (:name)`, { replacements: { name: migrationFile } });
        log.push(`Applied: ${migrationFile}`);
      } catch (migErr) {
        log.push(`FAILED: ${migrationFile} - ${migErr.message}`);
        hasFailure = true;
        break;
      }
    }

    res.json({ success: !hasFailure, log });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Superuser migration endpoint - runs ALTER TABLE as postgres superuser
app.post('/api/admin/superuser-migrate', async (req, res) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const superuserPassword = (req.body && req.body.superuser_password) || process.env.POSTGRES_SUPERUSER_PASSWORD;
  if (!superuserPassword) {
    return res.status(500).json({ error: 'POSTGRES_SUPERUSER_PASSWORD not configured. Pass superuser_password in request body.' });
  }

  const { Sequelize } = require('sequelize');
  let superSequelize;

  try {
    superSequelize = new Sequelize(
      process.env.DB_DATABASE,
      'postgres',
      superuserPassword,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
      }
    );

    await superSequelize.authenticate();
    const log = [];

    const [usersCols] = await superSequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"
    );
    const existingCols = usersCols.map(c => c.column_name);

    if (!existingCols.includes('phone')) {
      await superSequelize.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`);
      log.push('Added phone column to users table');
    } else {
      log.push('phone column already exists in users table');
    }

    if (!existingCols.includes('phone_verified')) {
      await superSequelize.query(`ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false`);
      log.push('Added phone_verified column to users table');
    } else {
      log.push('phone_verified column already exists');
    }

    try {
      await superSequelize.query(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`);
      log.push('Created index on users.phone');
    } catch (idxErr) {
      log.push('Index creation skipped: ' + idxErr.message);
    }

    const [profilesCols] = await superSequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'"
    );
    const profileExistingCols = profilesCols.map(c => c.column_name);

    const profileMissingCols = {
      'preferences': "JSONB DEFAULT '{}'::jsonb",
      'phone': 'VARCHAR(20)',
      'avatar_url': 'VARCHAR(500)',
      'bio': 'TEXT',
      'address': 'TEXT',
      'city': 'VARCHAR(100)',
      'state': 'VARCHAR(50)',
      'zip_code': 'VARCHAR(20)',
      'country': 'VARCHAR(50)',
    };

    for (const [col, type] of Object.entries(profileMissingCols)) {
      if (!profileExistingCols.includes(col)) {
        try {
          await superSequelize.query(`ALTER TABLE profiles ADD COLUMN ${col} ${type}`);
          log.push(`Added ${col} column to profiles table`);
        } catch (colErr) {
          log.push(`Skipped profiles.${col}: ${colErr.message}`);
        }
      }
    }

    const dbUser = process.env.DB_USERNAME || 'educareapp';
    try {
      await superSequelize.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${dbUser}`);
      await superSequelize.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${dbUser}`);
      log.push(`Granted privileges to ${dbUser}`);
    } catch (grantErr) {
      log.push('Grant skipped: ' + grantErr.message);
    }

    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (superSequelize) {
      try { await superSequelize.close(); } catch (e) {}
    }
  }
});

// Update user phone number (protected by EXTERNAL_API_KEY)
app.post('/api/admin/set-user-phone', async (req, res) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email, phone } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ error: 'email and phone are required' });
  }

  try {
    const { sequelize } = require('./config/database');

    const [users] = await sequelize.query(
      `SELECT id, name, email, phone FROM users WHERE email = $1 LIMIT 1`,
      { bind: [email] }
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found with that email' });
    }

    await sequelize.query(
      `UPDATE users SET phone = $1 WHERE email = $2`,
      { bind: [phone, email] }
    );

    const [updated] = await sequelize.query(
      `SELECT id, name, email, phone FROM users WHERE email = $1 LIMIT 1`,
      { bind: [email] }
    );

    res.json({ success: true, user: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List users (admin diagnostic, protected by EXTERNAL_API_KEY)
app.get('/api/admin/list-users', async (req, res) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { sequelize } = require('./config/database');
    const [users] = await sequelize.query(
      `SELECT id, name, email, phone, role, status FROM users ORDER BY created_at DESC LIMIT 20`
    );
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Database schema diagnostic endpoint (protected by EXTERNAL_API_KEY)
app.get('/api/admin/db-status', async (req, res) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { sequelize } = require('./config/database');
    const [usersColumns] = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
    );
    const [subsColumns] = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'subscriptions' ORDER BY ordinal_position"
    );
    const [migrations] = await sequelize.query(
      "SELECT name FROM \"SequelizeMeta\" ORDER BY name DESC LIMIT 10"
    );
    res.json({ users_columns: usersColumns, subscriptions_columns: subsColumns, recent_migrations: migrations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotas de health check (sem prefixo /api para acesso direto)
app.use('/health', healthRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do EducareApp!' });
});

// Configuração do Swagger
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// Serve frontend static files in production
const path = require('path');
const frontendDistPath = path.join(__dirname, '../../dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDistPath, {
    maxAge: '1d',
    etag: true
  }));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/api-docs') || req.path.startsWith('/uploads') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do banco de dados
const { sequelize } = require('./config/database');

// Sincronizar modelos com o banco de dados
// NOTA: sync desativado pois o usuário 'educareapp' não é owner das tabelas
// Para ativar sync, execute como superuser: 
// ALTER TABLE nome_tabela OWNER TO educareapp; (para todas as tabelas)
// Ou use: GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO educareapp;
if (process.env.DB_SYNC_ENABLED === 'true') {
  (async () => {
    try {
      await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('✓ pgvector extension enabled');
    } catch (pgvErr) {
      console.warn('⚠ pgvector extension not available:', pgvErr.message);
    }

    try {
      await sequelize.sync({ alter: true });
      console.log('Banco de dados sincronizado');
    } catch (err) {
      console.error('Erro ao sincronizar banco de dados:', err);
    }

    try {
      const pgvectorService = require('./services/pgvectorService');
      await pgvectorService.ensureTables();
      console.log('✓ pgvector tables ready');
    } catch (pgvErr) {
      console.warn('⚠ pgvector tables creation failed:', pgvErr.message);
    }
  })();
} else {
  console.log('Sincronização do banco de dados desativada (DB_SYNC_ENABLED != true)');
  sequelize.authenticate()
    .then(async () => {
      console.log('Conexão com o banco de dados estabelecida com sucesso.');

      try {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('✓ pgvector extension enabled');
      } catch (pgvErr) {
        console.warn('⚠ pgvector extension not available:', pgvErr.message);
      }
      try {
        const [results] = await sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = 'assistant_llm_configs' AND column_name = 'rag_enabled'`
        );
        if (results.length === 0) {
          console.log('[AutoMigration] Adicionando colunas RAG à tabela assistant_llm_configs...');
          await sequelize.query(`ALTER TABLE assistant_llm_configs ADD COLUMN IF NOT EXISTS rag_enabled BOOLEAN NOT NULL DEFAULT false`);
          await sequelize.query(`ALTER TABLE assistant_llm_configs ADD COLUMN IF NOT EXISTS rag_knowledge_base VARCHAR(50) DEFAULT NULL`);
          await sequelize.query(`UPDATE assistant_llm_configs SET rag_enabled = true, rag_knowledge_base = 'kb_baby' WHERE module_type = 'baby' AND rag_enabled = false`);
          await sequelize.query(`UPDATE assistant_llm_configs SET rag_enabled = true, rag_knowledge_base = 'kb_mother' WHERE module_type = 'mother' AND rag_enabled = false`);
          await sequelize.query(`UPDATE assistant_llm_configs SET rag_enabled = true, rag_knowledge_base = 'kb_professional' WHERE module_type = 'professional' AND rag_enabled = false`);
          await sequelize.query(`UPDATE assistant_llm_configs SET rag_enabled = true, rag_knowledge_base = 'landing' WHERE module_type = 'landing_chat' AND rag_enabled = false`);
          console.log('[AutoMigration] Colunas RAG adicionadas e configuradas com sucesso.');
        }
      } catch (migErr) {
        console.warn('[AutoMigration] Aviso ao verificar/aplicar migração RAG:', migErr.message);
      }

      try {
        const [docsNeedUpdate] = await sequelize.query(`
          SELECT COUNT(*) as cnt FROM knowledge_documents 
          WHERE metadata IS NULL OR NOT (metadata::text LIKE '%knowledge_categories%')
        `);
        const needsBackfill = parseInt(docsNeedUpdate[0]?.cnt || '0') > 0;
        if (needsBackfill) {
          console.log('[AutoMigration] Backfill: atualizando metadata dos documentos existentes...');

          await sequelize.query(`
            UPDATE knowledge_documents kd
            SET metadata = COALESCE(kd.metadata, '{}'::jsonb) || jsonb_build_object(
              'knowledge_categories', (
                SELECT COALESCE(jsonb_agg(DISTINCT cat.category), '[]'::jsonb)
                FROM (
                  SELECT 'baby' as category FROM kb_baby WHERE migrated_from = kd.id
                  UNION ALL
                  SELECT 'mother' as category FROM kb_mother WHERE migrated_from = kd.id
                  UNION ALL
                  SELECT 'professional' as category FROM kb_professional WHERE migrated_from = kd.id
                ) cat
              ),
              'rag_providers', CASE
                WHEN kd.file_search_id IS NOT NULL THEN '["openai"]'::jsonb
                ELSE '[]'::jsonb
              END
            )
            WHERE kd.metadata IS NULL OR NOT (kd.metadata::text LIKE '%knowledge_categories%')
          `);

          const [updated] = await sequelize.query(`
            SELECT COUNT(*) as cnt FROM knowledge_documents 
            WHERE metadata::text LIKE '%knowledge_categories%'
          `);
          console.log('[AutoMigration] Backfill concluído:', updated[0]?.cnt, 'documentos atualizados.');
        }
      } catch (backfillErr) {
        console.warn('[AutoMigration] Aviso ao backfill metadata:', backfillErr.message);
      }

      try {
        const [phoneCol] = await sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone'`
        );
        if (phoneCol.length === 0) {
          console.log('[AutoMigration] Adding missing columns to users table...');
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255) UNIQUE`);
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf_cnpj VARCHAR(18) UNIQUE`);
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(255)`);
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verification_expires TIMESTAMP WITH TIME ZONE`);
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)`);
          await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255)`);
          console.log('[AutoMigration] Users table columns added successfully.');
        }
      } catch (userColErr) {
        console.warn('[AutoMigration] Warning adding users columns:', userColErr.message);
      }

      try {
        const [subCols] = await sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'next_billing_date'`
        );
        if (subCols.length === 0) {
          console.log('[AutoMigration] Adding missing columns to subscriptions table...');
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_billing_date TIMESTAMP WITH TIME ZONE`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS usage_stats JSONB DEFAULT '{}'::jsonb`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb`);
          await sequelize.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_method VARCHAR(255)`);
          console.log('[AutoMigration] Subscriptions table columns added successfully.');
        }
      } catch (subColErr) {
        console.warn('[AutoMigration] Warning adding subscriptions columns:', subColErr.message);
      }

      try {
        await sequelize.query(`
          DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'curator' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')) THEN
              ALTER TYPE "enum_users_role" ADD VALUE 'curator';
            END IF;
          END $$;
        `);
      } catch (enumErr) {
        console.warn('[AutoMigration] Warning adding curator enum:', enumErr.message);
      }

      try {
        await sequelize.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL`);
      } catch (emailErr) {
        console.warn('[AutoMigration] Warning making email nullable:', emailErr.message);
      }

      try {
        const pgvectorService = require('./services/pgvectorService');
        await pgvectorService.ensureTables();
        console.log('✓ pgvector tables ready');
      } catch (pgvErr) {
        console.warn('⚠ pgvector tables creation failed:', pgvErr.message);
      }
    })
    .catch(err => {
      console.error('Erro ao conectar ao banco de dados:', err);
    });
}

// Inicialização do servidor
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 5000) : (process.env.PORT || 3001);
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize Stripe in background (non-blocking)
  try {
    const result = await initStripe();
    if (result.initialized) {
      console.log('Stripe initialized successfully');
    } else {
      console.log('Stripe not initialized (may not be configured)');
    }
  } catch (error) {
    console.error('Error initializing Stripe:', error.message);
  }

  // Auto-seed initial data if tables are empty (non-blocking)
  try {
    const { runAutoSeed } = require('./database/auto-seed');
    await runAutoSeed();
  } catch (error) {
    console.warn('[AutoSeed] Erro (não-fatal):', error.message);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED_REJECTION]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT_EXCEPTION]', error);
  if (error.code === 'EADDRINUSE') {
    process.exit(1);
  }
});

module.exports = app;
