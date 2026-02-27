'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user_devices", "login_time", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "login_time"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("user_devices", "login_time", {
      type: Sequelize.DATE,
      defaultValue: NOW,
      field: "login_time"
    });
  }
};
