'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shares', [{
      symbol: 'BTC',
      price: 5.86,
      qty: 1000
    }, {
      symbol: 'ETH',
      price: 7.23,
      qty: 750
    }, {
      symbol: 'ZTX',
      price: 50.12,
      qty: 869
    }, {
      symbol: 'KTU',
      price: 23.28,
      qty: 100
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shares', null, {});
  }
};
