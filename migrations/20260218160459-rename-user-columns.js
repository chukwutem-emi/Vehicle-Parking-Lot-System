'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.renameColumn("user", "createdAt", "created_at");
    await queryInterface.renameColumn("user", "updatedAt", "updated_at");
    await queryInterface.renameColumn("user", "updatedBy", "update_by");
  },

  async down (queryInterface) {
    await queryInterface.renameColumn("user", "created_at", "createdAt");
    await queryInterface.renameColumn("user", "updated_at", "updatedAt");
    await queryInterface.renameColumn("user", "updated_by", "updatedBy");
  }
};
