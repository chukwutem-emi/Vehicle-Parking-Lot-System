// Express types
import type{Request, Response, NextFunction} from "express";
// Models
import {User} from "../../models/user.js";
//  Utils
import * as validation from "../../utils/validation.js";
import {sendMail} from "../../utils/send-mail.js";


export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    const username        : string = req.body.username;
    const password        : string = req.body.password;
    const userAddress     : string = req.body.userAddress;
    const phone           : string = req.body.phone;
    const email           : string = req.body.email;
    const confirmPassword : string = req.body.confirmPassword;
    const userId          : number = Number(req.params.userId);
    const currentUser              = req.userId;

    try {
        if (confirmPassword !== password) {
            return res.status(400).json({confirmPasswordErr: "Password and confirm password do not match. Please ensure both passwords are the same."});
        };
        const usernameInput: validation.ValidateAble = {
            value         : username,
            required      : true,
            maximumLength : 100,
            minimumLength : 5
        };
        if (!validation.validate(usernameInput)) {
            return res.status(400).json({usernameInputError:`Invalid username. Username is required and the length must be: ${usernameInput.minimumLength} - ${usernameInput.maximumLength} characters. Please ensure your username meets these requirements.`});
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
            return res.status(400).json({passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters. Please ensure your password meets these requirements.`});
        };
        const userAddressInput: validation.ValidateAble = {
            value                 : userAddress,
            required              : true,
            maximumLength         : 200,
            minimumLength         : 10,
            addressMinHouseNumber : 1
        };
        if (!validation.validate(userAddressInput)) {
            return res.status(400).json({userAddressInputError: `Invalid user address. User address is required and it must have a length of: ${userAddressInput.minimumLength} - ${userAddressInput.maximumLength} characters. It must also contain a house number with at least ${userAddressInput.addressMinHouseNumber} digit number. Please ensure your user address meets these requirements.`});
        }
        const emailInput: validation.ValidateAble = {
            value         : email,
            required      : true,
            maximumLength : 100,
            minimumLength : 15,
            isEmail       : true
        };
        if (!validation.validate(emailInput)) {
            return res.status(400).json({emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. Please ensure your email address meets these requirements.`});
        };
        const phoneInput: validation.ValidateAble = {
            value         : phone,
            required      : true,
            maximumLength : 15,
            minimumLength : 7,
            isPhone       : true
        }
        if (!validation.validate(phoneInput)) {
            return res.status(400).json({phoneInputError: `Invalid phone number. Phone number is required and it must be a valid phone number with a length of ${phoneInput.minimumLength} - ${phoneInput.maximumLength} digits. Please ensure your phone number meets these requirements.`});
        };
        if (isNaN(userId)) {
            return res.status(400).json({message: "Invalid userId. UserId must be a number."});
        };
        const getUserInfo = await User.findByPk(userId);
        if (!getUserInfo) {
            return res.status(404).json({message: "User with the specified userId not found. Please ensure you have the correct userId."});
        }
        if (getUserInfo.id !== currentUser) {
            return res.status(401).json({message: "Unauthorized request. You can only update your own user details."});
        }
        getUserInfo.email       = email;
        getUserInfo.username    = username;
        getUserInfo.password    = password;
        getUserInfo.userAddress = userAddress;
        getUserInfo.phone       = phone;
        getUserInfo.updatedBy   = getUserInfo.username;
        await getUserInfo.save();
        sendMail({
            to: email,
            subject: "User Details Updated",
            text: `Your details have been successfully updated by: ${getUserInfo.username}`
        });
        return res.status(200).json({message: "User details updated successfully."});

    } catch (err: any) {
        next(err);
    }
};