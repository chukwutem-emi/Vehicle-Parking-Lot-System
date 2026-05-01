import {initModels, Message, User, UserDevices} from "../../models/index.js";
import {userRole} from "../../models/user.js";
import {withAuth} from "../../handlers/lambdaAuth.js";
import { corsHeaders } from "../corsHeaders.js";



const sequelize = initModels();

const convertUTCToLocal = (utcDate: string | Date, timeZone="Africa/Lagos") => {
    return new Date(utcDate).toLocaleString("en-Us", {timeZone: timeZone, hour12: true});
};

export const getLoggedInUserDeviceHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const userId: number = Number(event.pathParameters?.userId);
        if (isNaN(userId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "User ID must be a number.",
                    data: null      
                })
            };
        };
        const currentUser = await User.findByPk(event.userId);
        if (currentUser === undefined || currentUser === null) {
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
        if (currentUser.userRole !== userRole.SUPER) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized request. Only Super Admins can retrieve logged-in user device.",
                    data: null
                })
            };
        }
        const loggedInUserDevice = await UserDevices.findByPk(userId);
        if (!loggedInUserDevice) {
            return {
                statusCode: 404,
                headers:corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Logged-in user device with the provided userID not found.",
                    data: null
                })
            };
        };
        const deviceWithLocalTime = {
            ...loggedInUserDevice.toJSON(),
            loginTime: loggedInUserDevice.loginTime ? convertUTCToLocal(loggedInUserDevice.loginTime) : null
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Logged-in user device retrieved successfully.",
                data: deviceWithLocalTime
            })
        };
    } catch (err: unknown) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "An unexpected error occurred.",
                data: null
            })
        }
    };
});

export  const getAllLoggedInUserDevices = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        const currentUser = await User.findByPk(event.userId);
        if (currentUser === undefined || currentUser === null) {
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
        if (currentUser.userRole !== userRole.SUPER) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized request. Only Super Admins can retrieve logged-in user devices.",
                    data: null
                })
            };
        };
        const loggedInUserDevices = await UserDevices.findAll();
        if (!loggedInUserDevices) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: "UserDevices database table is empty.",
                    data: []
                })
            };
        };
        const deviceWithLocalTime = loggedInUserDevices.map((device) => ({
            ...device.toJSON(),
            loginTime: device.loginTime ? convertUTCToLocal(device.loginTime) : null
        }));
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "UserDevices retrieved successfully.",
                data: deviceWithLocalTime
            })
        };
    } catch (err: unknown) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "An unexpected error occurred.",
                data: null
            })
        };
    }
});