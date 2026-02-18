import VehicleType from "../models/vehicle-types.js";
export const uploadVehicleType = async (req, res, next) => {
    const vehicleName = req.body.vehicleName;
    const hourlyRate = req.body.hourlyRate;
    try {
        const createVehicleType = await VehicleType.create({
            vehicleName: vehicleName,
            hourlyRate: hourlyRate
        });
        return res.status(201).json({ message: "Vehicle-type has been uploaded successfully.", details: createVehicleType });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
export const getVehicleByName = async (req, res, next) => {
    const vehicleName = req.body.vehicleName;
    try {
        const vehicleDetails = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            }
        });
        if (!vehicleDetails) {
            return res.status(404).json({ message: "The vehicle that you are searching for is not allowed here." });
        }
        return res.status(200).json({ vehicleDetails: vehicleDetails });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
export const getAllVehicles = async (req, res, next) => {
    try {
        const fetchAllVehicles = await VehicleType.findAll();
        if (fetchAllVehicles.length === 0) {
            return res.status(200).json({ message: "Vehicle database is empty.", fetchAllVehicles: [] });
        }
        return res.status(200).json({ Vehicles: fetchAllVehicles });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
