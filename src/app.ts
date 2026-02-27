import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import {ParkingSession} from "./models/parking-sessions.js";
import {ParkingSlot} from "./models/parking-slots.js";
import VehicleType from "./models/vehicle-types.js";
import type{Response, Request, NextFunction} from "express";
import {UserDevices} from "./models/user-devices.js";
import {User} from "./models/user.js";
import {authRouter} from "./routes/auth-routes.js";
import {parkingSessionRouter} from "./routes/parking-session-routes.js";
import {parkingSlotRouter} from "./routes/parking-slot-routes.js";
import {vehicleTypeRouter} from "./routes/vehicle-type-routes.js";
import {messageRouter} from "./routes/message-routes.js";
import {userDeviceRouter} from "./routes/user-device-routes.js";
import {socketIOServer} from "./socket-io.js";
import {Conversation} from "./models/conversation.js";
import {Message} from "./models/message.js";




dotenv.config();
const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(204);
    };
    next();
});

// Registering the routes
app.use("/api/auth", authRouter);
app.use("/api/parking-sessions", parkingSessionRouter);
app.use("/api/parking-slots", parkingSlotRouter);
app.use("/api/vehicle-type", vehicleTypeRouter);
app.use("/api/message", messageRouter);
app.use("/api/user-device", userDeviceRouter);


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error", message: "An unexpected error occurred. Please try again later."});
});


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

const server = () => {
    try {
        const httpServer = app.listen(8080);
        socketIOServer(httpServer);
    } catch (err) {
        console.log(err)
    };
};
server();