require('dotenv').config();

const crypto = require('crypto');

module.exports = {
  secret: process.env.JWT_SECRET || 'educare_secret_key_change_in_production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'educare_refresh_secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRATION || '1h',
  refreshExpiresIn: '7d',
  saltRounds: 12,
  issuer: 'educare-api',
  audience: 'educare-app',
  passwordPolicy: {
    minLength: 6,
    maxLength: 128
  }
};
