// Model
import { User } from "../../models/user.js";
// Utils
import * as validation from "../../utils/validation.js";
// Third-party module
import bcrypt from "bcryptjs";
export const createUser = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const userAddress = req.body.userAddress;
    const email = req.body.email;
    const phone = req.body.phone;
    const confirmPassword = req.body.confirmPassword;
    try {
        if (confirmPassword !== password) {
            return res.status(400).json({ confirmPasswordErr: "Password and confirm password do not match. Please ensure both passwords are the same." });
        }
        ;
        const usernameInput = {
            value: username,
            required: true,
            maximumLength: 100,
            minimumLength: 5
        };
        if (!validation.validate(usernameInput)) {
            return res.status(400).json({ usernameInputError: `Invalid username. Username is required and the length must be: ${usernameInput.minimumLength} - ${usernameInput.maximumLength} characters. Please ensure your username meets these requirements.` });
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
            return res.status(400).json({ passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters. Please ensure your password meets these requirements.` });
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
            return res.status(400).json({ userAddressInputError: `Invalid user address. User address is required and it must have a length of: ${userAddressInput.minimumLength} - ${userAddressInput.maximumLength} characters. It must also contain a house number with at least ${userAddressInput.addressMinHouseNumber} digit number. Please ensure your user address meets these requirements.` });
        }
        const emailInput = {
            value: email,
            required: true,
            maximumLength: 100,
            minimumLength: 15,
            isEmail: true
        };
        if (!validation.validate(emailInput)) {
            return res.status(400).json({ emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. Please ensure your email address meets these requirements.` });
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
            return res.status(400).json({ phoneInputError: `Invalid phone number. Phone number is required and it must be a valid phone number with a length of ${phoneInput.minimumLength} - ${phoneInput.maximumLength} characters. Please ensure your phone number meets these requirements.` });
        }
        ;
        // check if email already exist.
        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (checkEmail) {
            return res.status(400).json({ existingEmailErr: "A user with this email address already exists. Please use a different email address." });
        }
        ;
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            username: username,
            password: hashedPassword,
            userAddress: userAddress,
            phone: phone,
            email: email
        });
        return res.status(201).json({ message: "User created successfully!" });
    }
    catch (err) {
        next(err);
    }
    ;
};
