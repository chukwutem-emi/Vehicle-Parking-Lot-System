import {vehicleTypeInputsValidation} from "../validation/createVehicleTypeInput.js";
import {VehicleType, User} from "../model/index.js";
import {withAuth} from "../lambdaAuth.js"
import {corsHeaders} from "../corsHeaders.js";
import {userRole} from "../../models/user.js";
import { initModels } from "../../models/index.js";




interface VehicleTypeAttribute {
    vehicleName: string;
    hourlyRate : number;
};


const sequelize = initModels();
export const uploadVehicleTypeHandler = withAuth( async (event, _context) => {
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
    
        const {vehicleName, hourlyRate} = body;
    
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
        if (!getUser) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "We couldn't find the current logged-in user. Please ensure you are logged in."
                })
            };
        };
        if (getUser.userRole || ![userRole.ADMIN, userRole.SUPER].includes(getUser.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
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
                message: "Vehicle-type has been uploaded successfully.", details: createVehicleType
            })
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        };
    };
});