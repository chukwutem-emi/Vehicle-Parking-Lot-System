import * as validation from "../../utils/validation.js";
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
 * Validates the input for the login functionality.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns An object containing the status code and an error message if the validation fails, or undefined if the validation passes.
 * @example
 * const validationResult = loginInputValidation("user@example.com", "SecurePass123!");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const loginInputValidation = (email: string, password: string): ValidationReturnStatement => {
    const passwordInput: validation.ValidateAble = {
        value                        : password,
        required                     : true,
        maximumLength                : 50,
        minimumLength                : 10,
        passwordMinDigitNumbers      : 3,
        passwordMinSpecialCharacters : 3,
        passwordMinUppercase         : 3
    };
    if (!validation.validate(passwordInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters.`
            })
        };
    };
    const emailInput: validation.ValidateAble = {
        value         : email,
        required      : true,
        maximumLength : 100,
        minimumLength : 15,
        isEmail       : true
    };
    if (!validation.validate(emailInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters.`
            })
        };
    };
    return undefined;
};