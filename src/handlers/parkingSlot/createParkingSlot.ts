import {createParkingSlotInputsValidation} from "../validation/createParkingSlotInputs.js";
import {withAuth} from "../lambdaAuth.js";
import {userRole} from "../../models/user.js";
import { corsHeaders } from "../corsHeaders.js";
import {initModels, ParkingSlot, User} from "../../models/index.js";


interface ParkingSlotAttributes {
    slotCode      : string;
    vehicleTypeId : number;
};



const sequelize = initModels();
export const createParkingSlotHandler = withAuth( async (event, _context) => {
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
        const body: ParkingSlotAttributes = JSON.parse(event.body || "{}");
        const { slotCode, vehicleTypeId } = body;
    
        const validationResult = createParkingSlotInputsValidation(slotCode, vehicleTypeId);
        if (validationResult !== undefined) {
            return {
                body: validationResult.body,
                statusCode: validationResult.statusCode,
                headers: validationResult.headers
            };
        }
    
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized request. Please log in to access this resource."
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Current user not found."
                })
            };
        };
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Forbidden request. You do not have permission to create parking slots. Please contact your administrator if you think you should have access to this resource."
                })
            };
        };
        const existingSlotCode = await ParkingSlot.findOne({
            where: {
                slotCode: slotCode
            }
        });
        if (existingSlotCode) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "A parking slot with the same code already exists."
                })
            };
        };
        await ParkingSlot.create({
            slotCode: slotCode,
            vehicleTypeId: vehicleTypeId
        });
        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Parking slot created successfully."
            })      
        };  
    } catch (err: any) {
        console.error("Error creating parking slot:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        };
    }       
});