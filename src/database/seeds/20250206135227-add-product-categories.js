'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('products_categories', [
      { name: 'Tênis de Corrida', created_at: new Date(), updated_at: new Date() },
      { name: 'Camisetas Esportivas', created_at: new Date(), updated_at: new Date() },
      { name: 'Shorts e Bermudas', created_at: new Date(), updated_at: new Date() },
      { name: 'Calças e Leggings', created_at: new Date(), updated_at: new Date() },
      { name: 'Meias de Compressão', created_at: new Date(), updated_at: new Date() },
      { name: 'Acessórios Esportivos', created_at: new Date(), updated_at: new Date() },
      { name: 'Relógios e Smartbands', created_at: new Date(), updated_at: new Date() },
      { name: 'Fones de Ouvido Esportivos', created_at: new Date(), updated_at: new Date() },
      { name: 'Hidratação e Mochilas', created_at: new Date(), updated_at: new Date() },
      { name: 'Óculos de Corrida', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('products_categories', null, {});
  },
};
