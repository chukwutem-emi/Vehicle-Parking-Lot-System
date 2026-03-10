import {connectDB, ParkingSession, User} from "../model/index.js";
import {userRole} from "../../src/models/user.js";
import { withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";



export const getAllParkingSessionHandler = withAuth( async (event) => {
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
        if (!user.isAdmin && user.userRole !== userRole.SUPER) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin users can perform this type of request. If you believe this is an error, please contact support." 
                })
            };
        };
        const parkingSessions = await ParkingSession.findAll();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Parking sessions retrieved successfully.", parkingSessions 
            })
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            }) 
        };
    };
});