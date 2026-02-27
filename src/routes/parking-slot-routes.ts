// Parking-Slot Controller imports
import {getAvailableSlot, getAvailableSlotWithId} from "../controllers/parkingSlotController/fetchParkingSlot.js";
import {createParkingSlot} from "../controllers/parkingSlotController/createParkingSlot.js";
import {updateParkingSlot} from "../controllers/parkingSlotController/updateParkingSlot.js";
// Express imports
import express from "express";
// Auth-Middleware imports
import {isAuth} from "../middleware/is-auth.js";  



export const parkingSlotRouter = express.Router();


parkingSlotRouter.post("/create-parking-slot", isAuth, createParkingSlot);
parkingSlotRouter.put("/update-parking-slot/:vehicleTypeId", isAuth, updateParkingSlot);
parkingSlotRouter.get("/available-slots", isAuth, getAvailableSlot);
parkingSlotRouter.get("/available-slot-with-id/:vehicleTypeId", isAuth, getAvailableSlotWithId);