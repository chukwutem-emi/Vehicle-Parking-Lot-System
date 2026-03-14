import {User, connectDB, ParkingSlot} from "../model/index.js";
import {userRole} from "../../models/user.js";
import {Op} from "sequelize";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";



export const getAvailableSlotHandler = withAuth( async (event) => {
    await connectDB();
    try {
        const limit = Number(event.queryStringParameters?.limit) || 1;
        const currentPage = Number(event.queryStringParameters?.currentPage) || 1;
        const offset = (currentPage - 1) * limit;
        const sort = event.queryStringParameters?.sort || "createdAt";
        const vehicleTypeId = Number(event.queryStringParameters?.limit)
       
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
                    message: "Unauthorized request. Please ensure you are logged in."
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We couldn't find the current logged-In user. Please ensure you are logged in."
                })
            };
        };
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
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
                order = [sort.substring(1), "DESC"]
            } else {
                order = [sort, "ASC"];
            };
        };
        const {count, rows} = await ParkingSlot.findAndCountAll({
            where: {
                isAvailable: true,
                availableCapacity: {
                  [Op.gt]: 0 
                }
            }
        });
        if (!rows || rows.length === 0) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "No available parking slots at the moment."
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
        console.error("Error fetching available parking slots:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. An error occurred while fetching available parking slots. Please try again later."
            })
        };
    };
});