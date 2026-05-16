import { DataTypes, Model, Sequelize } from "sequelize";
export const userRole = {
    REGULAR: "REGULAR-USER",
    ADMIN: "ADMIN",
    SUPER: "SUPER-ADMIN"
};
;
export class User extends Model {
    id;
    username;
    password;
    userAddress;
    phone;
    email;
    userRole;
    isAdmin;
    updatedBy;
    resetToken;
    resetTokenExpiration;
    createdAt;
    updatedAt;
}
;
export const initUserModel = (sequelize) => {
    if (User.sequelize)
        return;
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userAddress: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        userRole: {
            type: DataTypes.STRING(20),
            defaultValue: userRole.REGULAR
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        updatedBy: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        resetToken: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        resetTokenExpiration: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "created_at"
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "updated_at",
        }
    }, {
        sequelize,
        modelName: "user"
    });
};
