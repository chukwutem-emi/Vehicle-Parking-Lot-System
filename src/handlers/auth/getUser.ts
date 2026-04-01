import { withAuth } from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";



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
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
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
                userDetails: safeUser
            })
        };
    } catch (err: any) {
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        };
    };
});