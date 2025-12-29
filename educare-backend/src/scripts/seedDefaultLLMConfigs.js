require('dotenv').config();
const { sequelize } = require('../config/database');
const AssistantLLMConfig = require('../models/AssistantLLMConfig');

const seedDefaultLLMConfigs = async () => {
  try {
    console.log('Seeding default LLM configurations...');
    
    const defaultConfigs = [
      {
        module_type: 'baby',
        provider: 'openai',
        model_name: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1500,
        is_active: true,
        additional_params: {}
      },
      {
        module_type: 'mother',
        provider: 'openai',
        model_name: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1500,
        is_active: true,
        additional_params: {}
      },
      {
        module_type: 'professional',
        provider: 'openai',
        model_name: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1500,
        is_active: true,
        additional_params: {}
      }
    ];
    
    for (const config of defaultConfigs) {
      const [record, created] = await AssistantLLMConfig.findOrCreate({
        where: { module_type: config.module_type },
        defaults: config
      });
      
      if (created) {
        console.log(`  Created LLM config for module: ${config.module_type}`);
      } else {
        console.log(`  LLM config already exists for module: ${config.module_type}`);
      }
    }
    
    console.log('Default LLM configurations seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding LLM configurations:', error);
    throw error;
  }
};

if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected');
      return sequelize.sync();
    })
    .then(() => seedDefaultLLMConfigs())
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

module.exports = seedDefaultLLMConfigs;
