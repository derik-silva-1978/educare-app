const { getUncachableStripeClient, getStripePublishableKey, isStripeConfigured } = require('./stripeClient');
const { sequelize } = require('../config/database');

class StripeService {
  async createCustomer(email, userId, name = null) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });
  }

  async getOrCreateCustomer(userId, email, name = null) {
    const stripe = await getUncachableStripeClient();
    
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return await this.createCustomer(email, userId, name);
  }

  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl, metadata = {}) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: {
        metadata
      }
    });
  }

  async createOneTimeCheckoutSession(customerId, priceId, successUrl, cancelUrl, metadata = {}) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    });
  }

  async createCustomerPortalSession(customerId, returnUrl) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    const stripe = await getUncachableStripeClient();
    
    if (cancelAtPeriodEnd) {
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    }
    
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  async resumeSubscription(subscriptionId) {
    const stripe = await getUncachableStripeClient();
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });
  }

  async updateSubscription(subscriptionId, newPriceId) {
    const stripe = await getUncachableStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations'
    });
  }

  async getProduct(productId) {
    try {
      const result = await sequelize.query(
        'SELECT * FROM stripe.products WHERE id = :productId',
        { 
          replacements: { productId },
          type: sequelize.QueryTypes.SELECT 
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching product from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      return await stripe.products.retrieve(productId);
    }
  }

  async listProducts(active = true, limit = 20) {
    try {
      const result = await sequelize.query(
        'SELECT * FROM stripe.products WHERE active = :active LIMIT :limit',
        { 
          replacements: { active, limit },
          type: sequelize.QueryTypes.SELECT 
        }
      );
      return result;
    } catch (error) {
      console.error('Error fetching products from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      const products = await stripe.products.list({ active, limit });
      return products.data;
    }
  }

  async listProductsWithPrices(active = true, limit = 20) {
    try {
      const result = await sequelize.query(`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active,
          pr.metadata as price_metadata
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = :active
        ORDER BY p.id, pr.unit_amount
        LIMIT :limit
      `, { 
        replacements: { active, limit },
        type: sequelize.QueryTypes.SELECT 
      });

      const productsMap = new Map();
      for (const row of result) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata
          });
        }
      }

      return Array.from(productsMap.values());
    } catch (error) {
      console.error('Error fetching products with prices from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      const products = await stripe.products.list({ active, limit });
      
      const result = [];
      for (const product of products.data) {
        const prices = await stripe.prices.list({ product: product.id, active: true });
        result.push({
          ...product,
          prices: prices.data
        });
      }
      return result;
    }
  }

  async getPrice(priceId) {
    try {
      const result = await sequelize.query(
        'SELECT * FROM stripe.prices WHERE id = :priceId',
        { 
          replacements: { priceId },
          type: sequelize.QueryTypes.SELECT 
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching price from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      return await stripe.prices.retrieve(priceId);
    }
  }

  async listPrices(active = true, limit = 20) {
    try {
      const result = await sequelize.query(
        'SELECT * FROM stripe.prices WHERE active = :active LIMIT :limit',
        { 
          replacements: { active, limit },
          type: sequelize.QueryTypes.SELECT 
        }
      );
      return result;
    } catch (error) {
      console.error('Error fetching prices from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      const prices = await stripe.prices.list({ active, limit });
      return prices.data;
    }
  }

  async getSubscription(subscriptionId) {
    try {
      const result = await sequelize.query(
        'SELECT * FROM stripe.subscriptions WHERE id = :subscriptionId',
        { 
          replacements: { subscriptionId },
          type: sequelize.QueryTypes.SELECT 
        }
      );
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching subscription from stripe schema:', error.message);
      const stripe = await getUncachableStripeClient();
      return await stripe.subscriptions.retrieve(subscriptionId);
    }
  }

  async getCustomerSubscriptions(customerId) {
    const stripe = await getUncachableStripeClient();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all'
    });
    return subscriptions.data;
  }

  async getPublishableKey() {
    return await getStripePublishableKey();
  }

  async isConfigured() {
    return await isStripeConfigured();
  }
}

const stripeService = new StripeService();

module.exports = { stripeService, StripeService };
