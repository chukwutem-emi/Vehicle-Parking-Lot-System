import { DataTypes, Model, Sequelize } from "sequelize";
;
export class Conversation extends Model {
    id;
    createdAt;
    type;
}
;
export const initConversation = (sequelize) => {
    if (Conversation.sequelize)
        return;
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
    }, { sequelize, modelName: "conversation" });
};
