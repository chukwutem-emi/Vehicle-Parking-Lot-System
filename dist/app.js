import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { ParkingSession } from "./models/parking-sessions.js";
import { ParkingSlot } from "./models/parking-slots.js";
import VehicleType from "./models/vehicle-types.js";
import { User } from "./models/user.js";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(204);
    }
    ;
    next();
});
VehicleType.hasMany(ParkingSlot, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSlot.belongsTo(VehicleType, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSlot.hasMany(ParkingSession, { foreignKey: "slotId", onDelete: "RESTRICT" });
ParkingSession.belongsTo(ParkingSlot, { foreignKey: "slotId", onDelete: "RESTRICT" });
VehicleType.hasMany(ParkingSession, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
ParkingSession.belongsTo(VehicleType, { foreignKey: "vehicleTypeId", onDelete: "RESTRICT" });
const server = () => {
    try {
        app.listen(8080);
    }
    catch (err) {
        console.log(err);
    }
    ;
};
server();
