'use strict';

const { NOW } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_devices", {
      id: {
        type: Sequelize.BIGINT,
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
        defaultValue: NOW,
        field: "login_time"
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("user_devices");
  }
};
