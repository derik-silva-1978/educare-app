const { sequelize } = require('../models');

async function createTrainingTables() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('Creating training tables...');

    await queryInterface.createTable('content_videos', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      content_id: {
        type: 'UUID',
        allowNull: true,
        references: { model: 'content_items', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      vimeo_video_id: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true
      },
      vimeo_embed_code: { type: 'TEXT', allowNull: true },
      thumbnail_url: { type: 'VARCHAR(500)', allowNull: true },
      duration_seconds: { type: 'INTEGER', allowNull: true },
      transcription: { type: 'TEXT', allowNull: true },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('content_videos created');

    await queryInterface.createTable('training_modules', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      training_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'content_items', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      order_index: { type: 'INTEGER', allowNull: false, defaultValue: 0 },
      title: { type: 'VARCHAR(255)', allowNull: false },
      description: { type: 'TEXT', allowNull: true },
      duration_minutes: { type: 'INTEGER', allowNull: true },
      is_preview: { type: 'BOOLEAN', defaultValue: false },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('training_modules created');

    await queryInterface.createTable('training_lessons', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      module_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'training_modules', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      order_index: { type: 'INTEGER', allowNull: false, defaultValue: 0 },
      title: { type: 'VARCHAR(255)', allowNull: false },
      content_type: { type: 'VARCHAR(50)', allowNull: false, defaultValue: 'video' },
      video_id: {
        type: 'UUID',
        allowNull: true,
        references: { model: 'content_videos', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      content_data: { type: 'JSONB', allowNull: true },
      duration_minutes: { type: 'INTEGER', allowNull: true },
      is_preview: { type: 'BOOLEAN', defaultValue: false },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('training_lessons created');

    await queryInterface.createTable('user_content_progress', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      user_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      content_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'content_items', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      lesson_id: {
        type: 'UUID',
        allowNull: true,
        references: { model: 'training_lessons', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      progress_percent: { type: 'INTEGER', defaultValue: 0 },
      watched_duration_seconds: { type: 'INTEGER', defaultValue: 0 },
      completed_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: true },
      last_accessed_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: true },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('user_content_progress created');

    await queryInterface.createTable('content_pricing', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      content_id: {
        type: 'UUID',
        allowNull: false,
        unique: true,
        references: { model: 'content_items', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      price_brl: { type: 'DECIMAL(10,2)', allowNull: false },
      discount_price_brl: { type: 'DECIMAL(10,2)', allowNull: true },
      discount_ends_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: true },
      stripe_price_id: { type: 'VARCHAR(255)', allowNull: true },
      stripe_product_id: { type: 'VARCHAR(255)', allowNull: true },
      is_free: { type: 'BOOLEAN', defaultValue: false },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('content_pricing created');

    await queryInterface.createTable('user_enrollments', {
      id: {
        type: 'UUID',
        defaultValue: sequelize.literal('gen_random_uuid()'),
        primaryKey: true
      },
      user_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      content_id: {
        type: 'UUID',
        allowNull: false,
        references: { model: 'content_items', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status: { type: 'VARCHAR(50)', allowNull: false, defaultValue: 'active' },
      enrolled_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      expires_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: true },
      stripe_payment_intent_id: { type: 'VARCHAR(255)', allowNull: true },
      stripe_checkout_session_id: { type: 'VARCHAR(255)', allowNull: true },
      amount_paid_brl: { type: 'DECIMAL(10,2)', allowNull: true },
      created_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') },
      updated_at: { type: 'TIMESTAMP WITH TIME ZONE', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    });
    console.log('user_enrollments created');

    await queryInterface.addIndex('user_enrollments', ['user_id', 'content_id'], {
      unique: true,
      name: 'user_enrollments_user_content_unique'
    });

    console.log('All training tables created successfully!');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Tables already exist, skipping...');
      process.exit(0);
    }
    console.error('Error creating tables:', error.message);
    process.exit(1);
  }
}

createTrainingTables();
