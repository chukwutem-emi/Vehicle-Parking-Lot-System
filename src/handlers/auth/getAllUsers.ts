// Models
import {User, connectDB} from "../model/index.js";
import {userRole} from "../../models/user.js";
// Auth Wrapper import
import {withAuth} from "../lambdaAuth.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";




export const getAllUsersHandler = withAuth( async (event) => {
    try {
        console.log("Connecting database......");
        await connectDB();
        console.log("Database connected!.");
        const limit = Number(event.queryStringParameters?.limit) || 1;
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
        const where: any = {};

        if (role) {
            where.userRole = role;
        };

        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [sort.substring(1), "DESC"];
            } else {
                order = [sort, "ASC"];
            };
        };
        const {count, rows} = await User.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit,
            order: order
        });
        if (rows.length === 0) {
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
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        };
    };
});