const Stripe = require('stripe');

let cachedCredentials = null;
let credentialsCacheExpiry = 0;
const CREDENTIALS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let cachedStripeClient = null;

async function getCredentials() {
  const now = Date.now();
  if (cachedCredentials && now < credentialsCacheExpiry) {
    return cachedCredentials;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const connectorName = 'stripe';
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', connectorName);
  url.searchParams.set('environment', targetEnvironment);

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  
  const connectionSettings = data.items?.[0];

  if (!connectionSettings || (!connectionSettings.settings.publishable || !connectionSettings.settings.secret)) {
    throw new Error(`Stripe ${targetEnvironment} connection not found`);
  }

  cachedCredentials = {
    publishableKey: connectionSettings.settings.publishable,
    secretKey: connectionSettings.settings.secret,
  };
  credentialsCacheExpiry = now + CREDENTIALS_CACHE_TTL;

  return cachedCredentials;
}

async function getStripeClient() {
  if (cachedStripeClient && cachedCredentials && Date.now() < credentialsCacheExpiry) {
    return cachedStripeClient;
  }

  const { secretKey } = await getCredentials();
  cachedStripeClient = new Stripe(secretKey, {
    apiVersion: '2023-10-16',
  });
  
  return cachedStripeClient;
}

async function getUncachableStripeClient() {
  return await getStripeClient();
}

async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let stripeSync = null;

async function getStripeSync() {
  if (!stripeSync) {
    const { StripeSync } = require('stripe-replit-sync');
    const secretKey = await getStripeSecretKey();
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required for Stripe sync');
    }

    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: databaseUrl,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}

async function isStripeConfigured() {
  try {
    await getCredentials();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  getUncachableStripeClient,
  getStripePublishableKey,
  getStripeSecretKey,
  getStripeSync,
  isStripeConfigured
};
