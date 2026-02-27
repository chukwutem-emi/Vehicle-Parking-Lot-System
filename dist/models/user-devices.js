import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db_helpers.js";
;
export class UserDevices extends Model {
}
;
UserDevices.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING(300),
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    loginTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "user_devices"
});
