'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'cpf_cnpj', {
      type: Sequelize.STRING(18),
      allowNull: true,
      unique: true,
      comment: 'CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário'
    });

    // Adicionar índice para melhor performance em buscas
    await queryInterface.addIndex('users', ['cpf_cnpj'], {
      name: 'users_cpf_cnpj_idx',
      unique: true,
      where: {
        cpf_cnpj: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover índice primeiro
    await queryInterface.removeIndex('users', 'users_cpf_cnpj_idx');
    
    // Remover coluna
    await queryInterface.removeColumn('users', 'cpf_cnpj');
  }
};
