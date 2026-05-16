import * as validation from "../../utils/validation.js";
import { corsHeaders } from "../corsHeaders.js";
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
export const fetchVehicleTypeInputValidation = (vehicleName) => {
    const vehicleNameInput = {
        value: vehicleName,
        required: true,
        maximumLength: 100,
        minimumLength: 2
    };
    if (!validation.validate(vehicleNameInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Invalid input. Vehicle name is required and it must have a minimum of: ${vehicleNameInput.minimumLength} and a maximum of: ${vehicleNameInput.maximumLength} characters length.`
            })
        };
    }
    ;
    return undefined;
};
