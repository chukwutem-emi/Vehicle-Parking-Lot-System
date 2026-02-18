'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("parking_session", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      vehicleNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        field: "vehicle_number"
      },
      vehicleOwnerPhone: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true,
        field: "vehicle_owner_phone"
      },
      vehicleOwnerAddress: {
        type: Sequelize.STRING(200),
        allowNull: false,
        field: "vehicle_owner_address"
      },
      vehicleOwnerNextOfKin: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "vehicle_owner_next_of_kin"
      },
      vehicleOwnerNextOfKinPhone: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true,
        field: "vehicle_owner_next_of_kin_phone"
      },
      vehicleOwnerNextOfKinAddress: {
        type: Sequelize.STRING(200),
        allowNull: false,
        field: "vehicle_owner_next_of_kin_address"
      },
      isCleared: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_cleared"
      },
      entryTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "entry_time"
      },
      exitTime: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "exit_time"
      },
      parkingStatus: {
        type: Sequelize.STRING(20),
        defaultValue: "ACTIVE",
        field: "parking_status"
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        field: "total_amount"
      },
      slotId: {
        type: Sequelize.INTEGER,
        field: "slot_id",
        references: {
            model: "parking_slot",
            key: "id"
        },
        allowNull: false,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      vehicleTypeId: {
        type: Sequelize.INTEGER,
        field: "vehicle_type_id",
        references: {
            model: "vehicle_type",
            key: "id",
        },
        allowNull: false,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at",
      },
      updateAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
        field: "updated_at"
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("parking_session");
  }
};
