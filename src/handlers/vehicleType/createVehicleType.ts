import {vehicleTypeInputsValidation} from "../validation/createVehicleTypeInput.js";
import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels, VehicleType, User } from "../../models/index.js";




interface VehicleTypeAttribute {
    vehicleName: string;
    hourlyRate : number;
};


const sequelize = initModels();
export const uploadVehicleTypeHandler = withAuth( async (event, _context) => {
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
    
        const {vehicleName, hourlyRate} = body;
        
        const requiredFields = ["vehicleName", "hourlyRate"];

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
            };
        };
    
        const validationResult = vehicleTypeInputsValidation({vehicleName: vehicleName, hourlyRate: hourlyRate});
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
    
        const currentUser = event.userId;
        const getUser = await User.findByPk(currentUser);
        if (getUser === undefined || getUser === null) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in."
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(getUser.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
                })
            };
        };
        // check if vehicleType already exist.
        const checkExistingVehicleType = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            }
        });
        if (checkExistingVehicleType) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "A Vehicle-type with the same name already exists."
                })
            };
        };
        const createVehicleType = await VehicleType.create({
            vehicleName : vehicleName,
            hourlyRate  : hourlyRate
        });
        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Vehicle-type has been uploaded successfully."
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