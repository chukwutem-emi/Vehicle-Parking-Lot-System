import * as validation from "../../src/utils/validation.js";
import {corsHeaders} from "../corsHeaders.js";

type Headers = {
    [header: string]: string
} | undefined;

type ValidationReturn = {
    statusCode : number;
    body       : string;
    headers    : Headers;
} | undefined;

/**
 * Validates the input for updating user details. It checks if the username, password, user address, phone number, and email are provided and meet the specified requirements. If any of the validations fail, it returns an object containing the status code and an error message. If all validations pass, it returns undefined.
 * @param username - The username of the user, which must be a string with a minimum length of 5 and a maximum length of 100 characters.
 * @param password - The password of the user, which must be a string with a minimum length of 10 and a maximum length of 50 characters. It must also contain at least 3 digit numbers, at least 3 special characters, and at least 3 uppercase letters.
 * @param userAddress - The address of the user, which must be a string with a minimum length of 10 and a maximum length of 200 characters. It must also contain a house number with at least 1 digit number.
 * @param phone - The phone number of the user, which must be a string with a minimum length of 7 and a maximum length of 15 characters. It must also be a valid phone number.
 * @param email - The email address of the user, which must be a string with a minimum length of 15 and a maximum length of 100 characters. It must also be a valid email address.
 * @returns An object containing the status code and an error message if any of the validations fail, or undefined if all validations pass.
 * @example
 * const validationResult = updateUserInputValidation("john_doe", "SecurePass123!", "123 Main St, City", "1234567890", "johndoe@example.com");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const updateUserInputValidation = (username: string, password: string, userAddress: string, phone: string, email: string): ValidationReturn => {

    const usernameInput: validation.ValidateAble = {
        value         : username,
        required      : true,
        maximumLength : 100,
        minimumLength : 5
    };
    if (!validation.validate(usernameInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                usernameInputError:`Invalid username. Username is required and the length must be: ${usernameInput.minimumLength} - ${usernameInput.maximumLength} characters. Please ensure your username meets these requirements.`
            })
        };
    };
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
                passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters. Please ensure your password meets these requirements.`
            })
        };
    };
    const userAddressInput: validation.ValidateAble = {
        value                 : userAddress,
        required              : true,
        maximumLength         : 200,
        minimumLength         : 10,
        addressMinHouseNumber : 1
    };
    if (!validation.validate(userAddressInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                userAddressInputError: `Invalid user address. User address is required and it must have a length of: ${userAddressInput.minimumLength} - ${userAddressInput.maximumLength} characters. It must also contain a house number with at least ${userAddressInput.addressMinHouseNumber} digit number. Please ensure your user address meets these requirements.`
            })
        };
    }
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
                emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. Please ensure your email address meets these requirements.`
            })
        };
    };
    const phoneInput: validation.ValidateAble = {
        value         : phone,
        required      : true,
        maximumLength : 15,
        minimumLength : 7,
        isPhone       : true
    }
    if (!validation.validate(phoneInput)) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                phoneInputError: `Invalid phone number. Phone number is required and it must be a valid phone number with a length of ${phoneInput.minimumLength} - ${phoneInput.maximumLength} digits. Please ensure your phone number meets these requirements.`
            })
        };
    };
    return undefined;
};