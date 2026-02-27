// Model
import { ParkingSlot } from "../../models/parking-slots.js";
import { User, userRole } from "../../models/user.js";
// Utils
import * as validation from "../../utils/validation.js";
export const createParkingSlot = async (req, res, next) => {
    const slotCode = req.body.slotCode;
    const vehicleTypeId = req.body.vehicleTypeId;
    try {
        const slotCodeInput = {
            value: slotCode,
            required: true,
            maximumLength: 10,
            minimumLength: 3
        };
        if (!validation.validate(slotCodeInput)) {
            return res.status(400).json({ message: `Invalid Input. Slot-code is required and it must contain at least: ${slotCodeInput.minimumLength} - ${slotCodeInput.maximumLength} length of characters. Please ensure your slot-code meets these requirements.` });
        }
        ;
        const vehicleTypeIdInput = {
            value: vehicleTypeId,
            required: true,
            minNumber: 1
        };
        if (!validation.validate(vehicleTypeIdInput)) {
            return res.status(400).json({ message: `Invalid Input. Vehicle-type ID is required and it must be a number greater than or equal to: ${vehicleTypeIdInput.minNumber}. Please ensure your vehicle-type ID meets these requirements.` });
        }
        ;
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(401).json({ message: "Unauthorized request. You do not have permission to create parking slots. Please contact your administrator if you think you should have access to this resource." });
        }
        ;
        const existingSlotCode = await ParkingSlot.findOne({
            where: {
                slotCode: slotCode
            }
        });
        if (existingSlotCode) {
            return res.status(400).json({ message: "Invalid input. The slot code you provided already exists. Please choose a different slot code." });
        }
        ;
        await ParkingSlot.create({
            slotCode: slotCode,
            vehicleTypeId: vehicleTypeId
        });
        return res.status(201).json({ message: "Parking slot created successfully." });
    }
    catch (err) {
        next(err);
    }
};
