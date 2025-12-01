#!/usr/bin/env node

require('dotenv').config();
const { stripeService } = require('../src/services/stripeService');

async function main() {
  console.log('=== Stripe Plans Seed Script ===\n');
  
  try {
    console.log('Creating subscription plans in Stripe...\n');
    
    const plans = await stripeService.seedSubscriptionPlans();
    
    console.log('\n=== Summary ===\n');
    console.log(`Total plans created/verified: ${plans.length}\n`);
    
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.product.name}`);
      console.log(`   Product ID: ${plan.product.id}`);
      if (plan.price) {
        console.log(`   Price ID: ${plan.price.id}`);
        console.log(`   Amount: R$${(plan.price.unit_amount / 100).toFixed(2)}/month`);
      } else {
        console.log(`   Price: Free (no price created)`);
      }
      console.log('');
    });
    
    console.log('=== Done! ===');
    console.log('\nYou can now use these price IDs in your checkout flow.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
}

main();
