import { DataTypes, Model, Sequelize } from "sequelize";
;
export class UserDevices extends Model {
    deviceLabel;
    loginTime;
    userAgent;
    location;
    userId;
    id;
    ip;
}
;
export const initUserDevicesModel = (sequelize) => {
    if (UserDevices.sequelize)
        return;
    UserDevices.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            field: "user_id",
            allowNull: true,
            references: {
                model: "user",
                key: "id"
            },
            onDelete: "SET NULL",
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
        modelName: "user_devices",
        timestamps: false
    });
};
