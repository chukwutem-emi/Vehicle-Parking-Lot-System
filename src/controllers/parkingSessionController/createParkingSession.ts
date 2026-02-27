// Express types
import type { Request, Response, NextFunction } from "express";
// Models
import {ParkingSession} from "../../models/parking-sessions.js"
import { ParkingSlot } from "../../models/parking-slots.js";
import { VehicleType } from "../../models/vehicle-types.js";
// Utils
import * as validation from "../../utils/validation.js";
import sequelize from "../../utils/db_helpers.js";
import { User, userRole } from "../../models/user.js";



/**
 *  Assigning a vehicle and reducing the capacity. When a vehicle parks, I  decrees the capacity.
 */
export const createParkingSession = async (req: Request, res: Response, next: NextFunction) => {
    const slotId                       : number = req.body.slotId;
    const vehicleId                    : number = req.body.vehicleId;
    const vehicleNumber                : string = req.body.vehicleNumber;
    const vehicleOwnerPhone            : string = req.body.vehicleOwnerPhone;
    const vehicleOwnerAddress          : string = req.body.vehicleOwnerAddress;
    const vehicleOwnerNextOfKin        : string = req.body.vehicleOwnerNextOfKin;
    const vehicleOwnerNextOfKinPhone   : string = req.body.vehicleOwnerNextOfKinPhone;
    const vehicleOwnerNextOfKinAddress : string = req.body.vehicleOwnerNextOfKinAddress;

    const t = await sequelize.transaction();
    try{
        const slotIdInput: validation.ValidateAble = {
            value: slotId,
            required: true,
            minNumber: 1
        };
        if (!validation.validate(slotIdInput)) {
            return res.status(400).json({message: "Invalid slotId. It must be a positive integer greater than 0."});
        }
        const vehicleIdInput: validation.ValidateAble = {
            value: vehicleId,
            required: true,     
            minNumber: 1
        };
        if (!validation.validate(vehicleIdInput)) {
            return res.status(400).json({message: "Invalid vehicleId. It must be a positive integer greater than 0."});
        };
        const vehicleNumberInput: validation.ValidateAble = {
            value: vehicleNumber,
            required: true,
            maximumLength: 100,
            minimumLength: 3
        };
        if (!validation.validate(vehicleNumberInput)) {
            return res.status(400).json({message: "Invalid vehicleNumber. It must be a string with a minimum length of 3 and a maximum length of 100 characters."});
        };
        const vehicleOwnerPhoneInput: validation.ValidateAble = {
            value: vehicleOwnerPhone,
            required: true,
            isPhone: true,
            maximumLength: 15,
            minimumLength: 7
        };
        if (!validation.validate(vehicleOwnerPhoneInput)) {
            return res.status(400).json({message: "Invalid vehicleOwnerPhone. It must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits."});
        };
        const vehicleOwnerAddressInput: validation.ValidateAble = {
            value: vehicleOwnerAddress,
            required: true,
            maximumLength: 200,
            minimumLength: 10,
            minNumber: 1
        };
        if (!validation.validate(vehicleOwnerAddressInput)) {
            return res.status(400).json({message: "Invalid vehicleOwnerAddress. It must be a string with a minimum length of 10 and a maximum length of 200 characters. It must also contain at least one digit number."});
        };
        const vehicleOwnerNextOfKinInput: validation.ValidateAble = {
            value: vehicleOwnerNextOfKin,
            required: true,
            maximumLength: 100,
            minimumLength: 10
        };
        if (!validation.validate(vehicleOwnerNextOfKinInput)) {
            return res.status(400).json({message: "Invalid vehicleOwnerNextOfKin. It must be a string with a minimum length of 10 and a maximum length of 100 characters."});
        };

        const vehicleOwnerNextOfKinPhoneInput: validation.ValidateAble = {
            value: vehicleOwnerNextOfKinPhone,
            required: true,
            isPhone: true,
            maximumLength: 15,
            minimumLength: 7
        };
        if (!validation.validate(vehicleOwnerNextOfKinPhoneInput)) {
            return res.status(400).json({message: "Invalid vehicleOwnerNextOfKinPhone. It must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits."});
        };
        const vehicleOwnerNextOfKinAddressInput: validation.ValidateAble = {
            value: vehicleOwnerNextOfKinAddress,
            required: true,
            maximumLength: 200,
            minimumLength: 10,
            minNumber: 1
        };
        if (!validation.validate(vehicleOwnerNextOfKinAddressInput)) {
            return res.status(400).json({message: "Invalid vehicleOwnerNextOfKinAddress. It must be a string with a minimum length of 10 and a maximum length of 200 characters. It must also contain at least one digit number."});
        };
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again." });
        };
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(403).json({ message: "You do not have permission to access parking sessions. Please ensure you are a super admin user and try again. If you believe this is an error, please contact support." });
        };

        const slot = await ParkingSlot.findByPk(slotId, {transaction: t});
        if (!slot) {
            return res.status(404).json({message: "Parking slot with the specified ID not found. Please ensure the slot ID is correct."});
        }
        if (!slot.isAvailable || slot.availableCapacity <= 0) {
            return res.status(400).json({message: "The parking slot you selected is currently unavailable. Please check back later."});
        }
        slot.availableCapacity -= 1;

        if (slot.availableCapacity === 0) {
            slot.isAvailable = false
        }
        const vehicle = await VehicleType.findByPk(vehicleId, {transaction: t});
        if (!vehicle) {
            return res.status(404).json({message: "Vehicle type with the specified ID not found. Please ensure the vehicle ID is correct."});
        }
        await ParkingSession.create({
            slotId                       : slot.id,
            vehicleNumber                : vehicleNumber,
            vehicleOwnerAddress          : vehicleOwnerAddress,
            vehicleOwnerPhone            : vehicleOwnerPhone,
            vehicleOwnerNextOfKin        : vehicleOwnerNextOfKin,
            vehicleOwnerNextOfKinAddress : vehicleOwnerNextOfKinAddress,
            vehicleOwnerNextOfKinPhone   : vehicleOwnerNextOfKinPhone,
            vehicleTypeId                : vehicle.id
        }, {transaction: t});
        await slot.save({transaction: t});
        await t.commit();
        return res.status(201).json({message: "Parking session created successfully."});
    } catch (err: any) {
        await t.rollback();
        next(err);
    }
};