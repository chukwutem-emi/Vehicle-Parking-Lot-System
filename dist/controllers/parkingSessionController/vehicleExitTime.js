// Models
import { ParkingSession, parkingStatus } from "../../models/parking-sessions.js";
import { ParkingSlot } from "../../models/parking-slots.js";
import VehicleType from "../../models/vehicle-types.js";
import { User, userRole } from "../../models/user.js";
// Utils
import sequelize from "../../utils/db_helpers.js";
import * as validation from "../../utils/validation.js";
export const vehicleExitTime = async (req, res, next) => {
    const vehicleNumber = req.body.vehicleNumber;
    const exitTime = new Date();
    const vehicleName = req.body.vehicleName;
    const trans = await sequelize.transaction();
    try {
        const vehicleNumberInput = {
            value: vehicleNumber,
            required: true,
            maximumLength: 100,
            minimumLength: 3
        };
        if (!validation.validate(vehicleNumberInput)) {
            return res.status(400).json({ message: "Invalid vehicleNumber. It must be a string with a minimum length of 3 and a maximum length of 100 characters." });
        }
        ;
        const vehicleNameInput = {
            value: vehicleName,
            required: true,
            maximumLength: 100,
            minimumLength: 3
        };
        if (!validation.validate(vehicleNameInput)) {
            return res.status(400).json({ message: "Invalid vehicleName. It must be a string with a minimum length of 3 and a maximum length of 100 characters." });
        }
        ;
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "We couldn't find the current logged-in user. Please ensure you are logged in." });
        }
        ;
        if (!currentUser.isAdmin && currentUser.userRole !== userRole.ADMIN) {
            return res.status(401).json({ message: "Unauthorized request. Only Admins can record vehicle exit time." });
        }
        ;
        const vehicleInfo = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            },
            transaction: trans
        });
        if (!vehicleInfo) {
            return res.status(404).json({ message: "Vehicle type with the specified name not found. Please ensure the vehicle name is correct." });
        }
        ;
        const session = await ParkingSession.findOne({
            where: {
                vehicleNumber: vehicleNumber
            },
            transaction: trans
        });
        if (!session) {
            return res.status(404).json({ message: "Active parking session for the provided vehicle number not found. Please ensure the vehicle number is correct and that the vehicle is currently parked." });
        }
        const vehicleEntryTime = session.entryTime;
        const duration = exitTime.getTime() - vehicleEntryTime.getTime();
        const durationHour = Math.ceil(duration / (1000 * 60 * 60));
        session.exitTime = exitTime;
        session.totalAmount = durationHour * vehicleInfo.hourlyRate;
        session.isCleared = true;
        session.parkingStatus = parkingStatus.COMPLETED;
        await session.save({ transaction: trans });
        const updateAvailableCapacity = await ParkingSlot.findByPk(session.slotId, { transaction: trans });
        if (!updateAvailableCapacity) {
            return res.status(404).json({ message: "Parking slot with the specified ID not found. Please ensure the slot ID is correct." });
        }
        updateAvailableCapacity.availableCapacity += 1;
        updateAvailableCapacity.save({ transaction: trans });
        await trans.commit();
        return res.status(200).json({ message: "Vehicle exit time recorded successfully.", details: session });
    }
    catch (err) {
        await trans.rollback();
        next(err);
    }
};
