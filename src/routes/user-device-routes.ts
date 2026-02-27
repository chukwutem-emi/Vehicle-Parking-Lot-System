// UserDevices-Controller imports
import {getAllLoggedInUserDevices, getLoggedInUserDevice} from "../controllers/userDeviceController/userDevice.js";
// Third-party module
import express from "express";
// Auth-Middleware imports
import {isAuth} from "../middleware/is-auth.js"; 



export const userDeviceRouter = express.Router();


userDeviceRouter.get("/get-all-devices", isAuth, getAllLoggedInUserDevices);
userDeviceRouter.get("/get-device/:userId", isAuth, getLoggedInUserDevice);