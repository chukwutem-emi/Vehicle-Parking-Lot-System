'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("conversation", "type", {
      type: Sequelize.STRING(200),
      defaultValue: "admin_global"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("conversation", "type");
  }
};
