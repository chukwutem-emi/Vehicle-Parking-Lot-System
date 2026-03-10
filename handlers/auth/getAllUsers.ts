// Models
import {User, connectDB} from "../model/index.js";
import {userRole} from "../../src/models/user.js";
// Auth Wrapper import
import {withAuth} from "../lambdaAuth.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";




export const getAllUsersHandler = withAuth( async (event) => {
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
                    message: "You haven't authenticated yet. Please login."
                })
            };
        };
        const getUser = await User.findByPk(currentUser);
        if (!getUser) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We could not find the current logged-in user. Please ensure you are logged in."
                })
            };
        };
        if (!getUser.isAdmin && getUser.userRole !== userRole.SUPER) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Super-Admin users can perform this type of request."
                })
            };
        };
        const usersDetails = await User.findAll();
        if (usersDetails.length === 0) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "The user database is empty.",
                    usersDetails: []
                })
            };
        };
        return {
            statusCode: 200,
            body: JSON.stringify({
                usersDetails: usersDetails
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