module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('profiles', [
      { id: 1, name: 'Client', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Admin', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Professor', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('profiles', null, {});
  },
};
