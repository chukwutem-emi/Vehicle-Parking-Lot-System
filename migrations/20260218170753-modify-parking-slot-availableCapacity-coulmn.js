'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("parking_slot", "available_capacity", {
      type: Sequelize.INTEGER,
      defaultValue: 10,
      allowNull: false,
      field: "available_capacity"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("parking_slot", "available_capacity", {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: "available_capacity"
    })
  }
};
