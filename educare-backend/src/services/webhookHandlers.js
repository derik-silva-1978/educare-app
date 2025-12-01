const { getStripeSync, getUncachableStripeClient } = require('./stripeClient');
const { User, Subscription, SubscriptionPlan } = require('../models');
const { Op } = require('sequelize');

class WebhookHandlers {
  static async processWebhook(payload, signature, uuid) {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    try {
      if (uuid) {
        const sync = await getStripeSync();
        await sync.processWebhook(payload, signature, uuid);
      } else {
        const stripe = await getUncachableStripeClient();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        if (webhookSecret) {
          const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
          await WebhookHandlers.handleEvent(event);
        } else {
          const event = JSON.parse(payload.toString());
          console.log('Webhook without secret verification, processing event:', event.type);
          await WebhookHandlers.handleEvent(event);
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error.message);
      throw error;
    }
  }

  static async handleEvent(event) {
    console.log(`Processing Stripe event: ${event.type}`);

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await WebhookHandlers.handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await WebhookHandlers.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.paid':
          await WebhookHandlers.handleInvoicePaid(event.data.object);
          break;

        case 'invoice.payment_failed':
          await WebhookHandlers.handleInvoicePaymentFailed(event.data.object);
          break;

        case 'checkout.session.completed':
          await WebhookHandlers.handleCheckoutCompleted(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling event ${event.type}:`, error.message);
    }
  }

  static async handleSubscriptionUpdated(stripeSubscription) {
    console.log('Handling subscription update:', stripeSubscription.id);

    const customerId = stripeSubscription.customer;
    const user = await User.findOne({
      where: { stripeCustomerId: customerId }
    });

    if (!user) {
      console.log('No user found for Stripe customer:', customerId);
      return;
    }

    await user.update({ stripeSubscriptionId: stripeSubscription.id });

    const statusMap = {
      'active': 'active',
      'trialing': 'trial',
      'past_due': 'past_due',
      'canceled': 'canceled',
      'unpaid': 'expired',
      'incomplete': 'pending',
      'incomplete_expired': 'expired',
      'paused': 'suspended'
    };

    const localStatus = statusMap[stripeSubscription.status] || stripeSubscription.status;

    let subscription = await Subscription.findOne({
      where: { userId: user.id }
    });

    const subscriptionData = {
      userId: user.id,
      status: localStatus,
      startDate: new Date(stripeSubscription.current_period_start * 1000),
      endDate: new Date(stripeSubscription.current_period_end * 1000),
      nextBillingDate: new Date(stripeSubscription.current_period_end * 1000),
      lastBillingDate: stripeSubscription.current_period_start 
        ? new Date(stripeSubscription.current_period_start * 1000) 
        : null,
      autoRenew: !stripeSubscription.cancel_at_period_end,
      paymentDetails: {
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: stripeSubscription.items?.data?.[0]?.price?.id,
        stripeProductId: stripeSubscription.items?.data?.[0]?.price?.product
      }
    };

    if (subscription) {
      await subscription.update(subscriptionData);
      console.log('Updated local subscription:', subscription.id);
    } else {
      const defaultPlan = await SubscriptionPlan.findOne({
        where: { is_active: true },
        order: [['sort_order', 'ASC']]
      });

      if (defaultPlan) {
        subscriptionData.planId = defaultPlan.id;
        subscription = await Subscription.create(subscriptionData);
        console.log('Created local subscription:', subscription.id);
      } else {
        console.log('No default plan found, skipping subscription creation');
      }
    }
  }

  static async handleSubscriptionDeleted(stripeSubscription) {
    console.log('Handling subscription deletion:', stripeSubscription.id);

    const customerId = stripeSubscription.customer;
    const user = await User.findOne({
      where: { stripeCustomerId: customerId }
    });

    if (!user) {
      console.log('No user found for Stripe customer:', customerId);
      return;
    }

    const subscription = await Subscription.findOne({
      where: { userId: user.id }
    });

    if (subscription) {
      await subscription.update({
        status: 'canceled',
        canceledAt: new Date()
      });
      console.log('Marked subscription as canceled:', subscription.id);
    }

    await user.update({ stripeSubscriptionId: null });
  }

  static async handleInvoicePaid(invoice) {
    console.log('Handling invoice paid:', invoice.id);

    if (!invoice.subscription) {
      console.log('Invoice is not for a subscription');
      return;
    }

    const customerId = invoice.customer;
    const user = await User.findOne({
      where: { stripeCustomerId: customerId }
    });

    if (!user) {
      console.log('No user found for Stripe customer:', customerId);
      return;
    }

    const subscription = await Subscription.findOne({
      where: { userId: user.id }
    });

    if (subscription) {
      await subscription.update({
        status: 'active',
        lastBillingDate: new Date(invoice.created * 1000)
      });
      console.log('Updated subscription after invoice paid:', subscription.id);
    }
  }

  static async handleInvoicePaymentFailed(invoice) {
    console.log('Handling invoice payment failed:', invoice.id);

    if (!invoice.subscription) {
      console.log('Invoice is not for a subscription');
      return;
    }

    const customerId = invoice.customer;
    const user = await User.findOne({
      where: { stripeCustomerId: customerId }
    });

    if (!user) {
      console.log('No user found for Stripe customer:', customerId);
      return;
    }

    const subscription = await Subscription.findOne({
      where: { userId: user.id }
    });

    if (subscription) {
      await subscription.update({
        status: 'past_due'
      });
      console.log('Updated subscription to past_due:', subscription.id);
    }
  }

  static async handleCheckoutCompleted(session) {
    console.log('Handling checkout completed:', session.id);

    if (session.mode !== 'subscription') {
      console.log('Checkout is not for a subscription');
      return;
    }

    const customerId = session.customer;
    const userId = session.metadata?.userId;

    if (userId) {
      const user = await User.findByPk(userId);
      if (user && !user.stripeCustomerId) {
        await user.update({ stripeCustomerId: customerId });
        console.log('Linked Stripe customer to user:', userId);
      }
    }
  }
}

module.exports = { WebhookHandlers };
