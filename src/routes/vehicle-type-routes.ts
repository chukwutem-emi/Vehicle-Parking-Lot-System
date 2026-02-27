// Vehicle-Type-Controller imports
import {uploadVehicleType} from "../controllers/vehicleTypesController/createVehicleType.js";
import {getAllVehicles, getVehicleByName} from "../controllers/vehicleTypesController/fetchVehicleType.js";
import {updateVehicleType} from "../controllers/vehicleTypesController/updateVehicleType.js";
// Third-party module
import express from "express";
// Auth-Middleware import
import {isAuth} from "../middleware/is-auth.js";




export const vehicleTypeRouter = express.Router();


vehicleTypeRouter.post("/vehicle-type", isAuth, uploadVehicleType);
vehicleTypeRouter.get("/get-all-vehicles", isAuth, getAllVehicles);
vehicleTypeRouter.get("/get-vehicle", isAuth, getVehicleByName);
vehicleTypeRouter.put("/update-vehicle-type/:vehicleId", isAuth, updateVehicleType);