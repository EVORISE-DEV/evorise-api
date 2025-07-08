'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover chave primária para alterar tipo de coluna
    await queryInterface.removeConstraint('users', 'users_pkey');

    // Alterar a coluna id para UUID
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'), // Gera UUID automaticamente
      allowNull: false,
      primaryKey: true,
    });

    // Restaurar chave primária
    await queryInterface.addConstraint('users', {
      fields: ['id'],
      type: 'primary key',
      name: 'users_pkey',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover chave primária para restaurar coluna anterior
    await queryInterface.removeConstraint('users', 'users_pkey');

    // Restaurar para INTEGER autoincrementável
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    // Restaurar chave primária
    await queryInterface.addConstraint('users', {
      fields: ['id'],
      type: 'primary key',
      name: 'users_pkey',
    });
  },
};

