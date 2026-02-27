// Model
import {User, userRole} from "../../models/user.js";
import {ParkingSlot} from "../../models/parking-slots.js"; 
// Express types
import type {Request, Response, NextFunction} from "express";
// Utils
import * as validation from "../../utils/validation.js";


export const updateParkingSlot = async (req: Request, res: Response, next: NextFunction) => {
    const vehicleTypeId: number = Number(req.params.vehicleTypeId);
    const maximumCapacity: number = req.body.maximumCapacity;
    const availableCapacity: number = req.body.availableCapacity;
    const slotCode: string = req.body.slotCode;
    try {
        if (isNaN(vehicleTypeId) || vehicleTypeId <= 0) {
            return res.status(400).json({message: "Invalid vehicleTypeId. It must be a positive integer."});
        };
        const maximumCapacityInput: validation.ValidateAble = {
            value: maximumCapacity,
            required: true,
            minNumber: 10,
            maxNumber: 1000
        };
        if (!validation.validate(maximumCapacityInput)) {
            return res.status(400).json({message: "Invalid maximumCapacity. It must be a number between 10 and 1000."});
        };
        const availableCapacityInput: validation.ValidateAble = {
            value: availableCapacity,
            required: true,
            minNumber: 10,
            maxNumber: 1000
        };
        if (!validation.validate(availableCapacityInput)) {
            return res.status(400).json({message: "Invalid availableCapacity. It must be a number between 10 and 1000."});
        };
        const slotCodeInput: validation.ValidateAble = {
            value: slotCode,
            required: true,
            maximumLength: 10,
            minimumLength: 3
        };
        if (!validation.validate(slotCodeInput)) {
            return res.status(400).json({message: "Invalid slotCode. It must be a string with a minimum length of 3 and a maximum length of 10 characters."});
        };
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({message: "We could not find the current logged-in user."});
        }
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(403).json({message: "You do not have permission to update parking slots."});
        };
        const parkingSlot = await ParkingSlot.findOne({where: {vehicleTypeId}});
        if (!parkingSlot) {
            return res.status(404).json({message: "Parking slot with the specified vehicleTypeId not found."});
        };
        await parkingSlot.update({
            maximumCapacity: maximumCapacity,
            availableCapacity: availableCapacity,
            slotCode: slotCode,
            updatedBy: currentUser.username
        });
        return res.status(200).json({message: "Parking slot updated successfully."});
    } catch (err: any) {
        next(err);
    }
};