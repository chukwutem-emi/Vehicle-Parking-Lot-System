import {userRole} from "../../models/user.js";
import {Op} from "sequelize";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, ParkingSlot, User } from "../../models/index.js";



const sequelize = initModels();
export const getAvailableSlotHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        const limit = Number(event.queryStringParameters?.limit) || 100;
        const currentPage = Number(event.queryStringParameters?.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const sort = event.queryStringParameters?.sort || "createdAt";
        const vehicleTypeId = Number(event.queryStringParameters?.vehicleTypeId)
       
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
                    success: false,
                    message: "Unauthorized request. Please ensure you are logged in.",
                    data: null
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "We couldn't find the current logged-In user. Please ensure you are logged in.",
                    data: null
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request.",
                    data: null
                })
            };
        };

        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]]
            } else {
                order = [[sort, "ASC"]];
            };
        };
        const whereClause: any = {
            isAvailable: true,
            availableCapacity: {
                [Op.gt]: 0 
            }
        };
        if (vehicleTypeId) {
            whereClause.vehicleTypeId = vehicleTypeId;
        };
        const {count, rows} = await ParkingSlot.findAndCountAll({
            where: whereClause,
            offset: offset,
            order: order,
            limit: limit
        });
        if (!rows || rows.length === 0) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: "No available parking slots at the moment.",
                    data: []
                })
            };
        };
        return {
            statusCode: 200, 
            headers: corsHeaders,  
            body: JSON.stringify({
                success: true,
                message: "Parking slots retrieved successfully!",
                data: rows,
                pagination: {
                    currentPage,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            })
        };
    } catch (err: unknown) {
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