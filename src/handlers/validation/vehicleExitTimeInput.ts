import * as validation from "../../utils/validation.js";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;


interface ParkingSessionAttributes {
    vehicleNumber : string;
    vehicleName   : string;
};

type ValidationReturnStatement = {
    statusCode : number;
    body       : string;
    headers    : Headers;  
} | undefined;

/**
 * Validates the inputs for exiting a vehicle from the parking lot. It checks if the vehicle number and vehicle name are provided and meet the specified requirements. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param vehicleNumber - The number of the vehicle exiting, which must be a string with a minimum length of 3 and a maximum length of 100 characters.
 * @param vehicleName - The name of the vehicle exiting, which must be a string with a minimum length of 3 and a maximum length of 100 characters.
 * @returns An object containing the status code and an error message if any of the validations fail, or undefined if all validations pass.
 * @example
 * const validationResult = vehicleExitTimeInputValidation({ vehicleNumber: "ABC123", vehicleName: "SUV" });
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const vehicleExitTimeInputValidation = ({vehicleNumber, vehicleName}: ParkingSessionAttributes): ValidationReturnStatement => {
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
                success: false,
                message: "Invalid vehicleNumber. It must be a string with a minimum length of 3 and a maximum length of 100 characters."
            })
        };
    };
    const vehicleNameInput: validation.ValidateAble = {
        value         : vehicleName,        
        required      : true,
        maximumLength : 100,
        minimumLength : 3
    };
    if (!validation.validate(vehicleNameInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: "Invalid vehicleName. It must be a string with a minimum length of 3 and a maximum length of 100 characters."
            })
        };
    };
    return undefined;
};