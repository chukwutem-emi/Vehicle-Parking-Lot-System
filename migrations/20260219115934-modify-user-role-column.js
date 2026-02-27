'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "user_role", {
      type: Sequelize.STRING(20),
      defaultValue: "REGULAR-USER",
      field: "user_role"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "user_role", {
      type: Sequelize.STRING(20),
      defaultValue: "REGULAR",
      field: "user_role"
    });
  }
};
