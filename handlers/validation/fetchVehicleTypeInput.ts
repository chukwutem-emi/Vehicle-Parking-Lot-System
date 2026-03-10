import * as validation from "../../src/utils/validation";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;


type ValidationReturnStatement = {
    statusCode : number;
    body       : string;
    headers    : Headers;
} | undefined;

/**
 * Validates the input for fetching a vehicle type by its name.
 * @param vehicleName - The name of the vehicle type to fetch.
 * @returns An object containing the status code and an error message if the validation fails, or undefined if the validation passes.
 * @example
 * const validationResult = fetchVehicleTypeInputValidation("SUV");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const fetchVehicleTypeInputValidation = (vehicleName: string): ValidationReturnStatement => {
    const vehicleNameInput: validation.ValidateAble = {
        value         : vehicleName,
        required      : true,
        maximumLength : 100,
        minimumLength : 2
    };
    if (!validation.validate(vehicleNameInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Invalid input. Vehicle name is required and it must have a minimum of: ${vehicleNameInput.minimumLength} and a maximum of: ${vehicleNameInput.maximumLength} characters length.`
            })
        };
    };
    return undefined;
};