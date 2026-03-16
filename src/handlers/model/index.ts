import { Sequelize } from "sequelize";
import { Conversation } from "../../models/conversation.js";
import { Message } from "../../models/message.js";
import { ParkingSession } from "../../models/parking-sessions.js";
import { ParkingSlot } from "../../models/parking-slots.js";
import { UserDevices } from "../../models/user-devices.js";
import { User } from "../../models/user.js";
import VehicleType from "../../models/vehicle-types.js";
import fs from "fs";
import path from "path";





const caPath = path.join(process.cwd(), "certificate/ca.pem");
let caCert: Buffer;
try {
    caCert = fs.readFileSync(caPath);
} catch (err) {
    console.error("Failed to read ssl certificate:", err);
    throw err;
}

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        dialect: "mysql",
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT),
        define: {
            freezeTableName: true,
            underscored: true
        },
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(caCert),
                rejectUnauthorized: true
            }
        } as any,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 30000
        }
    }
);

// Associations
VehicleType.hasMany(ParkingSlot, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});
ParkingSlot.belongsTo(VehicleType, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});

ParkingSlot.hasMany(ParkingSession, {foreignKey: "slotId", onDelete: "RESTRICT"});
ParkingSession.belongsTo(ParkingSlot, {foreignKey: "slotId", onDelete: "RESTRICT"});

VehicleType.hasMany(ParkingSession, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});
ParkingSession.belongsTo(VehicleType, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});

User.hasMany(UserDevices, {foreignKey: "userId", onDelete: "RESTRICT"});
UserDevices.belongsTo(User, {foreignKey: "userId", onDelete: "RESTRICT"});

Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

Message.belongsTo(Message, { foreignKey: 'reply_id', as: 'reply' });
Message.hasMany(Message, { foreignKey: 'reply_id', as: 'replies' });

Message.belongsTo(User, { foreignKey: 'sender_id' });
User.hasMany(Message, { foreignKey: 'sender_id' });


// Lazy connect (only once per Lambda container)
let connected = false;
export const connectDB = async () => {
    if (!connected) {
        console.log("File in /var/task:", fs.readdirSync("/var/task"));
        console.log("Connecting to:", process.env.DB_HOST, process.env.DB_PORT);
        const start = Date.now();
        await sequelize.authenticate();
        connected = true;
        console.log("Database connected, took:", Date.now() - start, "ms");
    };
};

export {
    sequelize,
    Conversation,
    Message,
    ParkingSession,
    ParkingSlot,
    VehicleType,
    UserDevices,
    User
}