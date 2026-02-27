;
/**
 * /.../ → Regular expression (regex) delimiters in javaScript.
 * \. → literal dot.
 * [] → means character class.
 * Full Explanation of "/^[\s@]+@[\s@]+\.[\s@]+$/".
 * ^ → Means match must begin at the start, so nothing before the email.
 * one or more non-space/non-@ characters
→ followed by @
→ followed by one or more non-space/non-@ characters
→ followed by .
→ followed by one or more non-space/non-@ characters.
$ → End of string, nothing is allowed after the email.
 */
export const validate = (validationInputs) => {
    let validInput = true;
    if (validationInputs.required) {
        validInput = validInput && validationInputs.value.toString().trim().length !== 0;
    }
    ;
    if (validationInputs.maximumLength != null && typeof validationInputs.value === "string") {
        validInput = validInput && validationInputs.value.length <= validationInputs.maximumLength;
    }
    ;
    if (validationInputs.minimumLength != null && typeof validationInputs.value === "string") {
        validInput = validInput && validationInputs.value.length >= validationInputs.minimumLength;
    }
    if (validationInputs.maxNumber != null && typeof validationInputs.value === "number") {
        validInput = validInput && validationInputs.value <= validationInputs.maxNumber;
    }
    ;
    if (validationInputs.minNumber != null && typeof validationInputs.value === "number") {
        validInput = validInput && validationInputs.value >= validationInputs.minNumber;
    }
    ;
    // email validation.
    if (validationInputs.isEmail && typeof validationInputs.value === "string") {
        const emailRegex = /^[\s@]+@[\s@]+\.[\s@]+$/;
        validInput = validInput && emailRegex.test(validationInputs.value.trim());
    }
    // phone number validation.
    if (validationInputs.isPhone && typeof validationInputs.value === "string") {
        const phoneRegex = /^\+?[0-9]{7-15}$/;
        validInput = validInput && phoneRegex.test(validationInputs.value);
    }
    // password validation.
    if (typeof validationInputs.value === "string") {
        if (validationInputs.passwordMinUppercase != null) {
            const passwordMinUpperCaseRegex = /[A-Z]g/;
            const count = (validationInputs.value.match(passwordMinUpperCaseRegex) || []).length;
            validInput = validInput && count >= validationInputs.passwordMinUppercase;
        }
        ;
        if (validationInputs.passwordMinDigitNumbers != null) {
            const passwordMinNumbersRegex = /[0-9]g/;
            const count = (validationInputs.value.match(passwordMinNumbersRegex) || []).length;
            validInput = validInput && count >= validationInputs.passwordMinDigitNumbers;
        }
        ;
        if (validationInputs.passwordMinSpecialCharacters != null) {
            const passwordMinSpecialCharactersRegex = /[^A-Za-z0-9]g/;
            const count = (validationInputs.value.match(passwordMinSpecialCharactersRegex) || []).length;
            validInput = validInput && count >= validationInputs.passwordMinSpecialCharacters;
        }
        ;
    }
    ;
    // Address validation
    if (validationInputs.addressMinHouseNumber != null && typeof validationInputs.value === "string") {
        const addressMinHouseNumberRegex = /[0-9]g/;
        const count = (validationInputs.value.match(addressMinHouseNumberRegex) || []).length;
        validInput = validInput && count >= validationInputs.addressMinHouseNumber;
    }
    ;
    return validInput;
};
