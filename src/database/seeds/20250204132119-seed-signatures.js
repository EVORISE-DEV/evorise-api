module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('signatures', [
      { id: 1, name: 'Free', price: 0.0, discount: 0.0, created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Plus', price: 19.90, discount: 0.0, created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Pro', price: 39.90, discount: 0.0, created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('signatures', null, {});
  },
};
