import { DataTypes, Model, Sequelize } from "sequelize";
export const parkingStatus = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
};
;
;
export class ParkingSession extends Model {
    id;
    vehicleNumber;
    vehicleOwnerPhone;
    vehicleOwnerAddress;
    vehicleOwnerNextOfKin;
    vehicleOwnerNextOfKinPhone;
    vehicleOwnerNextOfKinAddress;
    isCleared;
    entryTime;
    exitTime;
    parkingStatus;
    totalAmount;
    slotId;
    vehicleTypeId;
    createdAt;
    updatedAt;
}
;
export const initParkingSessionModel = (sequelize) => {
    if (ParkingSession.sequelize)
        return;
    ParkingSession.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vehicleNumber: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        vehicleOwnerPhone: {
            type: DataTypes.STRING(12),
            allowNull: false
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
            allowNull: false
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
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        sequelize,
        modelName: "parking_session"
    });
};
