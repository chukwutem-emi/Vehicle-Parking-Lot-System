import {User, connectDB, ParkingSlot} from "../model/index.js";
import {userRole} from "../../src/models/user.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";
import {updateParkingSlotInputsValidation} from "../validation/updateParkingSlotInput.js";



interface ParkingSlotAttributes {
    maximumCapacity   : number;
    availableCapacity : number;
    slotCode          : string;
};




export const updateParkingSlotHandler = withAuth( async (event) => {
    await connectDB();
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: ParkingSlotAttributes = JSON.parse(event.body || "{}");
        const {maximumCapacity, availableCapacity, slotCode} =  body;
    
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
                    message: "Invalid vehicleTypeId. It must be a positive integer."
                })
            };
        };
        const currentUser = event.userId;
        if (!currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
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
                    message: "We could not find the current logged-in user."
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
        const parkingSlot = await ParkingSlot.findOne({where: {vehicleTypeId}});
        if (!parkingSlot) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
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
                message: "Parking slot updated successfully."
            })
        };
    } catch (err: any) {
        console.error("Error updating parking slot:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal server error. Please try again later."
            })
        };
    };
});