import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js"; 
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";



const sequelize = initModels();
export const deleteUserHandler = withAuth( async (event, _context) => {
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
            }
        };
        const userId = Number(event.pathParameters?.userId);
        if (!userId || isNaN(userId)){
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid user ID."
                })
            };
        };
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
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
        if (getAdmin.userRole !== userRole.SUPER) {
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
        console.error("ERROR:", err)
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        };
    };
});