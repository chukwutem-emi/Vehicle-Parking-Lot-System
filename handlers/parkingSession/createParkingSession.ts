import {ParkingSession, ParkingSlot, VehicleType, connectDB, sequelize, User} from "../model/index.js";
import {userRole} from "../../src/models/user.js";
import {createPSessionInputValidation} from "../validation/createPSessionInput.js";
import {withAuth} from "../lambdaAuth.js";
import {corsHeaders} from "../corsHeaders.js";



interface ParkingSessionAttributes {
    slotId                       : number;
    vehicleId                    : number;
    vehicleNumber                : string;
    vehicleOwnerPhone            : string;
    vehicleOwnerAddress          : string;
    vehicleOwnerNextOfKin        : string;
    vehicleOwnerNextOfKinPhone   : string;
    vehicleOwnerNextOfKinAddress : string;
};



export const createParkingSessionHandler = withAuth(async (event) => {
    await connectDB();
    const t = await sequelize.transaction();
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: ParkingSessionAttributes = JSON.parse(event.body || "{}");
        const {slotId, vehicleId, vehicleNumber, vehicleOwnerPhone, vehicleOwnerAddress, vehicleOwnerNextOfKin, vehicleOwnerNextOfKinPhone, vehicleOwnerNextOfKinAddress} = body;

        const validationResult = createPSessionInputValidation({slotId, vehicleId, vehicleNumber, vehicleOwnerPhone, vehicleOwnerAddress, vehicleOwnerNextOfKin, vehicleOwnerNextOfKinPhone, vehicleOwnerNextOfKinAddress});

        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };


        const currentUser = event.userId;
        if (!currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "Unauthorized. Please login to access this resource."
                })
            };
        };
        const user = await User.findByPk(currentUser);
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "User not found. Please login to access this resource."
                })
            };
        };
        if (!user.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(user.userRole)) {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "Forbidden. You do not have permission to access this resource."
                })
            };
        };

        const slot = await ParkingSlot.findByPk(slotId, {transaction: t, lock: t.LOCK.UPDATE});
        if (!slot) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "Parking slot with the specified ID not found. Please ensure the slot ID is correct."
                })
            };
        }
        if (!slot.isAvailable || slot.availableCapacity <= 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "The parking slot you selected is currently unavailable. Please check back later."
                })
            };
        };
        if (slot.availableCapacity === 0) {
            slot.isAvailable = false;
        }
        slot.availableCapacity -= 1;

        const vehicle = await VehicleType.findByPk(vehicleId, {transaction: t, lock: t.LOCK.UPDATE});
        if (!vehicle) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    Message: "Vehicle type with the specified ID not found. Please ensure the vehicle ID is correct."
                })
            };
        };
        // check for existing session
        const checkExistingSession = await ParkingSession.findOne({
            where: {
                vehicleNumber: vehicleNumber,
                vehicleOwnerPhone: vehicleOwnerPhone,
                vehicleOwnerNextOfKinPhone: vehicleOwnerNextOfKinPhone
            },
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (checkExistingSession) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "A parking-session with the provided details already exists."
                })
            };
        };
        const parkingSession = await ParkingSession.create({
            slotId                       : slotId,
            vehicleTypeId                : vehicle.id,
            vehicleNumber                : vehicleNumber,
            vehicleOwnerPhone            : vehicleOwnerPhone,
            vehicleOwnerAddress          : vehicleOwnerAddress,
            vehicleOwnerNextOfKin        : vehicleOwnerNextOfKin,
            vehicleOwnerNextOfKinPhone   : vehicleOwnerNextOfKinPhone,
            vehicleOwnerNextOfKinAddress : vehicleOwnerNextOfKinAddress
        }, {transaction: t});

        await t.commit();
        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({
                Message: "Parking session created successfully.",
                ParkingSession: parkingSession
            })
        };
    } catch (err: any) { 
        await t.rollback();    
        console.error("Error creating parking session:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                Message: "Internal Server Error. Please try again later."
            })
        };
    }
});