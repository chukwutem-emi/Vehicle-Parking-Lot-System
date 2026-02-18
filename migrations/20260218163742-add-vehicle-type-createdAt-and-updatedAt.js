'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("vehicle_type", "created_at", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn("vehicle_type", "updated_at", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn("vehicle_type", "created_at");
    await queryInterface.removeColumn("vehicle_type", "updated_at");
  }
};
