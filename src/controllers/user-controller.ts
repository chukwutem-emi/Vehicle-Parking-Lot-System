import {User, userRole} from "../models/user.js";
import type{Request, Response, NextFunction} from "express";
import * as validation from "../utils/validation.js";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const username    : string = req.body.username;
    const password    : string = req.body.password;
    const userAddress : string = req.body.userAddress;
    const email       : string = req.body.email;
    const phone       : string = req.body.phone;

    try {
        const usernameInput: validation.ValidateAble = {
            value         : username,
            required      : true,
            maximumLength : 100,
            minimumLength : 5
        };
        if (!validation.validate(usernameInput)) {
            return res.status(400).json({usernameInputError:`Invalid username. Input length must be: ${usernameInput.minimumLength} - ${usernameInput.maximumLength} characters`});
        };
        const passwordInput: validation.ValidateAble = {
            value         : password,
            required      : true,
            maximumLength : 50,
            minimumLength : 10
        };
        const userAddressInput: validation.ValidateAble = {
            value: userAddress,
            required: true,
            maximumLength: 200,
            minimumLength: 10
        };
        if (!validation.validate(userAddressInput)) {
            return res.status(400).json({userAddressInputError: ``})
        }
        const emailInput: validation.ValidateAble = {
            value: email,
            required: true,
            maximumLength: 100,
            minimumLength: 15,
            isEmail: true
        };
        const phoneInput: validation.ValidateAble = {
            value: phone,
            required: true,
            maximumLength: 12,
            minimumLength: 12
        }
        await User.create({
            username: username,
            password: password,
            userAddress: userAddress,
            phone: phone,
            email: email
        });
        return res.status(201).json({message: "User created successfully!."});
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        };
        next(err);
    };
};