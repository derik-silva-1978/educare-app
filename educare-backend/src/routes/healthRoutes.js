const express = require('express');
const router = express.Router();
const { sequelize, testConnection } = require('../config/database');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check básico do servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor operacional
 */
router.get('/', async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Health check detalhado com status de todas as conexões
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detalhes do status do sistema
 */
router.get('/detailed', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {}
  };

  // Verificar conexão com o banco de dados
  try {
    await sequelize.authenticate();
    healthStatus.services.database = {
      status: 'connected',
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      dialect: 'postgres'
    };
  } catch (error) {
    healthStatus.status = 'degraded';
    healthStatus.services.database = {
      status: 'disconnected',
      error: error.message
    };
  }

  // Verificar configurações de integração
  healthStatus.services.integrations = {
    whatsapp: {
      configured: !!process.env.PHONE_VERIFICATION_WEBHOOK,
      webhookUrl: process.env.PHONE_VERIFICATION_WEBHOOK ? 'configured' : 'not_configured'
    },
    email: {
      configured: !!process.env.EMAIL_WEBHOOK,
      webhookUrl: process.env.EMAIL_WEBHOOK ? 'configured' : 'not_configured'
    },
    stripe: {
      configured: !!process.env.STRIPE_SECRET_KEY,
      status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured'
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
    }
  };

  // Verificar variáveis de ambiente críticas
  healthStatus.config = {
    jwtConfigured: !!process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL || 'not_configured',
    externalApiKey: !!process.env.EXTERNAL_API_KEY
  };

  const statusCode = healthStatus.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: Verifica apenas a conexão com o banco de dados
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Banco de dados conectado
 *       503:
 *         description: Banco de dados desconectado
 */
router.get('/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    // Executar uma query simples para verificar se está funcional
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    
    res.json({
      status: 'connected',
      timestamp: new Date().toISOString(),
      serverTime: results[0].current_time,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE
    });
  } catch (error) {
    res.status(503).json({
      status: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Verifica se o servidor está pronto para receber requisições
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor pronto
 *       503:
 *         description: Servidor não está pronto
 */
router.get('/ready', async (req, res) => {
  const checks = {
    database: false
  };

  try {
    await sequelize.authenticate();
    checks.database = true;
  } catch (error) {
    checks.database = false;
  }

  const allReady = Object.values(checks).every(check => check === true);

  if (allReady) {
    res.json({
      status: 'ready',
      checks,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      checks,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
