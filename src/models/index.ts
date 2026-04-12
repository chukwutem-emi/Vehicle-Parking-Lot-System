import { getSequelize } from "../utils/db_helpers.js";
import { initConversation,Conversation } from "./conversation.js";
import { initMessageModel, Message } from "./message.js";
import { initParkingSessionModel, ParkingSession } from "./parking-sessions.js";
import { initParkingSlotModel, ParkingSlot } from "./parking-slots.js";
import { initUserDevicesModel, UserDevices } from "./user-devices.js";
import { initUserModel, User } from "./user.js";
import { initVehicleTypeModel, VehicleType } from "./vehicle-types.js";

let initialized = false;
let sequelize: ReturnType<typeof getSequelize> | null = null;

export const initModels = () => {
    if (!sequelize) {
        sequelize = getSequelize();
    };

    if (initialized) return sequelize;
    if (!sequelize) throw new Error("Sequelize instance is not available");

    initUserModel(sequelize);
    initParkingSlotModel(sequelize);
    initParkingSessionModel(sequelize);
    initVehicleTypeModel(sequelize);
    initMessageModel(sequelize);
    initUserDevicesModel(sequelize);
    initConversation(sequelize);

    // Associations
    VehicleType.hasMany(ParkingSlot, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});
    ParkingSlot.belongsTo(VehicleType, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});

    ParkingSlot.hasMany(ParkingSession, {foreignKey: "slotId", onDelete: "RESTRICT"});
    ParkingSession.belongsTo(ParkingSlot, {foreignKey: "slotId", onDelete: "RESTRICT"});

    VehicleType.hasMany(ParkingSession, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});
    ParkingSession.belongsTo(VehicleType, {foreignKey: "vehicleTypeId", onDelete: "RESTRICT"});

    User.hasMany(UserDevices, {foreignKey: "userId", onDelete: "SET NULL"});
    UserDevices.belongsTo(User, {foreignKey: "userId", onDelete: "SET NULL"});

    Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
    Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

    Message.belongsTo(Message, { foreignKey: 'reply_id', as: 'reply' });
    Message.hasMany(Message, { foreignKey: 'reply_id', as: 'replies' });

    Message.belongsTo(User, { foreignKey: 'sender_id', onDelete: "SET NULL"});
    User.hasMany(Message, { foreignKey: 'sender_id', onDelete: "SET NULL" });


    
    initialized = true;
    
    return sequelize;
};

export {
    Conversation,
    Message,
    ParkingSession,
    ParkingSlot,
    VehicleType,
    UserDevices,
    User
}