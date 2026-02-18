import sequelize from "../utils/db_helpers.js";
import { DataTypes, Model } from "sequelize";

type Role = {
    REGULAR : string,
    ADMIN   : string,
    SUPER   : string
};
export const userRole: Role = {
    REGULAR : "REGULAR-USER",
    ADMIN   : "ADMIN",
    SUPER   : "SUPER-ADMIN"
};
interface UserAttribute {
    id          : number;
    username    : string;
    password    : string;
    userAddress : string;
    phone       : string;
    email       : string;
    userRole?    : string;
    isAdmin?     : boolean;
    updatedBy?   : string;
};

export class User extends Model<UserAttribute> implements UserAttribute {
    public id!          : number;
    public username!    : string;
    public password!    : string;
    public userAddress! : string;
    public phone!       : string;
    public email!       : string;
    public userRole?    : string;
    public isAdmin?     : boolean;
    public updatedBy?   : string;
};
User.init(
    {
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
            type: DataTypes.STRING(12),
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
        }
    },
    {
        sequelize,
        modelName: "user"
    }
);