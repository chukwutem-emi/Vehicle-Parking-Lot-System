// Utils
import * as validation from "../../utils/validation.js";
// Models
import VehicleType from "../../models/vehicle-types.js";
import { User, userRole } from "../../models/user.js";
/**
 * Fetch vehicle-types by their name.
 */
export const getVehicleByName = async (req, res, next) => {
    const vehicleName = req.body.vehicleName;
    try {
        const vehicleNameInput = {
            value: vehicleName,
            required: true,
            maximumLength: 100,
            minimumLength: 2
        };
        if (!validation.validate(vehicleNameInput)) {
            return res.status(400).json({ message: `Invalid input. Vehicle name is required and it must have a minimum of: ${vehicleNameInput.minimumLength} and a maximum of: ${vehicleNameInput.maximumLength} characters length.` });
        }
        ;
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User with the Logged-In ID not found!." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(401).json({ message: "Unauthorized request. Only Admins can fetch other users" });
        }
        ;
        const vehicleDetails = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            }
        });
        if (!vehicleDetails) {
            return res.status(404).json({ message: "That type of vehicle is not allowed here." });
        }
        return res.status(200).json({ vehicleDetails: vehicleDetails });
    }
    catch (err) {
        next(err);
    }
};
/**
 * Fetch all vehicle-types.
 */
export const getAllVehicles = async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.SUPER) {
            return res.status(401).json({ message: "Unauthorized request. Only Super Admins can fetch all vehicle-types." });
        }
        ;
        const fetchAllVehicles = await VehicleType.findAll();
        if (fetchAllVehicles.length === 0) {
            return res.status(200).json({ message: "Vehicle database is empty.", fetchAllVehicles: [] });
        }
        ;
        return res.status(200).json({ Vehicles: fetchAllVehicles });
    }
    catch (err) {
        next(err);
    }
};
