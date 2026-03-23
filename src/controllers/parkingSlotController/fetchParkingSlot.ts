import { userRole } from "../../models/user.js";
import type { Request, Response, NextFunction } from "express";
import * as validation from "../../utils/validation.js";
import {Op} from "sequelize";
import { initModels, User, ParkingSlot } from "../../models/index.js";




const sequelize = initModels();
/**
 * Get all the available slots.
*/
export const getAvailableSlot = async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit) || 1;
    const sort = req.query.sort || "createdAt";
    const currentPage = Number(req.query.currentPage) || 1;
    const offset = (currentPage - 1) * limit;
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        const currentUser = await User.findByPk(req.userId);
        if (currentUser === undefined || currentUser === null) {
            return res.status(404).json({message: "We couldn't find the current logged-In user."});
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(currentUser.userRole)) {
            return res.status(401).json({message: "Unauthorized request. Only Admin users can perform this type of request."});
        }
        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]]
            } else {
                order = [[sort, "ASC"]]
            };
        };
        const {count, rows} = await ParkingSlot.findAndCountAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                  [Op.gt]: 0 
                }
            },
            offset: offset,
            limit: limit,
            order: order
        });
        if (!rows || rows.length === 0) {
            return res.status(200).json({message: "No available parking slots at the moment."});
        }
        return res.status(200).json({
            data: rows,
            pagination: {
                currentPage,
                limit,
                total: count,
                totalPage: Math.ceil(count / limit)
            }
        });
    } catch (err: any) {
        next(err)
    }
};
/**
 * Get available slot for a specific vehicle type.
 */
export const getAvailableSlotWithId = async (req: Request, res: Response, next: NextFunction) => {
    const vehicleTypeId: number = Number(req.params.vehicleTypeId);
    try {
        await sequelize.authenticate();
        if (! vehicleTypeId || isNaN(vehicleTypeId)) {
            return res.status(400).json({message: "VehicleTypeId has to be a number."});
        }
        const vehicleTypeIdInput: validation.ValidateAble = {
            required: true,
            value: vehicleTypeId,
            minNumber: 1
        };
        if (!validation.validate(vehicleTypeIdInput)) {
            return res.status(400).json({message: `Invalid Input. Vehicle-type ID is required and it must be a number greater than or equal to: ${vehicleTypeIdInput.minNumber}. Please ensure your vehicle-type ID meets these requirements.`});
        };
        const currentUser = await User.findByPk(req.userId);
        if (currentUser === undefined || currentUser === null) {
            return res.status(404).json({message: "We couldn't find the current logged-In user. Please ensure you are logged in."});
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(401).json({message: "Unauthorized request. Only Admin users can perform this type of request. Please contact your administrator if you think you should have access to this resource."});
        };
        const getWithVehicleTypeId = await ParkingSlot.findOne({
            where: {
                isAvailable: true,
                vehicleTypeId,
                availableCapacity: {
                    [Op.gt]: 0
                }
            }
        });
        if (!getWithVehicleTypeId) {
            return res.status(404).json({message: "No available parking slot found for the specified vehicle type. Please ensure the vehicle type ID is correct or check back later when more parking slots are available."});
        };
        return res.status(200).json({AvailableSlot: getWithVehicleTypeId});
    } catch(err: any) {
        next(err);
    };
};
