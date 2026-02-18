import { ParkingSlot } from "../models/parking-slots.js";
import type { Request, Response, NextFunction } from "express";

import {Op} from "sequelize";

/**
 * Get all the available slots.
 */
export const getAvailableSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availableSlots = await ParkingSlot.findAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                  [Op.gt]: 0 
                }
            }
        });
        return res.status(200).json({AvailableSlots: availableSlots});
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
};
/**
 * Get available slot for a specific vehicle type.
 */
export const getAvailableSlotWithId = async (req: Request, res: Response, next: NextFunction) => {
    const vehicleTypeId: number = req.body.slotId;
    try {
        const getWithVehicleTypeId = await ParkingSlot.findOne({
            where: {
                isAvailable: true,
                vehicleTypeId,
                availableCapacity: {
                    [Op.gt]: 0
                }
            }
        });
        return res.status(200).json({Available: getWithVehicleTypeId});
    } catch(err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        };
        next(err);
    };
};
