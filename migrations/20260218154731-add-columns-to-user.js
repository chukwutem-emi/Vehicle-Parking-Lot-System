'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "createdAt", {
      type: Sequelize.DATE,
      field: "created_at",
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn("user", "updatedAt", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "updated_at",
      onUpdate: Sequelize.NOW
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn("user", "createdAt");
    await queryInterface.removeColumn("user", "updatedAt");
  }
};
