import {User, connectDB, ParkingSlot} from "../model/index.js";
import {userRole} from "../../models/user.js";
import {Op} from "sequelize";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";



export const getAvailableSlotHandler = withAuth( async (event) => {
    await connectDB();
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const currentUser = event.userId;
        if (!currentUser) {
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
        const availableSlots = await ParkingSlot.findAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                  [Op.gt]: 0 
                }
            }
        });
        if (!availableSlots || availableSlots.length === 0) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "No available parking slots at the moment."
                })
            };
        };
        return {
            statusCode: 200, 
            headers: corsHeaders,  
            body: JSON.stringify({
                AvailableSlots: availableSlots
            })
        };
    } catch (err: any) {
        console.error("Error fetching available parking slots:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. An error occurred while fetching available parking slots. Please try again later."
            })
        };
    };
});