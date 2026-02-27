// Models
import {UserDevices} from "../../models/user-devices.js";
import { User, userRole } from "../../models/user.js";
// Express types imports
import type {Request, Response, NextFunction} from "express";

export const getLoggedInUserDevice = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = Number(req.params.userId);

    try {
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
        return res.status(200).json({message: "Logged-in user device retrieved successfully.", userDevice: loggedInUserDevice});
    } catch (err: any) {
        next(err)
    }
};

export const getAllLoggedInUserDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        return res.status(200).json({message: "UserDevices retrieved successfully.", userDevices: loggedInUserDevices});
    } catch (err: any) {
        next(err)
    }
};