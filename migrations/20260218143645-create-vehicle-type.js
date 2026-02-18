'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("vehicle_type", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      vehicleName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        field: "vehicle_name"
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: "hourly_rate"
      },
      updatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "updated_by"
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("vehicle_type");
  }
};
