'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("message", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      conversationId: {
        type: Sequelize.STRING(300),
        field: "conversation_id",
        allowNull: false
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "sender_id",
        references: {
          model: "user",
          key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      replyTo: {
        type: Sequelize.STRING(200),
        allowNull: true,
        field: "reply_id"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at"
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("message");
  }
};
