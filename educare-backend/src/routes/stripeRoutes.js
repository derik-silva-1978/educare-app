const express = require('express');
const router = express.Router();
const { stripeService } = require('../services/stripeService');
const { verifyToken } = require('../middlewares/auth');
const { User, Profile, Subscription, SubscriptionPlan } = require('../models');

router.get('/config', async (req, res) => {
  try {
    const publishableKey = await stripeService.getPublishableKey();
    res.json({ publishableKey });
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    res.status(500).json({ error: 'Failed to get Stripe configuration' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await stripeService.listProducts();
    res.json({ data: products });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ error: 'Failed to list products' });
  }
});

router.get('/products-with-prices', async (req, res) => {
  try {
    const products = await stripeService.listProductsWithPrices();
    res.json({ data: products });
  } catch (error) {
    console.error('Error listing products with prices:', error);
    res.status(500).json({ error: 'Failed to list products with prices' });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const prices = await stripeService.listPrices();
    res.json({ data: prices });
  } catch (error) {
    console.error('Error listing prices:', error);
    res.status(500).json({ error: 'Failed to list prices' });
  }
});

router.get('/products/:productId/prices', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await stripeService.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const prices = await stripeService.listPrices();
    const productPrices = prices.filter(p => p.product === productId);
    
    res.json({ data: productPrices });
  } catch (error) {
    console.error('Error getting product prices:', error);
    res.status(500).json({ error: 'Failed to get product prices' });
  }
});

router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { priceId, planId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }

    const user = await User.findByPk(userId, {
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripeService.createCustomer(
        user.email,
        userId,
        user.profile?.name || user.name
      );
      
      await user.update({ stripeCustomerId: customer.id });
      stripeCustomerId = customer.id;
    }

    const baseUrl = process.env.FRONTEND_URL || `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const successUrl = `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/subscription/cancel`;

    const session = await stripeService.createCheckoutSession(
      stripeCustomerId,
      priceId,
      successUrl,
      cancelUrl,
      { userId, planId: planId || null }
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/customer-portal', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found for this user' });
    }

    const baseUrl = process.env.FRONTEND_URL || `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const returnUrl = `${baseUrl}/subscription`;

    const session = await stripeService.createCustomerPortalSession(
      user.stripeCustomerId,
      returnUrl
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
});

router.get('/subscription', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || !user.stripeCustomerId) {
      return res.json({ subscription: null });
    }

    const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
    const activeSubscription = subscriptions.find(s => 
      ['active', 'trialing', 'past_due'].includes(s.status)
    );

    res.json({ 
      subscription: activeSubscription || null,
      allSubscriptions: subscriptions
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

router.post('/subscription/:subscriptionId/cancel', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.params;
    const { immediate } = req.body;

    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
    const subscription = subscriptions.find(s => s.id === subscriptionId);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const canceledSubscription = await stripeService.cancelSubscription(
      subscriptionId, 
      !immediate
    );

    res.json({ 
      subscription: canceledSubscription,
      message: immediate ? 'Subscription canceled immediately' : 'Subscription will be canceled at period end'
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

router.post('/subscription/:subscriptionId/resume', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.params;

    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const subscription = await stripeService.resumeSubscription(subscriptionId);

    res.json({ 
      subscription,
      message: 'Subscription resumed successfully'
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

router.post('/subscription/:subscriptionId/change-plan', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.params;
    const { newPriceId } = req.body;

    if (!newPriceId) {
      return res.status(400).json({ error: 'newPriceId is required' });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const subscription = await stripeService.updateSubscription(subscriptionId, newPriceId);

    res.json({ 
      subscription,
      message: 'Plan changed successfully'
    });
  } catch (error) {
    console.error('Error changing plan:', error);
    res.status(500).json({ error: 'Failed to change plan' });
  }
});

module.exports = router;
