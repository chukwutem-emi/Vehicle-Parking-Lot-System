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


export const vehicleExitTimeHandler = withAuth( async (event, _context) => {
    const sequelize = initModels();
    const trans = await sequelize.transaction()
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body:""
            };
        };
        const body: VehicleAttributes = JSON.parse(event.body || "{}");
        const {vehicleName, vehicleNumber} = body;
    
        const validationResult = vehicleExitTimeInputValidation({vehicleNumber, vehicleName});
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
        const currentUser = event.userId;
        if (!currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
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
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in."
                })
            };
        };
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
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
                    message: "Vehicle type with the specified name not found. Please ensure the vehicle name is correct."
                })
            };
        };
        const session = await ParkingSession.findOne({
            where: {
                vehicleNumber: vehicleNumber
            },
            transaction: trans,
            lock: trans.LOCK.UPDATE
        });
        if (!session) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Active parking session for the provided vehicle number not found. Please ensure the vehicle number is correct and that the vehicle is currently parked."
                })
            };
        };
        const exitTime = new Date();
        const vehicleEntryTime = session.entryTime as Date;
        const duration = exitTime.getTime() - vehicleEntryTime.getTime();
        const durationHour = Math.ceil(duration / 1000 * 60 * 60);
    
        session.exitTime = exitTime;
        session.totalAmount = durationHour * vehicleInfo.hourlyRate;
        session.isCleared = true;
        session.parkingStatus = parkingStatus.COMPLETED;
    
        await session.save({transaction: trans});
    
        const updateAvailableCapacity = await ParkingSlot.findOne({
            where: {
                id: session.id
            },
            transaction: trans,
            lock: trans.LOCK.UPDATE
        });
        if (!updateAvailableCapacity) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Parking slot with the specified ID not found. Please ensure the slot ID is correct."
                })
            };
        }
        updateAvailableCapacity.availableCapacity += 1;
        updateAvailableCapacity.save({transaction: trans});
    
        await trans.commit();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Vehicle exit time recorded successfully.",
                details: session
            })
        };
    } catch (err: any) {
        await trans.rollback();
        console.error("An error occurred:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        };
    };
});