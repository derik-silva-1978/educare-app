require('dotenv').config();
const { sequelize } = require('../config/database');

async function migrateProviderColumn() {
  try {
    console.log('Starting provider column migration...');
    
    await sequelize.query(`
      ALTER TABLE assistant_llm_configs 
      ALTER COLUMN provider TYPE VARCHAR(50) 
      USING provider::text
    `);
    
    console.log('Provider column migrated from ENUM to VARCHAR(50)');
    
    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('type "character varying"')) {
      console.log('Column already migrated or compatible type');
      return true;
    }
    console.error('Migration error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected');
      return migrateProviderColumn();
    })
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = migrateProviderColumn;
