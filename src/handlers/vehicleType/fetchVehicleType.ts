import {fetchVehicleTypeInputValidation} from "../validation/fetchVehicleTypeInput.js";
import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels, VehicleType, User } from "../../models/index.js";


interface VehicleTypeAttribute {
    vehicleName: string;
};

const sequelize = initModels();
export const fetchVehicleTypeHandler = withAuth( async (event, _context) => {
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
        
        const body: VehicleTypeAttribute = JSON.parse(event.body || "{}");
        const {vehicleName} = body;
    
        const validationResult = fetchVehicleTypeInputValidation(vehicleName);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
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
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
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
                    message: "That typeof vehicle is not allowed here. Please ensure you have entered a valid vehicle type."
                })
            };
            
        }
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({vehicleDetails: vehicleDetails})
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