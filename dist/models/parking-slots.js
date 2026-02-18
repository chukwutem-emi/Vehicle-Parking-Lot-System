import sequelize from "../utils/db_helpers.js";
import { DataTypes, Model } from "sequelize";
;
export class ParkingSlot extends Model {
}
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
        allowNull: true
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
ParkingSlot.beforeCreate((slot) => {
    if (slot.availableCapacity == null) {
        slot.availableCapacity = slot.maximumCapacity;
    }
});
