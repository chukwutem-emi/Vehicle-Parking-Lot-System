import {userRole} from "../../models/user.js";
import {Op} from "sequelize";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, ParkingSlot, User } from "../../models/index.js";




const sequelize = initModels();
export const getAvailableSlotWithIdHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
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
                body: JSON.stringify({message: "VehicleTypeId has to be a number."})
            };
        };
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized request. Please ensure you are logged in."
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We couldn't find the current logged-In user. Please ensure you are logged in."
                })
            };
        };
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
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
                    message: "No available parking slots found for the specified vehicle type."
                })
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                AvailableSlot: availableSlots
            })
        };
    } catch (error: any) {
        console.error("Error fetching available parking slot:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: error.message
            })
        };
    }
});