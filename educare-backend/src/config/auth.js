require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'educare_secret_key_change_in_production',
  expiresIn: process.env.JWT_EXPIRATION || '24h',
  refreshExpiresIn: '7d',
  saltRounds: 10
};
