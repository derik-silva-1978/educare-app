const { Subscription, SubscriptionPlan } = require('../models');

// Middleware para verificar se o usuário tem uma assinatura ativa
exports.hasActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Se for owner ou admin, permitir acesso sem verificar assinatura
    if (req.user.role === 'owner' || req.user.role === 'admin') {
      return next();
    }
    
    // Buscar assinatura ativa do usuário
    const subscription = await Subscription.findOne({
      where: { 
        userId, 
        status: ['active', 'trial'] 
      },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(403).json({ 
        error: 'Assinatura não encontrada ou inativa',
        upgrade: true
      });
    }
    
    // Adicionar informações da assinatura ao objeto de requisição
    req.subscription = subscription;
    req.subscriptionPlan = subscription.plan;
    
    return next();
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
};

// Middleware para verificar se o usuário tem acesso a um recurso específico
exports.checkFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Se for owner ou admin, permitir acesso sem verificar feature
      if (req.user.role === 'owner' || req.user.role === 'admin') {
        return next();
      }
      
      // Buscar assinatura ativa do usuário
      const subscription = await Subscription.findOne({
        where: { 
          userId, 
          status: ['active', 'trial'] 
        },
        include: [{ model: SubscriptionPlan, as: 'plan' }]
      });
      
      if (!subscription) {
        return res.status(403).json({ 
          error: 'Assinatura não encontrada ou inativa',
          upgrade: true
        });
      }
      
      // Verificar se o plano inclui a feature solicitada
      const hasFeature = subscription.plan.features[feature];
      
      if (!hasFeature) {
        return res.status(403).json({ 
          error: 'Seu plano atual não inclui esta funcionalidade',
          upgrade: true,
          currentPlan: subscription.plan.name
        });
      }
      
      return next();
    } catch (error) {
      console.error('Erro ao verificar recurso do plano:', error);
      return res.status(500).json({ error: 'Erro ao verificar acesso ao recurso' });
    }
  };
};

// Middleware para verificar limite de crianças
exports.checkChildrenLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Se for owner ou admin, permitir acesso sem verificar limite
    if (req.user.role === 'owner' || req.user.role === 'admin') {
      return next();
    }
    
    // Buscar assinatura ativa do usuário
    const subscription = await Subscription.findOne({
      where: { 
        userId, 
        status: ['active', 'trial'] 
      },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });
    
    if (!subscription) {
      return res.status(403).json({ 
        error: 'Assinatura não encontrada ou inativa',
        upgrade: true
      });
    }
    
    // Verificar o número atual de crianças
    if (subscription.childrenCount >= subscription.plan.maxChildren) {
      return res.status(403).json({ 
        error: 'Limite de crianças atingido para seu plano atual',
        upgrade: true,
        currentPlan: subscription.plan.name,
        currentLimit: subscription.plan.maxChildren
      });
    }
    
    return next();
  } catch (error) {
    console.error('Erro ao verificar limite de crianças:', error);
    return res.status(500).json({ error: 'Erro ao verificar limite de crianças' });
  }
};
