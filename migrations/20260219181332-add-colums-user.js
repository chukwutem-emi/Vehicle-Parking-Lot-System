'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "reset_token", {
      type: Sequelize.STRING(200),
      allowNull: true
    });
    await queryInterface.addColumn("user", "reset_token_expiration", {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn("user", "reset_token");
    await queryInterface.removeColumn("user", "reset_token_expiration");
  }
};
