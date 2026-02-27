// Utils
import * as validation from "../../utils/validation.js";
// Models
import VehicleType from "../../models/vehicle-types.js";
import { User, userRole } from "../../models/user.js";
export const updateVehicleType = async (req, res, next) => {
    const vehicleId = Number(req.params.vehicleId);
    const newVehicleName = req.body.newVehicleName;
    const newHourlyRate = req.body.newHourlyRate;
    try {
        const vehicleNameInput = {
            value: newVehicleName,
            required: true,
            maximumLength: 100,
            minimumLength: 2
        };
        if (!validation.validate(vehicleNameInput)) {
            return res.status(400).json({ message: `Invalid input. Vehicle name is required and the length must be: ${vehicleNameInput.minimumLength} - ${vehicleNameInput.maximumLength} characters. Please ensure your vehicle name meets these requirements.` });
        }
        ;
        const hourlyRateInput = {
            value: newHourlyRate,
            required: true,
            maxNumber: 10,
            minNumber: 4
        };
        if (!validation.validate(hourlyRateInput)) {
            return res.status(400).json({ message: `Invalid input. Hourly rate is required and it must be a number between: ${hourlyRateInput.minNumber} - ${hourlyRateInput.maxNumber}. Please ensure your hourly rate meets these requirements.` });
        }
        ;
        if (isNaN(vehicleId)) {
            return res.status(400).json({ message: `Invalid input. Vehicle ID is required and it must be a valid number.` });
        }
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(401).json({ message: "Unauthorized request. Only Admins or Super Admins can update vehicle-type." });
        }
        ;
        const getVehicleById = await VehicleType.findByPk(vehicleId);
        if (!getVehicleById) {
            return res.status(404).json({ message: "Vehicle-type with the specified ID not found. Please ensure the vehicle ID is correct." });
        }
        ;
        getVehicleById.vehicleName = newVehicleName;
        getVehicleById.hourlyRate = newHourlyRate;
        getVehicleById.updatedBy = currentUser.username;
        getVehicleById.save();
        return res.status(200).json({ message: "Vehicle-type updated successfully.", details: getVehicleById });
    }
    catch (err) {
        next(err);
    }
};
