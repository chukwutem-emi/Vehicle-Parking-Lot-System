import { DataTypes, Model, Sequelize } from "sequelize";
;
export class ParkingSlot extends Model {
    id;
    slotCode;
    isAvailable;
    maximumCapacity;
    availableCapacity;
    updatedBy;
    vehicleTypeId;
}
export const initParkingSlotModel = (sequelize) => {
    if (ParkingSlot.sequelize)
        return;
    ParkingSlot.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slotCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        maximumCapacity: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        availableCapacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 10
        },
        updatedBy: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        vehicleTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "vehicle_type",
                key: "id"
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        }
    }, {
        sequelize,
        modelName: "parking_slot"
    });
};
