// utils
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
 * Validates the input for the reset password functionality.
 * @param email - The email address of the user.
 * @returns An object containing the status code and an error message if the validation fails, or undefined if the validation passes.
 * @example
 * const validationResult = resetPasswordInputValidation("user@example.com");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */

export const resetPasswordInputValidation = (email: string): ValidationReturnStatement => {
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
                emailInputErr: `Invalid email address. Email address is required and it must have a length of: ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. It must also follow this pattern: Your email-username@domain-name.top-domain-name. For example: example@gmail.com, example@test.org, e.t.c.`
            })
        };
    };
};

/**
 * Validates the input for the update password functionality.
 * @param password - The new password for the user.
 * @returns A validation result object or undefined if valid.
 * @example
 * const validationResult = updatePasswordInputValidation("NewP@ssw0rd123");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const updatePasswordInputValidation = (password: string): ValidationReturnStatement => {
    const passwordInput: validation.ValidateAble = {
        value                        : password,
        required                     : true,
        maximumLength                : 50,
        minimumLength                : 10,
        passwordMinDigitNumbers      : 3,
        passwordMinSpecialCharacters : 3,
        passwordMinUppercase         : 3
    };
    if (!validation.validate(passwordInput)){
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters.`
            })
        };
    };
    return undefined;
};