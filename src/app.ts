import "./envConfig/env.js";

import express from "express";
import bodyParser from "body-parser";
import type{Response, Request, NextFunction} from "express";
import {authRouter} from "./routes/auth-routes.js";
import {parkingSessionRouter} from "./routes/parking-session-routes.js";
import {parkingSlotRouter} from "./routes/parking-slot-routes.js";
import {vehicleTypeRouter} from "./routes/vehicle-type-routes.js";
import {messageRouter} from "./routes/message-routes.js";
import {userDeviceRouter} from "./routes/user-device-routes.js";
import {socketIOServer} from "./socket-io.js";



const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
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


const server = () => {
    try {
        const PORT = process.env.PORT || 8080;
        const httpServer = app.listen(PORT);
        socketIOServer(httpServer);
        console.log(`Server running on: ${PORT}`);
    } catch (err) {
        console.log(err)
    };
};
server();