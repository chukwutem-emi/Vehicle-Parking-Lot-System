// Models
import { ParkingSlot } from "../../models/parking-slots.js";
import { User, userRole } from "../../models/user.js";
// Express types
import type { Request, Response, NextFunction } from "express";
// Utils
import * as validation from "../../utils/validation.js";
// Third-party module
import {Op} from "sequelize";



/**
 * Get all the available slots.
 */
export const getAvailableSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({message: "We couldn't find the current logged-In user."});
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(401).json({message: "Unauthorized request. Only Admin users can perform this type of request."});
        }
        const availableSlots = await ParkingSlot.findAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                  [Op.gt]: 0 
                }
            }
        });
        if (!availableSlots || availableSlots.length === 0) {
            return res.status(200).json({message: "No available parking slots at the moment."});
        }
        return res.status(200).json({AvailableSlots: availableSlots});
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
        if (isNaN(vehicleTypeId)) {
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
        if (!currentUser) {
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
            return res.status(200).json({message: "No available parking slot found for the specified vehicle type. Please ensure the vehicle type ID is correct or check back later when more parking slots are available."});
        };
        return res.status(200).json({AvailableSlot: getWithVehicleTypeId});
    } catch(err: any) {
        next(err);
    };
};
