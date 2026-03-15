'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "user_role", {
      type: Sequelize.STRING(20),
      defaultValue: "REGULAR-USER",
      field: "user_role"
    });
    await queryInterface.changeColumn("user", "password", {
      type: Sequelize.STRING(300),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "user_role", {
      type: Sequelize.STRING(20),
      defaultValue: "REGULAR",
      field: "user_role"
    });
    await queryInterface.changeColumn("user", "password", {
      type: Sequelize.STRING(50),
      allowNull: false
    });
  }
};
