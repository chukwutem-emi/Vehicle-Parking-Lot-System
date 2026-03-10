// Models
import {connectDB, User} from "../model/index.js";
// lambdaAuth imports
import { withAuth } from "../lambdaAuth.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";




export const getUserHandler = withAuth( async (event) => {
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
                body: JSON.stringify({message: "Unauthorized: User ID missing."})
            };
        };
         const getUserById = await User.findByPk(currentUser)
        if (!getUserById) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User not found!."
                })
            };
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                userDetails: getUserById
            })
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later"
            })
        };
    };
});