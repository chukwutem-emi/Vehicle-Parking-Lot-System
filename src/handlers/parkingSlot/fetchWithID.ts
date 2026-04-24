import {userRole} from "../../models/user.js";
import {Op} from "sequelize";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, ParkingSlot, User } from "../../models/index.js";




const sequelize = initModels();
export const getAvailableSlotWithIdHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const vehicleTypeId: number = Number(event.pathParameters?.vehicleTypeId);
    
        if (!vehicleTypeId || isNaN(vehicleTypeId)) {
            return { 
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "VehicleTypeId has to be a number.",
                    data: null
                })
            };
        };
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized request. Please ensure you are logged in.",
                    data: null
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
                    message: "We couldn't find the current logged-In user. Please ensure you are logged in.",
                    data: null
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request.",
                    data: null
                })
            };
        };
        const availableSlots = await ParkingSlot.findOne({
            where: {
                isAvailable: true,
                availableCapacity: {
                    [Op.gt]: 0 
                },
                vehicleTypeId: vehicleTypeId
            }
        });
        if (!availableSlots) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    success: false,
                    message: "No available parking slots found for the specified vehicle type.",
                    data: null
                })
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Parking slot retrieved successfully!",
                data: availableSlots.toJSON()
            })
        };
    } catch (error: unknown) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: error instanceof Error ? error.message : "Something went wrong!",
                data: null
            })
        };
    }
});