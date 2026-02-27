// Parking-Session Controller imports
import {createParkingSession} from "../controllers/parkingSessionController/createParkingSession.js";
import {vehicleExitTime} from "../controllers/parkingSessionController/vehicleExitTime.js"; 
import {getAllParkingSessions} from "../controllers/parkingSessionController/getAllParkingSessions.js";
import {getParkingSession} from "../controllers/parkingSessionController/getParkingSession.js";
// Express imports
import express from "express";
// Auth-middleware
import {isAuth} from "../middleware/is-auth.js"; 



export const parkingSessionRouter = express.Router();

parkingSessionRouter.post("/create-parking-session", isAuth, createParkingSession);
parkingSessionRouter.post("/exit", isAuth, vehicleExitTime);
parkingSessionRouter.get("/get-all", isAuth, getAllParkingSessions);
parkingSessionRouter.get("/get/:sessionId", isAuth, getParkingSession);