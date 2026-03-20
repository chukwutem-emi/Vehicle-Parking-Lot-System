import * as validation from "../../utils/validation.js";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;


interface ParkingSessionAttributes {
    slotId                       : number;
    vehicleId                    : number;
    vehicleNumber                : string;
    vehicleOwnerPhone            : string;
    vehicleOwnerAddress          : string;
    vehicleOwnerNextOfKin        : string;
    vehicleOwnerNextOfKinPhone   : string;
    vehicleOwnerNextOfKinAddress : string;
}

type ValidationReturnStatement = {
    statusCode  : number;
    body        : string;
    headers     : Headers;
} | undefined;

/**
 * This function validates the inputs for creating a parking session. It checks if the slot ID and vehicle ID are provided and are valid numbers, if the vehicle number is provided and meets the length requirements, if the vehicle owner's phone number is provided and is a valid phone number, if the vehicle owner's address is provided and meets the length requirements, if the vehicle owner's next of kin is provided and meets the length requirements, if the vehicle owner's next of kin's phone number is provided and is a valid phone number, and if the vehicle owner's next of kin's address is provided and meets the length requirements. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param slotId - The ID of the parking slot, which must be a number greater than or equal to 1.
 * @param vehicleId - The ID of the vehicle, which must be a number greater than or equal to 1.
 * @param vehicleNumber - The number of the vehicle, which must be a string between 3 and 100 characters long.
 * @param vehicleOwnerPhone - The phone number of the vehicle owner, which must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits.
 * @param vehicleOwnerAddress - The address of the vehicle owner, which must be a string with a minimum length of 10 and a maximum length of 200 characters, and must contain at least one digit number.
 * @param vehicleOwnerNextOfKin - The name of the vehicle owner's next of kin, which must be a string with a minimum length of 3 and a maximum length of 100 characters.
 * @param vehicleOwnerNextOfKinPhone - The phone number of the vehicle owner's next of kin, which must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits.
 * @param vehicleOwnerNextOfKinAddress - The address of the vehicle owner's next of kin, which must be a string with a minimum length of 10 and a maximum length of 200 characters, and must contain at least one digit number.
 * @return An object containing the status code and an error message if any of the validations fail, or undefined if all validations pass.
 * @example
 * const validationResult = createPSessionInputValidation({
 *    slotId                       : 1,
 *    vehicleId                    : 1,
 *    vehicleNumber                : "ABC123",
 *    vehicleOwnerPhone            : "1234567890",
 *    vehicleOwnerAddress          : "123 Main St, City, Country",
 *    vehicleOwnerNextOfKin        : "John Doe",
 *    vehicleOwnerNextOfKinPhone   : "0987654321",
 *    vehicleOwnerNextOfKinAddress : "456 ABC St, City, Country"
 * });
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const createPSessionInputValidation = ({slotId, vehicleId, vehicleNumber, vehicleOwnerPhone, vehicleOwnerAddress, vehicleOwnerNextOfKin, vehicleOwnerNextOfKinPhone, vehicleOwnerNextOfKinAddress}: ParkingSessionAttributes): ValidationReturnStatement => {
    const slotIdInput: validation.ValidateAble = {
        value     : Number(slotId),
        required  : true,
        minNumber : 1
    };
    if (!validation.validate(slotIdInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid slotId. It must be a positive integer greater than 0."
            })
         };
    }
    const vehicleIdInput: validation.ValidateAble = {
        value     : Number(vehicleId),
        required  : true,
        minNumber : 1
    };
    if (!validation.validate(vehicleIdInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleId. It must be a positive integer greater than 0."
            })
         };
    };
    const vehicleNumberInput: validation.ValidateAble = {
        value         : vehicleNumber,
        required      : true,
        maximumLength : 100,
        minimumLength : 3   
    };
    if (!validation.validate(vehicleNumberInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleNumber. It must be a string with a minimum length of 3 and a maximum length of 100 digits."
            })
         };
    };
    const vehicleOwnerPhoneInput: validation.ValidateAble = {
        value         : vehicleOwnerPhone,
        required      : true,
        isPhone       : true,
        maximumLength : 15,
        minimumLength : 7
    };
    if (!validation.validate(vehicleOwnerPhoneInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleOwnerPhone. It must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits."
            })
         };
    };
    const vehicleOwnerAddressInput: validation.ValidateAble = {
        value         : vehicleOwnerAddress,
        required      : true, 
        maximumLength : 200,
        minimumLength : 10,
        minNumber     : 1
    };
    if (!validation.validate(vehicleOwnerAddressInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleOwnerAddress. It must be a string with a minimum length of 10 and a maximum length of 200 characters. It must also contain at least one digit number."
            })
         };
    };
    const vehicleOwnerNextOfKinInput: validation.ValidateAble = {
        value         : vehicleOwnerNextOfKin,
        required      : true,
        maximumLength : 100,
        minimumLength : 10
    };
    if (!validation.validate(vehicleOwnerNextOfKinInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleOwnerNextOfKin. It must be a string with a minimum length of 3 and a maximum length of 100 characters."
            })
         };
    };
    const vehicleOwnerNextOfKinPhoneInput: validation.ValidateAble = {
        value         : vehicleOwnerNextOfKinPhone,
        required      : true,
        isPhone       : true,
        maximumLength : 15,
        minimumLength : 7
    };
    if (!validation.validate(vehicleOwnerNextOfKinPhoneInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleOwnerNextOfKinPhone. It must be a valid phone number with a minimum length of 7 and a maximum length of 15 digits."
            })
         };
    }; 
    const vehicleOwnerNextOfKinAddressInput: validation.ValidateAble = {
        value         : vehicleOwnerNextOfKinAddress,
        required      : true, 
        maximumLength : 200,
        minimumLength : 10,
        minNumber     : 1
    };
    if (!validation.validate(vehicleOwnerNextOfKinAddressInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Invalid vehicleOwnerNextOfKinAddress. It must be a string with a minimum length of 10 and a maximum length of 200 characters. It must also contain at least one digit number."
            })
         };
    };
    return undefined;
};