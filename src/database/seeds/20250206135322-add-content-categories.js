'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('contents_categories', [
      { name: 'Técnicas de Corrida', created_at: new Date(), updated_at: new Date() },
      { name: 'Aquecimento e Alongamento', created_at: new Date(), updated_at: new Date() },
      { name: 'Nutrição e Hidratação', created_at: new Date(), updated_at: new Date() },
      { name: 'Prevenção de Lesões', created_at: new Date(), updated_at: new Date() },
      { name: 'Planos de Treinamento', created_at: new Date(), updated_at: new Date() },
      { name: 'Equipamentos e Acessórios', created_at: new Date(), updated_at: new Date() },
      { name: 'Psicologia Esportiva', created_at: new Date(), updated_at: new Date() },
      { name: 'Biomecânica da Corrida', created_at: new Date(), updated_at: new Date() },
      { name: 'Condicionamento Físico', created_at: new Date(), updated_at: new Date() },
      { name: 'Corrida de Rua e Trilhas', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('contents_categories', null, {});
  },
};
