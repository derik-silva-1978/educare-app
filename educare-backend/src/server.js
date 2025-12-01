const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerConfig = require('./config/swagger');
require('dotenv').config();

// Importação das rotas
// const routes = require('./routes'); // TODO: Implementar rotas principais
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const childRoutes = require('./routes/childRoutes');
// const teamRoutes = require('./routes/teamRoutes'); // TODO: Implementar rotas de equipes
// const licenseRoutes = require('./routes/licenseRoutes'); // TODO: Implementar rotas de licenças
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
// Novas rotas do TitiNauta
const titiNautaRoutes = require('./routes/titiNautaRoutes');
const adminJourneyQuestionsRoutes = require('./routes/adminJourneyQuestionsRoutes');
const journeyQuestionsRoutes = require('./routes/journeyQuestionsRoutes');
const activityRoutes = require('./routes/activityRoutes');
const userActivitiesRoutes = require('./routes/userActivitiesRoutes');
const journeyV2Routes = require('./routes/journeyV2Routes');
const externalApiRoutes = require('./routes/externalApiRoutes');
const mediaResourceRoutes = require('./routes/mediaResourceRoutes');

// Inicialização do app Express
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
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

// Sincronizar modelos com o banco de dados (em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }) // Em produção, usar { force: false }
    .then(() => {
      console.log('Banco de dados sincronizado');
    })
    .catch(err => {
      console.error('Erro ao sincronizar banco de dados:', err);
    });
}

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
