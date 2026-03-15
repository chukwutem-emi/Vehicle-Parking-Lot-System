'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_devices", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        field: "user_id",
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      deviceLabel: {
        type: Sequelize.STRING(300),
        field: "device_label",
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: "user_agent"
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      loginTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "login_time"
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_devices');
  }
};
