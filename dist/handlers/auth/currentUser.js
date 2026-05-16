import { withAuth } from "../lambdaAuth.js";
import { corsHeaders } from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";
import { getRedisClient } from "../../utils/redisClient.js";
import { rateLimiter } from "../../utils/rateLimiter.js";
const sequelize = initModels();
export const currentUserHandler = withAuth(async (event, _context) => {
    try {
        if (!sequelize)
            throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        }
        ;
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
        }
        ;
        const redis = await getRedisClient();
        const result = await rateLimiter({
            key: `rate_limit:${currentUser}`,
            limit: 3,
            windowInSeconds: 60
        });
        if (!result.success) {
            return {
                statusCode: 429,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: `Too many request. You have exceeded your request limit. Try again in ${result.retryAfter}seconds.`,
                    data: null
                })
            };
        }
        ;
        const cacheKey = `user:${currentUser}`;
        const cachedUser = await redis.get(cacheKey);
        if (cachedUser) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: `User retrieved from cache!. You have ${result.remaining} request left.`,
                    data: JSON.parse(cachedUser),
                })
            };
        }
        ;
        const getUserById = await User.findByPk(currentUser);
        if (!getUserById) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "User not found!. You may have been deleted by an admin. Please contact support for more information.",
                    data: null
                })
            };
        }
        ;
        if (getUserById.id !== currentUser) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden. You are not authorized to access this resource. You can only access your own user information.",
                    data: null
                })
            };
        }
        ;
        const user = getUserById.toJSON();
        const safeUser = {
            id: user.id,
            username: user.username,
            userAddress: user.userAddress,
            phone: user.phone,
            email: user.email,
            userRole: user.userRole,
            isAdmin: user.isAdmin,
            updatedBy: user.updatedBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        await redis.set(cacheKey, JSON.stringify(safeUser), {
            expiration: {
                type: "EX",
                value: 3600
            }
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "User retrieved successfully!",
                data: safeUser
            })
        };
    }
    catch (err) {
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
    }
    ;
});
