import { Conversation } from "../../models/conversation.js";
import { Message } from "../../models/message.js";
import { ParkingSession } from "../../models/parking-sessions.js";
import { ParkingSlot } from "../../models/parking-slots.js";
import { UserDevices } from "../../models/user-devices.js";
import { User } from "../../models/user.js";
import {VehicleType} from "../../models/vehicle-types.js";




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


export {
    Conversation,
    Message,
    ParkingSession,
    ParkingSlot,
    VehicleType,
    UserDevices,
    User
}