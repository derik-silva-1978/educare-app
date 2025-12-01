'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro, garantimos que todos os valores nulos sejam convertidos para um objeto JSON vazio
    await queryInterface.sequelize.query(`
      UPDATE "children" 
      SET "special_needs" = '{}' 
      WHERE "special_needs" IS NULL OR "special_needs" = '';
    `);

    // Em seguida, alteramos o tipo da coluna para JSONB usando a sintaxe USING
    await queryInterface.sequelize.query(`
      ALTER TABLE "children" 
      ALTER COLUMN "special_needs" TYPE JSONB 
      USING special_needs::jsonb;
    `);

    // Definimos o valor padrão como um objeto JSON vazio
    await queryInterface.sequelize.query(`
      ALTER TABLE "children" 
      ALTER COLUMN "special_needs" 
      SET DEFAULT '{}';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Revertemos para o tipo TEXT
    await queryInterface.sequelize.query(`
      ALTER TABLE "children" 
      ALTER COLUMN "special_needs" TYPE TEXT;
    `);
  }
};
