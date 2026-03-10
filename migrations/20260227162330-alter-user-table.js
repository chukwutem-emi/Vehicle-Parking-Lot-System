'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "password", {
      type: Sequelize.STRING(300),
      allowNull: false
    })
  },

  async down (queryInterface) {
    await queryInterface.changeColumn("user", "password", {
      type: Sequelize.STRING(50),
      allowNull: false
    })
  }
};
