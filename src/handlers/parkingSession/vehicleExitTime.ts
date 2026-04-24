import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import {vehicleExitTimeInputValidation} from "../validation/vehicleExitTimeInput.js";
import { parkingStatus } from "../../models/parking-sessions.js";
import { initModels, ParkingSession, User, VehicleType, ParkingSlot } from "../../models/index.js";



interface VehicleAttributes {
    vehicleName   : string;
    vehicleNumber : string;
};


const sequelize = initModels();
export const vehicleExitTimeHandler = withAuth( async (event, _context) => {
    const body: VehicleAttributes = JSON.parse(event.body || "{}");
    const {vehicleName, vehicleNumber} = body;
    
    const requiredFields = ["vehicleName", "vehicleNumber"];

    for (const field of requiredFields) {
        if (!(field in body)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: `Missing required field: ${field}`
                })
            };
        };
    };
    const validationResult = vehicleExitTimeInputValidation({vehicleNumber, vehicleName});
    if (validationResult !== undefined) {
        return {
            statusCode: validationResult.statusCode,
            body: validationResult.body,
            headers: validationResult.headers
        };
    };
    const trans = await sequelize.transaction()
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body:""
            };
        };
    
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized. Please login."
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in."
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin users can perform this type of request."
                })
            };
        };
        const vehicleInfo = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            },
            transaction: trans,
            lock: trans.LOCK.UPDATE
        });
        if (!vehicleInfo) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Vehicle type with the specified name not found. Please ensure the vehicle name is correct."
                })
            };
        };
        const session = await ParkingSession.findOne({
            where: {
                vehicleNumber: vehicleNumber,
                parkingStatus: parkingStatus.ACTIVE
            },
            transaction: trans,
            lock: trans.LOCK.UPDATE
        });
        if (!session) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Active parking session for the provided vehicle number not found. Please ensure the vehicle number is correct and that the vehicle is currently parked."
                })
            };
        };
        const exitTime = new Date();
        const vehicleEntryTime = session.entryTime as Date;
        const duration = exitTime.getTime() - vehicleEntryTime.getTime();
        const durationHour = Math.ceil(duration / (1000 * 60 * 60));
    
        session.exitTime = exitTime;
        session.totalAmount = durationHour * vehicleInfo.hourlyRate;
        session.isCleared = true;
        session.parkingStatus = parkingStatus.COMPLETED;
    
        await session.save({transaction: trans});
    
        const slot = await ParkingSlot.findByPk(session.slotId, {
            transaction: trans,
            lock: trans.LOCK.UPDATE
        });
        if (!slot) {
            await trans.rollback();
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Parking slot not found."
                })
            };
        };
        if (slot.availableCapacity >= slot.maximumCapacity) {
            await trans.rollback();
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Parking slot capacity exceeded"
                })
            };
        }
        if (slot.availableCapacity < slot.maximumCapacity) {
            slot.availableCapacity += 1;
            await slot.save({transaction: trans})
        };
        await trans.commit();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Vehicle exit time recorded successfully."
            })
        };
    } catch (err: unknown) {
        await trans.rollback();
        console.error("An error occurred:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "Something went wrong!"
            })
        };
    };
});