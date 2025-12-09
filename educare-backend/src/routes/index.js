const express = require('express');
const router = express.Router();

// Importar rotas
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const childRoutes = require('./childRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const subscriptionPlanRoutes = require('./subscriptionPlanRoutes');
const quizRoutes = require('./quizRoutes');
const journeyRoutes = require('./journeyRoutes');
const achievementRoutes = require('./achievementRoutes');
const contentRoutes = require('./contentRoutes');

// Configurar rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/children', childRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/subscription-plans', subscriptionPlanRoutes);
router.use('/quizzes', quizRoutes);
router.use('/journeys', journeyRoutes);
router.use('/achievements', achievementRoutes);
router.use('/content', contentRoutes);

// Rota de status da API
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

module.exports = router;
