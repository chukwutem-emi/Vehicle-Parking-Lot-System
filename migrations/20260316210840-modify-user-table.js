'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "updated_by", {
      type: Sequelize.STRING(100),
        allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "updated_by");
  }
};
