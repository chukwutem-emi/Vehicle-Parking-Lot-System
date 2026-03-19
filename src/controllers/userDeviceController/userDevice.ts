import { initModels, User, UserDevices } from "../../models/index.js";
import { userRole } from "../../models/user.js";
import type {Request, Response, NextFunction} from "express";




const convertUTCToLocal = (utcDate: string | Date, timeZone="Africa/Lagos") => {
    return new Date(utcDate).toLocaleString("en-Us", {timeZone: timeZone, hour12: true});
};

export const getLoggedInUserDevice = async (req: Request, res: Response, next: NextFunction) => {
    const sequelize = initModels();
    const userId: number = Number(req.params.userId);

    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        if (isNaN(userId)) {
            return res.status(400).json({message: "User ID must be a number."});
        };
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again."});
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Super Admins can retrieve logged-in user device."})
        }
        const loggedInUserDevice = await UserDevices.findByPk(userId);
        if (!loggedInUserDevice) {
            return res.status(404).json({message: "Logged-in user device with the provided userID not found."});
        };
        const deviceWithLocalTime = {
            ...loggedInUserDevice.toJSON(),
            loginTime: loggedInUserDevice.loginTime ? convertUTCToLocal(loggedInUserDevice.loginTime) : null
        }
        return res.status(200).json({message: "Logged-in user device retrieved successfully.", userDevice: deviceWithLocalTime});
    } catch (err: any) {
        next(err)
    }
};


export const getAllLoggedInUserDevices = async (req: Request, res: Response, next: NextFunction) => {
    const sequelize = initModels();
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again."});
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Super Admins can retrieve logged-in user devices."})
        };
        const loggedInUserDevices = await UserDevices.findAll();
        if (!loggedInUserDevices) {
            return res.status(204).json({message: "UserDevices database table is empty.", loggedInUserDevices: []});
        };
        const deviceWithLocalTime = loggedInUserDevices.map((device) => ({
            ...device.toJSON(),
            loginTime: device.loginTime ? convertUTCToLocal(device.loginTime) : null
        }))
        return res.status(200).json({message: "UserDevices retrieved successfully.", userDevices: deviceWithLocalTime});
    } catch (err: any) {
        next(err)
    }
};