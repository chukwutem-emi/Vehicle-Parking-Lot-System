import sequelize from "../utils/db_helpers.js";
import { DataTypes, Model } from "sequelize";
export const parkingStatus = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
};
;
;
export class ParkingSession extends Model {
}
;
ParkingSession.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicleNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    vehicleOwnerPhone: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },
    vehicleOwnerAddress: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    vehicleOwnerNextOfKin: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    vehicleOwnerNextOfKinPhone: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },
    vehicleOwnerNextOfKinAddress: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    isCleared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    entryTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    exitTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    parkingStatus: {
        type: DataTypes.STRING(20),
        defaultValue: parkingStatus.ACTIVE
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    slotId: {
        type: DataTypes.INTEGER,
        references: {
            model: "parking_slot",
            key: "id"
        },
        allowNull: false,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    },
    vehicleTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: "vehicle_type",
            key: "id",
        },
        allowNull: false,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    }
}, {
    sequelize,
    modelName: "parking_session"
});
