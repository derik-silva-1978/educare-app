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
const externalApiRoutes = require('./routes/externalApiRoutes');
const mediaResourceRoutes = require('./routes/mediaResourceRoutes');
const healthRoutes = require('./routes/healthRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const contentRoutes = require('./routes/contentRoutes');

// Stripe services
const { initStripe } = require('./services/stripeInit');
const { WebhookHandlers } = require('./services/webhookHandlers');

// Inicialização do app Express
const app = express();

// Basic middlewares (before Stripe webhook)
app.use(cors());
app.use(helmet());
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(process.env.UPLOAD_PATH || './uploads'));

// Rotas
// app.use('/api', routes); // TODO: Implementar rota principal que gerencia todas as outras

// Rotas específicas
app.use('/api/auth', authRoutes);
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
app.use('/api/external', externalApiRoutes);
// Novas rotas do TitiNauta
app.use('/api/journey', titiNautaRoutes); // Interface moderna do TitiNauta
app.use('/api/media-resources', mediaResourceRoutes); // Gestão de recursos audiovisuais

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

// Stripe payment routes
app.use('/api/stripe', stripeRoutes);

// Content management routes (WelcomeHub)
app.use('/api/content', contentRoutes);

// FAQ Dinâmica Contextual routes
const faqRoutes = require('./routes/faqRoutes');
app.use('/api/faqs', faqRoutes);

// Rotas de health check (sem prefixo /api para acesso direto)
app.use('/health', healthRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do EducareApp!' });
});

// Configuração do Swagger
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

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
    .then(() => {
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
      console.error('Erro ao conectar ao banco de dados:', err);
    });
}

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
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
