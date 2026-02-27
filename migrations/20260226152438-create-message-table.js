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
        type: Sequelize.INTEGER,
        field: "conversation_id",
        allowNull: false,
        references: {
          model: "conversation",
          key: "id"
        }
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
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "reply_id",
        references: {
          model: "message",
          key: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("message");
  }
};
