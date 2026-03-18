import {DataTypes, Model, Sequelize} from "sequelize";

interface ConversationAttributes {
    id?: number;
    createdAt?: Date;
    type?: string;
};

export class Conversation extends Model<ConversationAttributes> implements ConversationAttributes {
    id?: number;
    createdAt?: Date;
    type?: string;
};
export const initConversation = (sequelize: Sequelize) => {
    if (Conversation.sequelize) return;
    Conversation.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING(200),
            defaultValue: "admin_global"
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {sequelize, modelName: "conversation"});
};