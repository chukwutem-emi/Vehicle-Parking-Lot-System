import {updateVehicleTypeInputsValidation} from "../validation/updateVehicleTypeInputs.js";
import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels, VehicleType, User } from "../../models/index.js";



interface VehicleTypeAttribute {
    newHourlyRate: number;
    newVehicleName: string;
};


const sequelize = initModels();
export const updateVehicleTypeHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
    
        const body: VehicleTypeAttribute = JSON.parse(event.body || "{}");
        const {newHourlyRate, newVehicleName} = body;
    
        const requiredFields = ["newVehicleName", "newHourlyRate"];
        for (const field of requiredFields) {
            if (!(field in body)) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        success: false,
                        message: `Missing required field: ${field}`
                    })
                };
            }
        };
        const validationResult = updateVehicleTypeInputsValidation({newHourlyRate, newVehicleName});
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
                    success: false,
                    message: "Unauthorized. Please login."
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
                })
            };
        };
        const vehicleId = Number(event.pathParameters?.vehicleId);
        if (!vehicleId || isNaN(vehicleId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid input. Vehicle ID is required and it must be a valid number."
                })
            };
        }
        const vehicleDetails = await VehicleType.findByPk(vehicleId);
        if (!vehicleDetails) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Vehicle-type with the specified ID not found. Please ensure the vehicle ID is correct."
                })
            };
        };
        vehicleDetails.vehicleName = newVehicleName;
        vehicleDetails.hourlyRate  = newHourlyRate;
        vehicleDetails.updatedBy   = user.username;

        await vehicleDetails.save();

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Vehicle-type updated successfully.",
            })
         };
    } catch (err: unknown) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "Something went wrong!"
            })
        };
     };
});