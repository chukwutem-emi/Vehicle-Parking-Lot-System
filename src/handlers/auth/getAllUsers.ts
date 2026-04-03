import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";



const sequelize = initModels();
export const getAllUsersHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        const limit = Number(event.queryStringParameters?.limit) || 100;
        const currentPage = Number(event.queryStringParameters?.currentPage) || 1;
        const sort = event.queryStringParameters?.sort || "createdAt";
        const role = event.queryStringParameters?.role;
        const offset = (currentPage - 1) * limit;

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
        if (getUser.userRole !== userRole.SUPER) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Super-Admin users can perform this type of request."
                })
            };
        };
        const where: any = {};

        if (role) {
            where.userRole = role;
        };

        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]];
            } else {
                order = [[sort, "ASC"]];
            };
        };
        const {count, rows} = await User.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit,
            order: order,
            attributes: ["id", "username", "user_address", "phone", "email", "user_role", "is_admin", "updated_by", "created_at", "updated_at"]
        });
        if (rows.length === 0) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    usersDetails: [],
                    pagination: {
                    currentPage,
                    limit,
                    total: 0,
                    totalPages: 0
                }
                })
            };
        };
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                data: rows,
                pagination: {
                    currentPage,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
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