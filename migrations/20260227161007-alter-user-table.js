'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("user", "update_by", "updated_by")
  },

  async down (queryInterface,) {
    await queryInterface.renameColumn("user", "updated_by", "update_by")
  }
};
