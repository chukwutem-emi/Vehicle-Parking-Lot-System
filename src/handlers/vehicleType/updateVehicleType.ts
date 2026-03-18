import {updateVehicleTypeInputsValidation} from "../validation/updateVehicleTypeInputs.js";
import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels, VehicleType, User } from "../../models/index.js";



interface VehicleTypeAttribute {
    newHourlyRate: number;
    newVehicleName: string;
};


export const updateVehicleTypeHandler = withAuth( async (event, _context) => {
    const sequelize = initModels();
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
        const {newHourlyRate, newVehicleName} = body;
    
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
        if (!user) {
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
                body: JSON.stringify({
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
                })
            };
        };
        const vehicleId = Number(event.pathParameters?.vehicleId);
        if (isNaN(vehicleId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
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
            body: JSON.stringify({message: "Vehicle-type updated successfully.", details: vehicleDetails})
         };
    } catch (err: any) {
        console.error("Error:", err)
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "An error occurred while updating the vehicle type. Please try again later.",
            })
        };
     };
});