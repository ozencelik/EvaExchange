'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Addresses', [{
      city: 'Mersin',
      state: 'Akdeniz',
      neighborhood: 'Yok',
      country: 'TR'
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
