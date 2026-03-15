'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    userAddress: {
        type: Sequelize.STRING(200),
        allowNull: false,
        field: "user_address"
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    userRole: {
        type: Sequelize.STRING(20),
        defaultValue: "REGULAR",
        field: "user_role"
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_admin"
    },
    updatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "reset_token"
    },
    resetToken: {
        type: Sequelize.STRING(200),
        allowNull: true,
        field: "reset_token"
    },
    resetTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "reset_token_expiration"
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "updated_at",
      onUpdate: Sequelize.NOW
    }
  });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('user');
  }
};
