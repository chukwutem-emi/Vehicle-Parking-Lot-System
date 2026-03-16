import {connectDB, ParkingSession, User} from "../model/index.js";
import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";




export const getParkingSessionHandler = withAuth( async (event, _context) => {
    try {
        console.log("Connecting database......");
        await connectDB();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            }
        };
        const sessionId: number = Number(event.pathParameters?.sessionId);
        if (isNaN(sessionId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid session ID. Session ID must be a number."
                })
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
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in and try again."
                })
            };
        };
    
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin users can perform this type of request. If you believe this is an error, please contact support."
                })
            };
        };
        const parkingSession = await ParkingSession.findByPk(sessionId);
        if (!parkingSession) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Parking session not found. Please check the session ID and try again."
                })
            };
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Parking session retrieved successfully. ${parkingSession}`
            })
        };
    } catch (err: any) {
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