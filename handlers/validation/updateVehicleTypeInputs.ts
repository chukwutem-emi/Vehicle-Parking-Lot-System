import * as validation from "../../src/utils/validation.js";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;


type ValidationReturnStatement = {
    statusCode : number;
    body       : string;
    headers    : Headers;
} | undefined;

interface VehicleTypeAttributes {
    newVehicleName : string;
    newHourlyRate  : number;
};

/**
 * Validates the inputs for updating a vehicle type. It checks if the new vehicle name is provided and meets the length requirements, and if the new hourly rate is provided and is a valid number within the specified range. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param newVehicleName - The new name of the vehicle type, which must be a string with a minimum length of 2 and a maximum length of 100 characters.
 * @param newHourlyRate - The new hourly rate of the vehicle type, which must be a number between 4 and 10.
 * @returns An object containing the status code and an error message if any of the validations fail, or undefined if all validations pass.
 * @example
 * const validationResult = updateVehicleTypeInputsValidation({ newVehicleName: "SUV", newHourlyRate: 6 });
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const updateVehicleTypeInputsValidation = ({newHourlyRate, newVehicleName}: VehicleTypeAttributes): ValidationReturnStatement => {
    const vehicleNameInput: validation.ValidateAble = {
        value         : newVehicleName,
        required      : true,
        maximumLength : 100,
        minimumLength : 2
    };
    if (!validation.validate(vehicleNameInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Invalid input. Vehicle name is required and the length must be: ${vehicleNameInput.minimumLength} - ${vehicleNameInput.maximumLength} characters. Please ensure your vehicle name meets these requirements.`
            })
        };
    };
    const hourlyRateInput: validation.ValidateAble = {
        value     : newHourlyRate,
        required  : true,
        maxNumber : 10,
        minNumber : 4
    };
    if (!validation.validate(hourlyRateInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Invalid input. Hourly rate is required and it must be a number between: ${hourlyRateInput.minNumber} - ${hourlyRateInput.maxNumber}. Please ensure your hourly rate meets these requirements.`
            })
        };
    };
    return undefined;
};