const { Subscription, SubscriptionPlan, User, Profile } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Obter todas as assinaturas do usuário autenticado
exports.getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar todas as assinaturas do usuário
    const subscriptions = await Subscription.findAll({
      where: { userId },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({ subscriptions });
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    return res.status(500).json({ error: 'Erro ao buscar assinaturas' });
  }
};

// Obter assinatura ativa do usuário autenticado
exports.getMyActiveSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar assinatura ativa do usuário
    const subscription = await Subscription.findOne({
      where: { 
        userId, 
        status: ['active', 'trial', 'past_due'] 
      },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    return res.status(200).json({ subscription });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao buscar assinatura' });
  }
};

// Listar histórico de assinaturas do usuário autenticado
exports.getMySubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar todas as assinaturas do usuário
    const subscriptions = await Subscription.findAll({
      where: { userId },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({ subscriptions });
  } catch (error) {
    console.error('Erro ao buscar histórico de assinaturas:', error);
    return res.status(500).json({ error: 'Erro ao buscar histórico de assinaturas' });
  }
};

// Criar nova assinatura (iniciar trial ou assinar plano)
exports.createSubscription = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { planId, paymentMethodId, isTrial } = req.body;
    
    // Buscar plano pelo ID
    const plan = await SubscriptionPlan.findByPk(planId);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    
    if (!plan.isActive) {
      return res.status(400).json({ error: 'Este plano não está mais disponível' });
    }
    
    // Verificar se o usuário já tem uma assinatura ativa
    const activeSubscription = await Subscription.findOne({
      where: { 
        userId, 
        status: ['active', 'trial'] 
      }
    });
    
    if (activeSubscription) {
      return res.status(400).json({ 
        error: 'Você já possui uma assinatura ativa',
        currentSubscription: {
          id: activeSubscription.id,
          status: activeSubscription.status,
          planId: activeSubscription.planId
        }
      });
    }
    
    // Determinar status inicial e datas
    const now = new Date();
    let status = 'active';
    let trialEndsAt = null;
    let currentPeriodEndsAt = new Date(now);
    
    // Se for trial e o plano permite trial
    if (isTrial && plan.trialDays > 0) {
      status = 'trial';
      trialEndsAt = new Date(now);
      trialEndsAt.setDate(trialEndsAt.getDate() + plan.trialDays);
      currentPeriodEndsAt = new Date(trialEndsAt);
    } else {
      // Calcular próxima data de cobrança
      if (plan.interval === 'month') {
        currentPeriodEndsAt.setMonth(currentPeriodEndsAt.getMonth() + plan.intervalCount);
      } else if (plan.interval === 'year') {
        currentPeriodEndsAt.setFullYear(currentPeriodEndsAt.getFullYear() + plan.intervalCount);
      } else if (plan.interval === 'week') {
        currentPeriodEndsAt.setDate(currentPeriodEndsAt.getDate() + (7 * plan.intervalCount));
      } else if (plan.interval === 'day') {
        currentPeriodEndsAt.setDate(currentPeriodEndsAt.getDate() + plan.intervalCount);
      }
    }
    
    // Criar assinatura
    const subscription = await Subscription.create({
      userId,
      planId,
      status,
      startDate: now,
      trialEndsAt,
      currentPeriodStartsAt: now,
      currentPeriodEndsAt,
      paymentMethodId,
      childrenCount: 0,
      metadata: {}
    });
    
    return res.status(201).json({ 
      subscription,
      plan
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao criar assinatura' });
  }
};

// Cancelar assinatura
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar assinatura pelo ID
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para cancelar a assinatura
    if (subscription.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a assinatura já está cancelada
    if (subscription.status === 'canceled') {
      return res.status(400).json({ error: 'Assinatura já está cancelada' });
    }
    
    // Atualizar status da assinatura
    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    await subscription.save();
    
    return res.status(200).json({ 
      message: 'Assinatura cancelada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
};

// ========== MÉTODOS ADMINISTRATIVOS ==========

// Listar todas as assinaturas (apenas admin/owner)
exports.getAllSubscriptions = async (req, res) => {
  try {
    // Verificar se o usuário é admin ou owner
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    console.log('🔍 Buscando todas as assinaturas...');

    // Buscar todas as assinaturas com dados do usuário e plano
    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['id', 'name', 'type', 'phone']
          }]
        },
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'price', 'billing_cycle', 'currency', 'features', 'limits']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Contar total
    const total = subscriptions.length;

    console.log(`✅ ${total} assinaturas encontradas`);

    return res.status(200).json({ 
      subscriptions,
      total
    });
  } catch (error) {
    console.error('Erro ao buscar todas as assinaturas:', error);
    return res.status(500).json({ error: 'Erro ao buscar assinaturas' });
  }
};

// Obter estatísticas de assinaturas (apenas admin/owner)
exports.getSubscriptionStats = async (req, res) => {
  try {
    // Verificar se o usuário é admin ou owner
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    console.log('📊 Calculando estatísticas de assinaturas...');

    // Buscar estatísticas básicas
    const totalSubscriptions = await Subscription.count();
    const activeSubscriptions = await Subscription.count({ where: { status: 'active' } });
    const trialSubscriptions = await Subscription.count({ where: { status: 'trial' } });
    const expiredSubscriptions = await Subscription.count({ where: { status: 'expired' } });
    const canceledSubscriptions = await Subscription.count({ where: { status: 'canceled' } });

    // Calcular novas assinaturas este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newThisMonth = await Subscription.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    // Calcular receita mensal (estimativa baseada em planos ativos)
    const activeSubscriptionsWithPlans = await Subscription.findAll({
      where: { status: 'active' },
      include: [{
        model: SubscriptionPlan,
        as: 'plan',
        attributes: ['price', 'billing_cycle']
      }]
    });

    let monthlyRevenue = 0;
    activeSubscriptionsWithPlans.forEach(sub => {
      if (sub.plan) {
        if (sub.plan.billing_cycle === 'monthly') {
          monthlyRevenue += sub.plan.price;
        } else if (sub.plan.billing_cycle === 'yearly') {
          monthlyRevenue += sub.plan.price / 12;
        }
      }
    });

    // Calcular taxa de conversão (trial para ativo)
    const conversionRate = trialSubscriptions > 0 ? 
      ((activeSubscriptions / (activeSubscriptions + trialSubscriptions)) * 100).toFixed(1) : 0;

    // Calcular crescimento da receita (simulado - em produção seria baseado em dados históricos)
    const revenueGrowth = 15.2; // Placeholder

    const stats = {
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      expiredSubscriptions,
      canceledSubscriptions,
      newThisMonth,
      monthlyRevenue,
      revenueGrowth,
      conversionRate: parseFloat(conversionRate),
      churnRate: 5.8 // Placeholder
    };

    console.log('✅ Estatísticas calculadas:', stats);

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao calcular estatísticas' });
  }
};

// Suspender assinatura (apenas admin/owner)
exports.suspendSubscription = async (req, res) => {
  try {
    // Verificar se o usuário é admin ou owner
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    
    console.log('⏸️ Suspendendo assinatura:', id);

    // Buscar assinatura
    const subscription = await Subscription.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: SubscriptionPlan, as: 'plan', attributes: ['id', 'name'] }
      ]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se já está suspensa
    if (subscription.status === 'suspended') {
      return res.status(400).json({ error: 'Assinatura já está suspensa' });
    }
    
    // Suspender assinatura
    subscription.status = 'suspended';
    subscription.suspendedAt = new Date();
    await subscription.save();
    
    console.log('✅ Assinatura suspensa com sucesso');
    
    return res.status(200).json({ 
      message: 'Assinatura suspensa com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao suspender assinatura:', error);
    return res.status(500).json({ error: 'Erro ao suspender assinatura' });
  }
};

// Reativar assinatura (apenas admin/owner)
exports.reactivateSubscription = async (req, res) => {
  try {
    // Verificar se o usuário é admin ou owner
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    
    console.log('▶️ Reativando assinatura:', id);

    // Buscar assinatura
    const subscription = await Subscription.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: SubscriptionPlan, as: 'plan', attributes: ['id', 'name'] }
      ]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se pode ser reativada
    if (subscription.status === 'active') {
      return res.status(400).json({ error: 'Assinatura já está ativa' });
    }
    
    if (subscription.status === 'canceled') {
      return res.status(400).json({ error: 'Assinatura cancelada não pode ser reativada' });
    }
    
    // Reativar assinatura
    subscription.status = 'active';
    subscription.suspendedAt = null;
    await subscription.save();
    
    console.log('✅ Assinatura reativada com sucesso');
    
    return res.status(200).json({ 
      message: 'Assinatura reativada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao reativar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao reativar assinatura' });
  }
};

// Atualizar assinatura (apenas admin/owner)
exports.updateSubscription = async (req, res) => {
  try {
    // Verificar se o usuário é admin ou owner
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    const updateData = req.body;
    
    console.log('🔄 Atualizando assinatura:', id, updateData);

    // Buscar assinatura
    const subscription = await Subscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Atualizar campos permitidos
    const allowedFields = ['status', 'endDate', 'nextBillingDate', 'autoRenew'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });
    
    // Atualizar assinatura
    await subscription.update(filteredData);
    
    // Buscar assinatura atualizada com relacionamentos
    const updatedSubscription = await Subscription.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: SubscriptionPlan, as: 'plan', attributes: ['id', 'name', 'price'] }
      ]
    });
    
    console.log('✅ Assinatura atualizada com sucesso');
    
    return res.status(200).json({ 
      message: 'Assinatura atualizada com sucesso',
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao atualizar assinatura' });
  }
};

// Renovar assinatura
exports.renewSubscription = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const userId = req.user.id;
    const { paymentMethodId } = req.body;
    
    // Buscar assinatura pelo ID
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para renovar a assinatura
    if (subscription.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a assinatura está expirada ou cancelada
    if (!['expired', 'canceled', 'past_due'].includes(subscription.status)) {
      return res.status(400).json({ error: 'Apenas assinaturas expiradas, canceladas ou com pagamento pendente podem ser renovadas' });
    }
    
    // Calcular novas datas
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscription.plan.durationMonths);
    
    // Atualizar assinatura
    subscription.status = 'active';
    subscription.startDate = now;
    subscription.endDate = endDate;
    subscription.canceledAt = null;
    
    // Se foi fornecido um novo método de pagamento, atualizar
    if (paymentMethodId) {
      subscription.paymentMethodId = paymentMethodId;
    }
    
    await subscription.save();
    
    return res.status(200).json({ 
      message: 'Assinatura renovada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao renovar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao renovar assinatura' });
  }
};

// Mudar plano de assinatura
exports.changePlan = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { id } = req.params;
    const { newPlanId, immediateChange } = req.body;
    
    // Buscar assinatura pelo ID
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para alterar a assinatura
    if (subscription.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Verificar se a assinatura está ativa
    if (subscription.status !== 'active' && subscription.status !== 'trial') {
      return res.status(400).json({ error: 'Apenas assinaturas ativas podem ser alteradas' });
    }
    
    // Buscar novo plano
    const newPlan = await SubscriptionPlan.findByPk(newPlanId);
    
    if (!newPlan) {
      return res.status(404).json({ error: 'Novo plano não encontrado' });
    }
    
    if (!newPlan.isActive) {
      return res.status(400).json({ error: 'Este plano não está mais disponível' });
    }
    
    // Verificar limites do novo plano
    if (subscription.childrenCount > newPlan.maxChildren) {
      return res.status(400).json({ 
        error: 'Você possui mais crianças do que o novo plano permite',
        currentCount: subscription.childrenCount,
        newLimit: newPlan.maxChildren
      });
    }
    
    // Atualizar assinatura
    subscription.planId = newPlanId;
    
    // Se for mudança imediata, atualizar datas de período
    if (immediateChange) {
      const now = new Date();
      subscription.currentPeriodStartsAt = now;
      
      // Calcular nova data de término do período
      const currentPeriodEndsAt = new Date(now);
      if (newPlan.interval === 'month') {
        currentPeriodEndsAt.setMonth(currentPeriodEndsAt.getMonth() + newPlan.intervalCount);
      } else if (newPlan.interval === 'year') {
        currentPeriodEndsAt.setFullYear(currentPeriodEndsAt.getFullYear() + newPlan.intervalCount);
      } else if (newPlan.interval === 'week') {
        currentPeriodEndsAt.setDate(currentPeriodEndsAt.getDate() + (7 * newPlan.intervalCount));
      } else if (newPlan.interval === 'day') {
        currentPeriodEndsAt.setDate(currentPeriodEndsAt.getDate() + newPlan.intervalCount);
      }
      
      subscription.currentPeriodEndsAt = currentPeriodEndsAt;
    }
    
    // Salvar alterações
    await subscription.save();
    
    return res.status(200).json({ 
      message: 'Plano alterado com sucesso',
      subscription,
      newPlan
    });
  } catch (error) {
    console.error('Erro ao alterar plano:', error);
    return res.status(500).json({ error: 'Erro ao alterar plano' });
  }
};

// Obter assinatura pelo ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar assinatura pelo ID
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Verificar se o usuário tem permissão para visualizar a assinatura
    if (subscription.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    return res.status(200).json({ subscription });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao buscar assinatura' });
  }
};

// Atualizar status de uma assinatura (admin/owner)
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { status, reason } = req.body;
    
    // Buscar assinatura pelo ID
    const subscription = await Subscription.findByPk(id, {
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }
    
    // Atualizar status da assinatura
    subscription.status = status;
    
    // Se o status for cancelado, registrar data de cancelamento
    if (status === 'canceled' && !subscription.canceledAt) {
      subscription.canceledAt = new Date();
    }
    
    // Se houver um motivo, registrar
    if (reason) {
      subscription.statusReason = reason;
    }
    
    await subscription.save();
    
    return res.status(200).json({ 
      message: 'Status da assinatura atualizado com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao atualizar status da assinatura:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status da assinatura' });
  }
};

// Obter assinatura ativa de um usuário específico (admin/owner)
exports.getUserActiveSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar assinatura ativa do usuário específico
    const subscription = await Subscription.findOne({
      where: { 
        userId, 
        status: ['active', 'trial'] 
      },
      include: [{ 
        model: SubscriptionPlan, 
        as: 'plan',
        attributes: ['id', 'name', 'description', 'price', 'currency', 'billing_cycle']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    if (!subscription) {
      return res.status(404).json({ 
        error: 'Assinatura ativa não encontrada para este usuário',
        subscription: null 
      });
    }
    
    return res.status(200).json({ subscription });
  } catch (error) {
    console.error('Erro ao buscar assinatura ativa do usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar assinatura ativa do usuário' });
  }
};

// Listar todas as assinaturas (admin/owner)
exports.listAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const offset = (page - 1) * limit;
    
    // Construir filtros
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    
    // Buscar assinaturas com paginação
    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where,
      include: [
        { model: SubscriptionPlan, as: 'plan' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({ 
      subscriptions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    console.error('Erro ao listar assinaturas:', error);
    return res.status(500).json({ error: 'Erro ao listar assinaturas' });
  }
};

// Processar webhook de pagamento
exports.processPaymentWebhook = async (req, res) => {
  try {
    // Implementação básica para processar webhooks de pagamento
    // Em um ambiente real, você validaria a assinatura do webhook
    // e processaria eventos como pagamentos bem-sucedidos, falhas, etc.
    
    const event = req.body;
    
    console.log('Webhook de pagamento recebido:', event);
    
    // Aqui você processaria o evento com base no tipo
    // Por exemplo, atualizando o status da assinatura
    
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook de pagamento:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};
