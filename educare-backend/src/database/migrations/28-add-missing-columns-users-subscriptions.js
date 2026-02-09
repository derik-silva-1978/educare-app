'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // === USERS TABLE: Add missing columns ===
    const usersColumns = await queryInterface.describeTable('users').catch(() => ({}));
    
    if (!usersColumns.phone) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    }

    if (!usersColumns.cpf_cnpj) {
      await queryInterface.addColumn('users', 'cpf_cnpj', {
        type: Sequelize.STRING(18),
        allowNull: true,
        unique: true
      });
    }

    if (!usersColumns.phone_verification_code) {
      await queryInterface.addColumn('users', 'phone_verification_code', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!usersColumns.phone_verification_expires) {
      await queryInterface.addColumn('users', 'phone_verification_expires', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    if (!usersColumns.stripe_customer_id) {
      await queryInterface.addColumn('users', 'stripe_customer_id', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!usersColumns.stripe_subscription_id) {
      await queryInterface.addColumn('users', 'stripe_subscription_id', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Make email nullable (model allows null, migration doesn't)
    try {
      await queryInterface.changeColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    } catch (e) {
      console.log('Could not change email column:', e.message);
    }

    // Add 'curator' to role enum if not exists
    try {
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'curator' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')) THEN
            ALTER TYPE "enum_users_role" ADD VALUE 'curator';
          END IF;
        END $$;
      `);
    } catch (e) {
      console.log('Could not add curator enum:', e.message);
    }

    // === SUBSCRIPTIONS TABLE: Add missing columns ===
    const subsColumns = await queryInterface.describeTable('subscriptions').catch(() => ({}));

    if (!subsColumns.next_billing_date) {
      await queryInterface.addColumn('subscriptions', 'next_billing_date', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    if (!subsColumns.last_billing_date) {
      await queryInterface.addColumn('subscriptions', 'last_billing_date', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    if (!subsColumns.auto_renew) {
      await queryInterface.addColumn('subscriptions', 'auto_renew', {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      });
    }

    if (!subsColumns.children_count) {
      await queryInterface.addColumn('subscriptions', 'children_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      });
    }

    if (!subsColumns.usage_stats) {
      await queryInterface.addColumn('subscriptions', 'usage_stats', {
        type: Sequelize.JSONB,
        defaultValue: {}
      });
    }

    if (!subsColumns.payment_details) {
      await queryInterface.addColumn('subscriptions', 'payment_details', {
        type: Sequelize.JSONB,
        defaultValue: {}
      });
    }

    if (!subsColumns.payment_method) {
      await queryInterface.addColumn('subscriptions', 'payment_method', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const cols = ['phone', 'cpf_cnpj', 'phone_verification_code', 'phone_verification_expires', 'stripe_customer_id', 'stripe_subscription_id'];
    for (const col of cols) {
      try { await queryInterface.removeColumn('users', col); } catch (e) {}
    }

    const subCols = ['next_billing_date', 'last_billing_date', 'auto_renew', 'children_count', 'usage_stats', 'payment_details', 'payment_method'];
    for (const col of subCols) {
      try { await queryInterface.removeColumn('subscriptions', col); } catch (e) {}
    }
  }
};
