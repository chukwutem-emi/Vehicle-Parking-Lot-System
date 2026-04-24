import {userRole} from "../../models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import {updateParkingSlotInputsValidation} from "../validation/updateParkingSlotInput.js";
import { initModels, ParkingSlot, User } from "../../models/index.js";



interface ParkingSlotAttributes {
    maximumCapacity   : number;
    availableCapacity : number;
    slotCode          : string;
};



const sequelize = initModels();
export const updateParkingSlotHandler = withAuth( async (event, _context) => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: ParkingSlotAttributes = JSON.parse(event.body || "{}");
        const {maximumCapacity, availableCapacity, slotCode} =  body;

        const requiredFields = ["maximumCapacity", "availableCapacity", "slotCode"];

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
    
        const validationResult = updateParkingSlotInputsValidation({maximumCapacity, availableCapacity, slotCode});
        if (validationResult !== undefined) {
            return {
                statusCode : validationResult.statusCode,
                body       : validationResult.body,
                headers    : validationResult.headers
            };
        }
    
        const vehicleTypeId: number = Number(event.pathParameters?.vehicleTypeId);
        if (isNaN(vehicleTypeId) || vehicleTypeId <= 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid vehicleTypeId. It must be a positive integer."
                })
            };
        };
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized. Please log in to access this resource."
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
                    message: "We could not find the current logged-in user."
                })
            };
        };
        if (![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Forbidden request. Only Admin or Super-Admin users can perform this type of request."
                })
            };
        };
        const parkingSlot = await ParkingSlot.findOne({where: {vehicleTypeId}});
        if (!parkingSlot) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Parking slot with the specified vehicleTypeId not found."
                })
            };
        };
        await parkingSlot.update({
            maximumCapacity: maximumCapacity,
            availableCapacity: availableCapacity,
            slotCode: slotCode,
            updatedBy: user.username
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Parking slot updated successfully."
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