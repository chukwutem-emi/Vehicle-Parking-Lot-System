import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";
import { getRedisClient } from "../../utils/redisClient.js";
import { rateLimiter } from "../../utils/rateLimiter.js";



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
                    success: false,
                    message: "You haven't authenticated yet. Please login.",
                    data: null
                })
            };
        };
        const getUser = await User.findByPk(currentUser);
        if (!getUser) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "We could not find the current logged-in user. Please ensure you are logged in.",
                    data: null
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(getUser.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only admin users can perform this type of request.",
                    data: null
                })
            };
        };
        const where: any = {};

        if (role) {
            if (role === "SUPER-ADMIN") {
                where.userRole = "SUPER-ADMIN";
            } else if (role === "REGULAR-USER") {
                where.userRole = "REGULAR-USER"
            } else if (role === "ADMIN") {
                where.userRole = "ADMIN"
            }
        };

        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]];
            } else {
                order = [[sort, "ASC"]];
            };
        };
        const redis = await getRedisClient();

        const result = await rateLimiter({
            key             : `fetch_users_rate_limit:${currentUser}`,
            limit           : 4,
            windowInSeconds : 60
        });

        if (!result.success) {
            return {
                statusCode: 429,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: `Too many request. You have exceeded the request limit. Try again in ${result.retryAfter}seconds.`,
                    data: null
                })
            };
        };
        const cacheKey = `users:all:${limit}:${currentPage}:${sort}:${role ?? "all"}`;
        const cachedUsers = await redis.get(cacheKey);

        if (cachedUsers) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: `Users fetched from cache!. You have ${result.remaining} request left.`,
                    ...JSON.parse(cachedUsers)
                })
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
                    success: true,
                    message: "No users found!",
                    data: [],
                    pagination: {
                    currentPage,
                    limit,
                    total: 0,
                    totalPages: 0
                }
                })
            };
        };
        
        const response = {
            data: rows,
            pagination: {
                currentPage,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };

        await redis.set(cacheKey, JSON.stringify(response), {
            expiration: {
                type: "EX",
                value: 300
            }
        })
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Users fetched successfully!",
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
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "Something went wrong",
                data: null
            })
        };
    };
});