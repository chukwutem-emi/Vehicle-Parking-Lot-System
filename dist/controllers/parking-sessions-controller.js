import sequelize from "../utils/db_helpers.js";
import { ParkingSlot } from "../models/parking-slots.js";
import VehicleType from "../models/vehicle-types.js";
import { ParkingSession } from "../models/parking-sessions.js";
import { parkingStatus } from "../models/parking-sessions.js";
/**
 *  Assigning a vehicle and reducing the capacity. When a vehicle parks, I  decrees the capacity.
 */
export const createParkingSession = async (req, res, next) => {
    const slotId = req.body.slotId;
    const vehicleId = req.body.vehicleId;
    const vehicleNumber = req.body.vehicleNumber;
    const vehicleOwnerPhone = req.body.vehicleOwnerPhone;
    const vehicleOwnerAddress = req.body.vehicleOwnerAddress;
    const vehicleOwnerNextOfKin = req.body.vehicleOwnerNextOfKin;
    const vehicleOwnerNextOfKinPhone = req.body.vehicleOwnerNextOfKinPhone;
    const vehicleOwnerNextOfKinAddress = req.body.vehicleOwnerNextOfKinAddress;
    const t = await sequelize.transaction();
    try {
        const slot = await ParkingSlot.findByPk(slotId, { transaction: t });
        if (!slot) {
            return res.status(404).json({ message: "Slot not found!" });
        }
        ;
        if (!slot.isAvailable || slot.availableCapacity <= 0) {
            return res.status(400).json({ message: "Slot is full or unavailable." });
        }
        slot.availableCapacity -= 1;
        if (slot.availableCapacity === 0) {
            slot.isAvailable = false;
        }
        const vehicle = await VehicleType.findByPk(vehicleId, { transaction: t });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle-type does not exist." });
        }
        await ParkingSession.create({
            slotId: slot.id,
            vehicleNumber: vehicleNumber,
            vehicleOwnerAddress: vehicleOwnerAddress,
            vehicleOwnerPhone: vehicleOwnerPhone,
            vehicleOwnerNextOfKin: vehicleOwnerNextOfKin,
            vehicleOwnerNextOfKinAddress: vehicleOwnerNextOfKinAddress,
            vehicleOwnerNextOfKinPhone: vehicleOwnerNextOfKinPhone,
            vehicleTypeId: vehicle.id
        }, { transaction: t });
        await slot.save({ transaction: t });
        await t.commit();
        return res.status(201).json({ message: "Parking Session created successfully" });
    }
    catch (err) {
        await t.rollback();
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
export const vehicleExitTime = async (req, res, next) => {
    const vehicleNumber = req.body.vehicleNumber;
    const exitTime = new Date();
    const vehicleName = req.body.vehicleName;
    const trans = await sequelize.transaction();
    try {
        const vehicleInfo = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            },
            transaction: trans
        });
        if (!vehicleInfo) {
            return res.status(404).json({ message: "We don't have such vehicle-name. You entered an invalid vehicle name or the vehicle-type is not allowed here." });
        }
        ;
        const session = await ParkingSession.findOne({
            where: {
                vehicleNumber: vehicleNumber
            },
            transaction: trans
        });
        if (!session) {
            return res.status(404).json({ message: "Vehicle number provided does not exist." });
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
            return res.status(404).json({ message: "Invalid slotId provided." });
        }
        updateAvailableCapacity.availableCapacity += 1;
        updateAvailableCapacity.save({ transaction: trans });
        await trans.commit();
        return res.status(200).json({ message: "Vehicle exited" });
    }
    catch (err) {
        await trans.rollback();
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
