import sequelize from "../utils/db_helpers.js";
import { DataTypes, Model} from "sequelize";


interface VehicleTypeAttribute {
    id?: number;
    vehicleName: string;
    hourlyRate: number;
    updatedBy?: string;
};
export class VehicleType extends Model<VehicleTypeAttribute> implements VehicleTypeAttribute {
    id!: number;
    vehicleName!: string;
    hourlyRate!: number;
    updatedBy?: string;
}
VehicleType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        vehicleName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        hourlyRate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        updatedBy: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "vehicle_type"
    }
);
export default VehicleType;
