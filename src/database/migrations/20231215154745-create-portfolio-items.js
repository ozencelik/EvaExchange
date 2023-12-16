'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PortfolioItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      portfolioId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
      },
      shareId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PortfolioItems');
  }
};
