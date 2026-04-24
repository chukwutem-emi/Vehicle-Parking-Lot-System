import * as validation from "../../utils/validation.js";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;


interface ParkingSlotAttributes {
    slotCode          : string;
    maximumCapacity   : number;
    availableCapacity : number;
};


type ValidationReturnStatement = {
    statusCode : number;
    body       : string;
    headers    : Headers;
} | undefined;
/**
 * Validates the input for updating a parking slot. It checks if the slot code is provided and meets the length requirements, and if the maximum capacity and available capacity are provided and are valid numbers within the specified range. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param slotCode - The code of the parking slot to update.
 * @param maximumCapacity - The maximum capacity of the parking slot.
 * @param availableCapacity - The available capacity of the parking slot.
 * @returns An object containing the status code and an error message if the validation fails, or undefined if the validation passes.
 * @example
 * const validationResult = updateParkingSlotInputsValidation({ slotCode: "A1", maximumCapacity: 50, availableCapacity: 20 });
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const updateParkingSlotInputsValidation = ({slotCode, maximumCapacity, availableCapacity}: ParkingSlotAttributes): ValidationReturnStatement => {
    const slotCodeInput: validation.ValidateAble = {
        value         : slotCode,
        required      : true,
        maximumLength : 10,
        minimumLength : 3
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
    const maximumCapacityInput: validation.ValidateAble = {
        value     : Number(maximumCapacity),
        required  : true,
        minNumber : 1,
        maxNumber : 1000000
    };
    if (!validation.validate(maximumCapacityInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Invalid Input. Maximum capacity is required and it must be a number between: ${maximumCapacityInput.minNumber} - ${maximumCapacityInput.maxNumber}. Please ensure your maximum capacity meets these requirements.`
            })
        };
    }
    const availableCapacityInput: validation.ValidateAble = {
        value     : Number(availableCapacity),
        required  : true,
        minNumber : 1,
        maxNumber : 1000000
    };
    if (!validation.validate(availableCapacityInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Invalid Input. Available capacity is required and it must be a number between: ${availableCapacityInput.minNumber} - ${availableCapacityInput.maxNumber}. Please ensure your available capacity meets these requirements.`
            })
        };
    };
    return undefined;
};