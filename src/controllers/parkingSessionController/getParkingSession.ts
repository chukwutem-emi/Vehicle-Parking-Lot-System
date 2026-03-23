import { initModels, User, ParkingSession } from "../../models/index.js";
import { userRole } from "../../models/user.js";
import type { Request, Response, NextFunction } from "express";


const sequelize = initModels();
export const getParkingSession = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId : number = Number(req.params.sessionId);

    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (isNaN(sessionId)) {
            return res.status(400).json({message: "Invalid session ID. Session ID must be a number."});
        };
        const currentUser = await User.findByPk(req.userId);
        if (currentUser === undefined || currentUser === null) {
            return res.status(404).json({message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again."});
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(currentUser.userRole)) {
            return res.status(403).json({message: "You do not have permission to access this parking session. Please ensure you are an admin or super user and try again. If you believe this is an error, please contact support."});
        };
        const parkingSession = await ParkingSession.findByPk(sessionId);
        if (!parkingSession) {
            return res.status(404).json({message: "Parking session not found. Please check the session ID and try again."});
        }
        return res.status(200).json({message: "Parking session retrieved successfully.", parkingSession});
    } catch (err: any) {
        next(err);
    }
};                     