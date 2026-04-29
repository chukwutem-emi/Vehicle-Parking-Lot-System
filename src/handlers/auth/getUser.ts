import { withAuth } from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";
import { userRole } from "../../models/user.js";



const sequelize = initModels();
export const getUserHandler = withAuth( async (event, _context) => {
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
        const getUserWithId = Number(event.queryStringParameters?.userId);
        if (!getUserWithId ||isNaN(getUserWithId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid user ID.",
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
        const currentUserData = await User.findByPk(currentUser);
        if (!currentUserData) {
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
        if (![userRole.ADMIN, userRole.SUPER].includes(currentUserData.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Access denied. You do not have permission to perform this action.",
                    data: null
                })
            };
        };
        const getUserById = await User.findByPk(getUserWithId);
        if (!getUserById) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "User not found!.",
                    data: null
                })
            };
        };
        const user = getUserById.toJSON();

        const safeUser = {
            id          : user.id,
            username    : user.username,
            userAddress : user.userAddress,
            phone       : user.phone,
            email       : user.email,
            userRole    : user.userRole,
            isAdmin     : user.isAdmin,
            updatedBy   : user.updatedBy,
            createdAt   : user.createdAt,
            updatedAt   : user.updatedAt
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "User retrieved successfully!",
                data: safeUser
            })
        };
    } catch (err: unknown) {
        console.error("ERROR:", err);
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