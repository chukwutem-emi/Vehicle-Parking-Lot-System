// utils
import * as validation from "../utils/validation.js";
export const resetPasswordInputValidation = (email) => {
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
                emailInputErr: `Invalid email address. Email address is required and it must have a length of: ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. It must also follow this pattern: Your email-username@domain-name.top-domain-name. For example: example@gmail.com, example@test.org, e.t.c.`
            })
        };
    }
    ;
};
export const updatePasswordInputValidation = (password) => {
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
                passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters.`
            })
        };
    }
    ;
};
