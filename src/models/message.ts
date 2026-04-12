import {DataTypes, Model, Sequelize} from "sequelize";


interface MessageAttributes {
    id?: number;
    conversationId: number;
    senderId: number;
    content: string;
    replyTo?: number;
    createdAt?: Date;

};

export class Message extends Model<MessageAttributes> implements MessageAttributes {
    id?: number;
    conversationId!: number;
    senderId!: number;
    content!: string;
    replyTo?: number;
    createdAt?: Date;
};
export const initMessageModel = (sequelize: Sequelize) => {
  if (Message.sequelize) return;
  Message.init(
      {
          id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        conversationId: {
          type: DataTypes.INTEGER,
          field: "conversation_id",
          allowNull: false,
          references: {
            model: "conversation",
            key: "id"
          }
        },
        senderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "sender_id",
          references: {
            model: "user",
            key: "id"
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE"
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        replyTo: {
          type: DataTypes.INTEGER,
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
          type: DataTypes.DATE,
          allowNull: false,
          field: "created_at",
          defaultValue: DataTypes.NOW
        }
      },
      {
          sequelize,
          modelName: "message"
      }
  );
};