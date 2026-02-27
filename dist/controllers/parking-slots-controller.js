import { ParkingSlot } from "../models/parking-slots.js";
import { Op } from "sequelize";
/**
 * Get all the available slots.
 */
export const getAvailableSlot = async (req, res, next) => {
    try {
        const availableSlots = await ParkingSlot.findAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                    [Op.gt]: 0
                }
            }
        });
        return res.status(200).json({ AvailableSlots: availableSlots });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
/**
 * Get available slot for a specific vehicle type.
 */
export const getAvailableSlotWithId = async (req, res, next) => {
    const vehicleTypeId = req.body.vehicleTypeId;
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
        return res.status(200).json({ Available: getWithVehicleTypeId });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        ;
        next(err);
    }
    ;
};
