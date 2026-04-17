import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels, VehicleType, User } from "../../models/index.js";



const sequelize = initModels();
export const fetchVehicleTypeHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        
        const vehicleName = event.queryStringParameters?.vehicleName
    
        const currentUser = event.userId;
        const user = await User.findByPk(currentUser);
        if (user === undefined || user === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized. Please login."
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
                })
            };
        };
        const vehicleDetails = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            }
        });
        if (!vehicleDetails) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "That type of vehicle is not allowed here. Please ensure you have entered a valid vehicle type."
                })
            };
            
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({vehicleDetails: vehicleDetails.toJSON()})
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