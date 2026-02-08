const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/agentControlCenterController');
const { verifyToken, isOwner } = require('../middlewares/auth');

const playgroundLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: 'Limite de requisições do playground excedido. Tente novamente em 1 minuto.' }
});

router.get('/dashboard', verifyToken, isOwner, controller.getAgentsDashboard);

router.get('/agent/:module_type', verifyToken, isOwner, controller.getAgentDetail);

router.post('/playground', verifyToken, isOwner, playgroundLimiter, controller.playground);

router.get('/rankings/:module_type', verifyToken, isOwner, controller.getRankings);
router.post('/rankings/:module_type', verifyToken, isOwner, controller.upsertRanking);
router.delete('/rankings/:id', verifyToken, isOwner, controller.deleteRanking);

module.exports = router;
