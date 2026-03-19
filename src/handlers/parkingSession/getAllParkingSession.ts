import {userRole} from "../../models/user.js";
import { withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, ParkingSession, User } from "../../models/index.js";


const sequelize = initModels();
export const getAllParkingSessionHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        const limit = Number(event.queryStringParameters?.limit) || 1;
        const currentPage = Number(event.queryStringParameters?.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const sort = event.queryStringParameters?.sort || "createdAt";
        const vehicleTypeId = Number(event.queryStringParameters?.vehicleTypeId);

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
        if (user.userRole !== userRole.SUPER) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin users can perform this type of request. If you believe this is an error, please contact support." 
                })
            };
        };
        const where: any = {};

        if (vehicleTypeId) {
            where.vehicleTypeId = vehicleTypeId;
        };

        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [sort.substring(1), "DESC"];
            } else {
                order = [sort, "ASC"];
            };
        };
        const {count, rows} = await ParkingSession.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit,
            order: order
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Parking sessions retrieved successfully.",
                pagination: {
                    data: rows,
                    currentPage,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
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