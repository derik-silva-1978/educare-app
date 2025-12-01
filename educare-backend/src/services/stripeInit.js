const { runMigrations } = require('stripe-replit-sync');
const { getStripeSync, isStripeConfigured } = require('./stripeClient');

let stripeInitialized = false;
let webhookUuid = null;

async function initStripe() {
  if (stripeInitialized) {
    return { initialized: true, webhookUuid };
  }

  const isConfigured = await isStripeConfigured();
  if (!isConfigured) {
    console.log('Stripe not configured, skipping initialization');
    return { initialized: false, webhookUuid: null };
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping Stripe sync initialization');
    return { initialized: false, webhookUuid: null };
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ 
      databaseUrl,
      schema: 'stripe'
    });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const replitDomains = process.env.REPLIT_DOMAINS;
    if (!replitDomains) {
      console.log('REPLIT_DOMAINS not set, skipping webhook setup');
      stripeInitialized = true;
      return { initialized: true, webhookUuid: null };
    }

    try {
      const webhookBaseUrl = `https://${replitDomains.split(',')[0]}`;
      const result = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`,
        {
          enabled_events: ['*'],
          description: 'Educare+ Stripe webhook',
        }
      );
      
      if (result && result.uuid) {
        webhookUuid = result.uuid;
        console.log(`Webhook configured: ${result.webhook?.url || 'unknown'} (UUID: ${webhookUuid})`);
      } else {
        console.log('Webhook setup returned but no UUID, continuing without managed webhook');
      }
    } catch (webhookError) {
      console.log('Webhook setup failed (non-critical):', webhookError.message);
    }

    console.log('Syncing Stripe data in background...');
    stripeSync.syncBackfill()
      .then(() => {
        console.log('Stripe data synced successfully');
      })
      .catch((err) => {
        console.error('Error syncing Stripe data:', err.message);
      });

    stripeInitialized = true;
    return { initialized: true, webhookUuid };
  } catch (error) {
    console.error('Failed to initialize Stripe:', error.message);
    return { initialized: false, webhookUuid: null };
  }
}

function getWebhookUuid() {
  return webhookUuid;
}

function isInitialized() {
  return stripeInitialized;
}

module.exports = {
  initStripe,
  getWebhookUuid,
  isInitialized
};
