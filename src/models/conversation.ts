import {DataTypes, Model} from "sequelize";
import sequelize from "../utils/db_helpers.js";

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