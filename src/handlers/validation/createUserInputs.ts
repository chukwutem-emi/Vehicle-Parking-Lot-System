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
 * Validates the user input for creating a new user. It checks the username, password, user address, email, and phone number against specific validation rules. If any of the inputs are invalid, it returns an object containing the status code and an error message. If all inputs are valid, it returns undefined.
 * @param username - The username input to be validated.
 * @param password - The password input to be validated.
 * @param userAddress - The address input to be validated.
 * @param email - The email input to be validated.
 * @param phone - The phone input to be validated.
 * @return An object containing the status code and an error message if any of the inputs are invalid, or undefined if all inputs are valid.
 * @example
 * const validationResult = createUserInputValidation("john_doe", "SecurePass123!", "123 Main St, City", "johndoe@example.com", "1234567890");
 * if (validationResult !== undefined) {
 *     console.error(validationResult.body);
 * }
 */
export const createUserInputValidation = (username: string, password: string, userAddress: string, email: string, phone: string): ValidationReturnStatement => {
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
                phoneInputError: `Invalid phone number. Phone number is required and it must be a valid phone number with a length of ${phoneInput.minimumLength} - ${phoneInput.maximumLength} digit numbers. Please ensure your phone number meets these requirements.`
            })
        };
    };
    return undefined;
};