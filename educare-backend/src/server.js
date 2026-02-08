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

// Hybrid RAG routes (Gemini + Qdrant)
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
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Banco de dados sincronizado');
    })
    .catch(err => {
      console.error('Erro ao sincronizar banco de dados:', err);
    });
} else {
  console.log('Sincronização do banco de dados desativada (DB_SYNC_ENABLED != true)');
  sequelize.authenticate()
    .then(async () => {
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
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
});

module.exports = app;
