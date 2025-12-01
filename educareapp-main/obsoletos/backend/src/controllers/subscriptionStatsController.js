const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Controlador para estatísticas de assinaturas
 */
class SubscriptionStatsController {
  /**
   * Busca estatísticas de assinaturas por plano
   */
  async getSubscriptionStatsByPlan(req, res) {
    try {
      console.log('getSubscriptionStatsByPlan - Iniciando busca de estatísticas');

      // Query para buscar estatísticas agrupadas por plano
      const [results] = await sequelize.query(`
        SELECT 
          sp.id as plan_id,
          sp.name as plan_name,
          sp.price,
          sp.currency,
          COUNT(s.id) as total_subscriptions,
          COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscriptions,
          COUNT(CASE WHEN s.status = 'trial' THEN 1 END) as trial_subscriptions,
          COUNT(CASE WHEN s.status = 'pending' THEN 1 END) as pending_subscriptions,
          COUNT(CASE WHEN s.status = 'canceled' THEN 1 END) as canceled_subscriptions,
          COALESCE(SUM(CASE WHEN s.status IN ('active', 'trial') THEN sp.price ELSE 0 END), 0) as total_revenue
        FROM subscription_plans sp
        LEFT JOIN subscriptions s ON sp.id = s.plan_id
        WHERE sp.is_active = true
        GROUP BY sp.id, sp.name, sp.price, sp.currency
        ORDER BY sp.sort_order ASC, sp.name ASC
      `);

      console.log('getSubscriptionStatsByPlan - Resultados encontrados:', results.length);
      console.log('getSubscriptionStatsByPlan - Dados:', results);

      // Formatar dados para o frontend
      const planStats = results.map(row => ({
        planId: row.plan_id,
        planName: row.plan_name,
        price: parseFloat(row.price) || 0,
        currency: row.currency || 'BRL',
        totalSubscriptions: parseInt(row.total_subscriptions) || 0,
        activeSubscriptions: parseInt(row.active_subscriptions) || 0,
        trialSubscriptions: parseInt(row.trial_subscriptions) || 0,
        pendingSubscriptions: parseInt(row.pending_subscriptions) || 0,
        canceledSubscriptions: parseInt(row.canceled_subscriptions) || 0,
        totalRevenue: parseFloat(row.total_revenue) || 0,
        // Para compatibilidade com o frontend atual
        subscriberCount: parseInt(row.active_subscriptions) + parseInt(row.trial_subscriptions) || 0,
        revenue: (parseInt(row.active_subscriptions) + parseInt(row.trial_subscriptions)) * (parseFloat(row.price) || 0),
        growthPercentage: 0 // TODO: Implementar cálculo de crescimento
      }));

      // Calcular totais gerais
      const totalStats = {
        totalPlans: planStats.length,
        totalSubscriptions: planStats.reduce((sum, plan) => sum + plan.totalSubscriptions, 0),
        activeSubscriptions: planStats.reduce((sum, plan) => sum + plan.activeSubscriptions, 0),
        trialSubscriptions: planStats.reduce((sum, plan) => sum + plan.trialSubscriptions, 0),
        totalRevenue: planStats.reduce((sum, plan) => sum + plan.totalRevenue, 0),
        monthlyRevenue: planStats.reduce((sum, plan) => sum + plan.revenue, 0)
      };

      console.log('getSubscriptionStatsByPlan - Estatísticas totais:', totalStats);

      res.json({
        success: true,
        data: {
          planStats,
          totalStats
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas de assinaturas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar estatísticas de assinaturas',
        error: error.message
      });
    }
  }

  /**
   * Busca métricas gerais do dashboard
   */
  async getDashboardMetrics(req, res) {
    try {
      console.log('getDashboardMetrics - Iniciando busca de métricas gerais');

      // Buscar estatísticas gerais
      const [userStats] = await sequelize.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users
        FROM users
      `);

      const [subscriptionStats] = await sequelize.query(`
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
          COUNT(CASE WHEN status = 'trial' THEN 1 END) as trial_subscriptions,
          COALESCE(SUM(CASE WHEN status IN ('active', 'trial') THEN 
            (SELECT price FROM subscription_plans WHERE id = subscriptions.plan_id)
          ELSE 0 END), 0) as monthly_revenue
        FROM subscriptions
      `);

      const userStatsData = userStats[0] || {};
      const subStatsData = subscriptionStats[0] || {};

      const metrics = {
        totalUsers: parseInt(userStatsData.total_users) || 0,
        activeUsers: parseInt(userStatsData.active_users) || 0,
        totalSubscriptions: parseInt(subStatsData.total_subscriptions) || 0,
        activeSubscriptions: parseInt(subStatsData.active_subscriptions) || 0,
        trialSubscriptions: parseInt(subStatsData.trial_subscriptions) || 0,
        monthlyRevenue: parseFloat(subStatsData.monthly_revenue) || 0,
        churnRate: 0.0, // TODO: Implementar cálculo real
        systemHealth: 100,
        newUsersToday: 0, // TODO: Implementar contagem de novos usuários hoje
        conversionRate: 28.6, // TODO: Implementar cálculo real
        uptime: 99.9
      };

      console.log('getDashboardMetrics - Métricas calculadas:', metrics);

      res.json({
        success: true,
        data: metrics
      });

    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar métricas do dashboard',
        error: error.message
      });
    }
  }
}

module.exports = new SubscriptionStatsController();
