import { Sequelize } from "sequelize";
import { Conversation } from "./conversation.js";
import { Message } from "./message.js";
import { ParkingSession } from "./parking-sessions.js";
import { ParkingSlot } from "./parking-slots.js";
import { UserDevices } from "./user-devices.js";
import { User } from "./user.js";
import VehicleType from "./vehicle-types.js";
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
        freezeTableName: true,
        underscored: true
    }
});
// Associations
VehicleType.hasMany(ParkingSlot, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSlot.belongsTo(VehicleType, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSlot.hasMany(ParkingSession, { foreignKey: "slotId", onDelete: "RESTRICT" });
ParkingSession.belongsTo(ParkingSlot, { foreignKey: "slotId", onDelete: "RESTRICT" });
VehicleType.hasMany(ParkingSession, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSession.belongsTo(VehicleType, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
User.hasMany(UserDevices, { foreignKey: "userId", onDelete: "RESTRICT" });
UserDevices.belongsTo(User, { foreignKey: "userId", onDelete: "RESTRICT" });
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
        await sequelize.authenticate();
        connected = true;
    }
    ;
};
export { sequelize, Conversation, Message, ParkingSession, ParkingSlot, VehicleType, UserDevices, User };
