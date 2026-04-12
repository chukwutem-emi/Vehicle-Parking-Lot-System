import { DataTypes, Model, Sequelize, type Optional } from "sequelize";


type Status = {
    ACTIVE: string,
    COMPLETED: string,
    CANCELLED: string
};

export const  parkingStatus: Status = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
}
interface ParkingSessionAttribute {
    id                           : number;
    vehicleNumber                : string;
    vehicleOwnerPhone            : string;
    vehicleOwnerAddress          : string;
    vehicleOwnerNextOfKin        : string;
    vehicleOwnerNextOfKinPhone   : string;
    vehicleOwnerNextOfKinAddress : string;
    isCleared                    : boolean;
    entryTime                    : Date;
    exitTime?                    : Date;
    parkingStatus                : string;
    totalAmount?                 : number;
    slotId                       : number;
    vehicleTypeId                : number;
    createdAt?                   : Date;
    updatedAt?                   : Date;
};

interface ParkingSessionOptionalAttribute extends Optional<ParkingSessionAttribute, "id" | "entryTime" | "isCleared" | "parkingStatus"> {};

export class ParkingSession extends Model<ParkingSessionAttribute, ParkingSessionOptionalAttribute> implements ParkingSessionAttribute{
    public id!                           : number;
    public vehicleNumber!                : string;
    public vehicleOwnerPhone!            : string;
    public vehicleOwnerAddress!          : string;
    public vehicleOwnerNextOfKin!        : string;
    public vehicleOwnerNextOfKinPhone!   : string;
    public vehicleOwnerNextOfKinAddress! : string;
    public isCleared!                    : boolean;
    public entryTime!                    : Date;
    public exitTime?                     : Date;
    public parkingStatus!                : string;
    public totalAmount?                  : number;
    public slotId!                       : number;
    public vehicleTypeId!                : number;
    public createdAt?                    : Date;
    public updatedAt?                    : Date;
};
export const initParkingSessionModel = (sequelize: Sequelize) => {
    if (ParkingSession.sequelize) return;
    ParkingSession.init(
        {
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
                allowNull: true,
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },
            vehicleTypeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "vehicle_type",
                    key: "id",
                },
                allowNull: true,
                onDelete: "SET NULL",
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
        },
        {
            sequelize,
            modelName: "parking_session"
        }
    );
};
