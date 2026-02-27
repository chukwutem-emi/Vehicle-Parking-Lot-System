// Utils
import * as validation from "../../utils/validation.js";
// Models
import VehicleType from "../../models/vehicle-types.js";
import { User, userRole } from "../../models/user.js";
export const uploadVehicleType = async (req, res, next) => {
    const vehicleName = req.body.vehicleName;
    const hourlyRate = req.body.hourlyRate;
    try {
        const vehicleNameInput = {
            value: vehicleName,
            required: true,
            maximumLength: 100,
            minimumLength: 2
        };
        if (!validation.validate(vehicleNameInput)) {
            return res.status(400).json({ message: `Invalid input. Vehicle name is required and the length must be: ${vehicleNameInput.minimumLength} - ${vehicleNameInput.maximumLength} characters. Please ensure your vehicle name meets these requirements.` });
        }
        ;
        const hourlyRateInput = {
            value: hourlyRate,
            required: true,
            maxNumber: 10,
            minNumber: 4
        };
        if (!validation.validate(hourlyRateInput)) {
            return res.status(400).json({ message: `Invalid input. Hourly rate is required and it must be a number between: ${hourlyRateInput.minNumber} - ${hourlyRateInput.maxNumber}. Please ensure your hourly rate meets these requirements.` });
        }
        ;
        const getUser = await User.findByPk(req.userId);
        if (!getUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in." });
        }
        ;
        if (getUser.userRole !== userRole.ADMIN || getUser.userRole !== userRole.SUPER) {
            return res.status(401).json({ message: "Unauthorized request. Only Admins or Super Admins can upload vehicle-type." });
        }
        ;
        const createVehicleType = await VehicleType.create({
            vehicleName: vehicleName,
            hourlyRate: hourlyRate
        });
        return res.status(201).json({ message: "Vehicle-type has been uploaded successfully.", details: createVehicleType });
    }
    catch (err) {
        next(err);
    }
};
