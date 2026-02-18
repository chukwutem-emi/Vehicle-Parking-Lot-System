'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("parking_slot", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      slotCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        field: "slot_code"
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: "is_available"
      },
      maximumCapacity: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
        field: "maximum_capacity"
      },
      availableCapacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "available_capacity"
      },
      updatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "updated_by"
      },
      vehicleTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "vehicle_type_id",
        references: { 
            model: "vehicle_type",
            key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("parking_slot");
  }
};
