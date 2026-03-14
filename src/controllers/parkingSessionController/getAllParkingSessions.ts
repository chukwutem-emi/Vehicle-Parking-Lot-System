// Model
import { ParkingSession } from '../../models/parking-sessions.js';
import { User, userRole } from '../../models/user.js';
// Express types
import type { Request, Response, NextFunction } from 'express';



export const getAllParkingSessions = async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit) || 1;
    const sort = req.query.sort || "createdAt";
    const currentPage = Number(req.query.currentPage) || 1;
    const offset = (currentPage - 1) * limit;
    const vehicleTypeId = Number(req.query.vehicleTypeId);
    try {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again." });
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(403).json({ message: "You do not have permission to create parking sessions. Please ensure you are an admin user and try again. If you believe this is an error, please contact support." });
        };
        const where: any = {};

        if (vehicleTypeId) {
            where.vehicleTypeId = vehicleTypeId;
        };

        let order: any = [["createdAt", "DESC"]]
        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [sort.substring(1), "DESC"]
            } else {
                order = [sort, "ASC"]
            };
        };
        const {count, rows} = await ParkingSession.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit,
            order: order
        });
        return res.status(200).json({ 
            message: "Parking sessions retrieved successfully.",
            data: rows,
            pagination: {
                total: count,
                currentPage,
                limit,
                totalPages: Math.ceil(count / limit)
            } 
        });
    } catch (err: any) {
        next(err);
    }
};