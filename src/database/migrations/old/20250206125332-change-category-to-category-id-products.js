'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover a coluna antiga 'category'
    await queryInterface.removeColumn('products', 'category');

    // Adicionar a nova coluna 'category_id' com referência à tabela 'products_categories'
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Se uma categoria for deletada, os produtos ficarão sem categoria
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover a coluna 'category_id'
    await queryInterface.removeColumn('products', 'category_id');

    // Recriar a coluna antiga 'category' (caso precise reverter a migration)
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull: true, // Permite valores nulos para compatibilidade anterior
    });
  },
};
