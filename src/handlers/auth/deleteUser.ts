// Models
import {User, connectDB} from "../model/index.js";
import {userRole} from "../../models/user.js";
// LambdaAuth import
import {withAuth} from "../lambdaAuth.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";




export const deleteUserHandler = withAuth( async (event) => {
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
        const userId = Number(event.pathParameters?.userId);
        if (isNaN(userId)){
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid user ID."
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
        const getAdmin = await User.findByPk(currentUser);
        if (!getAdmin) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We could not find the current logged-in user."
                })
            };
        }
        if (!getAdmin.isAdmin && getAdmin.userRole !== userRole.SUPER) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized request. Only Super Admins can delete users."
                })
            };
        };
        const userInfo = await User.findByPk(userId);
        if (!userInfo) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User not found."
                })
            };
        };
        await userInfo.destroy();
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `${userInfo.username} has been deleted!.`
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