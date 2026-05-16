import * as validation from "../../utils/validation.js";
import { corsHeaders } from "../corsHeaders.js";
/***
 * This function validates the inputs for creating a parking slot. It checks if the slot code is provided and meets the length requirements, and if the vehicle type ID is provided and is a valid number. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param slotCode - The code for the parking slot, which must be a string between 3 and 10 characters long.
 * @param vehicleTypeId - The ID of the vehicle type, which must be a number greater than or equal to 1.
 * @returns An object with status code and error message if validation fails, or undefined if validation passes.
 * @example
 * const validationResult = createParkingSlotInputsValidation("A1", 2);
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const createParkingSlotInputsValidation = (slotCode, vehicleTypeId) => {
    const slotCodeInput = {
        value: slotCode,
        required: true,
        maximumLength: 10,
        minimumLength: 3
    };
    if (!validation.validate(slotCodeInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Invalid Input. Slot-code is required and it must contain at least: ${slotCodeInput.minimumLength} - ${slotCodeInput.maximumLength} length of characters. Please ensure your slot-code meets these requirements.`
            })
        };
    }
    const vehicleTypeIdInput = {
        value: Number(vehicleTypeId),
        required: true,
        minNumber: 1
    };
    if (!validation.validate(vehicleTypeIdInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Invalid Input. Vehicle-type ID is required and it must be a number greater than or equal to: ${vehicleTypeIdInput.minNumber}. Please ensure your vehicle-type ID meets these requirements.`
            })
        };
    }
    ;
    return undefined;
};
