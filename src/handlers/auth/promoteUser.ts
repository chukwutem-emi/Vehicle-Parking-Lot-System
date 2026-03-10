// Models
import {User, connectDB} from "../model/index.js";
import {userRole} from "../../models/user.js";
// LambdaAuth import
import {withAuth} from "../lambdaAuth.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";



export const  promoteUserHandler = withAuth( async (event) => {
    await connectDB();
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const userId = Number(event.pathParameters?.userId);
        const currentUser = event.userId
        if (isNaN(userId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid user ID. User ID must be a number."
                })
            };
        };
        if (!currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized. Please login!."
                })
            };
        };
        const getSuperAdmin = await User.findByPk(currentUser);
        if (!getSuperAdmin) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We could not find the current logged-in user. Please ensure you are logged in."
                })
            };
        }
        if (!getSuperAdmin.isAdmin && getSuperAdmin.userRole !== userRole.SUPER) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Super Admins can promote users to admin."
                })
            };
        };
        const user = await User.findByPk(userId);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User not found.  Please ensure the user ID is correct."
                })
            };
        };
        user.isAdmin  = true;
        user.userRole = userRole.ADMIN;
        await user.save();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `${user.username} has been promoted to admin successfully!`
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