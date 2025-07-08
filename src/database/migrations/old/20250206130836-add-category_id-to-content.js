'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('contents', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Pode ser null para conteúdos sem categoria
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('contents', 'category_id');
  },
};
