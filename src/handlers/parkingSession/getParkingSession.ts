import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, ParkingSession, User } from "../../models/index.js";



const sequelize = initModels();

export const getParkingSessionHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            }
        };
        const sessionId: number = Number(event.pathParameters?.sessionId);
        if (!sessionId || isNaN(sessionId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid session ID. Session ID must be a number.",
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
                    message: "Unauthorized. Please login.",
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
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again.",
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
                    message: "Forbidden request. Only Admin users can perform this type of request. If you believe this is an error, please contact support.",
                    data: null
                })
            };
        };
        const parkingSession = await ParkingSession.findByPk(sessionId);
        if (!parkingSession) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Parking session not found. Please check the session ID and try again.",
                    data: null
                })
            };
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Parking session retrieved successfully.",
                data: parkingSession.toJSON()
            })
        };
    } catch (err: unknown) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "Something went wrong!",
                data: null
            })
        };
    };
});