'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("message", "reply_id", "reply_to")
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("message", "reply_to", "reply_id");
  }
};
