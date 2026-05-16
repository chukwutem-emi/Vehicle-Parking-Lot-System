import * as validation from "../utils/validation.js";
export const createUserInputValidation = (username, password, userAddress, email, phone) => {
    const usernameInput = {
        value: username,
        required: true,
        maximumLength: 100,
        minimumLength: 5
    };
    if (!validation.validate(usernameInput)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                usernameInputError: `Invalid username. Username is required and the length must be: ${usernameInput.minimumLength} - ${usernameInput.maximumLength} characters. Please ensure your username meets these requirements.`
            })
        };
    }
    ;
    const passwordInput = {
        value: password,
        required: true,
        maximumLength: 50,
        minimumLength: 10,
        passwordMinDigitNumbers: 3,
        passwordMinSpecialCharacters: 3,
        passwordMinUppercase: 3
    };
    if (!validation.validate(passwordInput)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters. Please ensure your password meets these requirements.`
            })
        };
    }
    ;
    const userAddressInput = {
        value: userAddress,
        required: true,
        maximumLength: 200,
        minimumLength: 10,
        addressMinHouseNumber: 1
    };
    if (!validation.validate(userAddressInput)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                userAddressInputError: `Invalid user address. User address is required and it must have a length of: ${userAddressInput.minimumLength} - ${userAddressInput.maximumLength} characters. It must also contain a house number with at least ${userAddressInput.addressMinHouseNumber} digit number. Please ensure your user address meets these requirements.`
            })
        };
    }
    const emailInput = {
        value: email,
        required: true,
        maximumLength: 100,
        minimumLength: 15,
        isEmail: true
    };
    if (!validation.validate(emailInput)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. Please ensure your email address meets these requirements.`
            })
        };
    }
    ;
    const phoneInput = {
        value: phone,
        required: true,
        maximumLength: 15,
        minimumLength: 7,
        isPhone: true
    };
    if (!validation.validate(phoneInput)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                phoneInputError: `Invalid phone number. Phone number is required and it must be a valid phone number with a length of ${phoneInput.minimumLength} - ${phoneInput.maximumLength} digit numbers. Please ensure your phone number meets these requirements.`
            })
        };
    }
    ;
};
