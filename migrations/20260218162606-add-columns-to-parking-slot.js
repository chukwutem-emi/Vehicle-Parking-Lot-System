'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("parking_slot", "created_at", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn("parking_slot", "updated_at", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn("parking_slot", "created_at");
    await queryInterface.removeColumn("parking_slot", "updated_at");
  }
};
