// Model
import { User } from "../../models/user.js";
// Node / Third-party modules
import crypto from "crypto";
import bcrypt from "bcryptjs";
// Utils
import { sendMail } from "../../utils/send-mail.js";
import * as validation from "../../utils/validation.js";
export const resetPassword = async (req, res, next) => {
    const email = req.body.email;
    try {
        const emailInput = {
            value: email,
            required: true,
            maximumLength: 100,
            minimumLength: 15,
            isEmail: true
        };
        if (!validation.validate(emailInput)) {
            return res.status(400).json({ emailInputErr: `Invalid email address. Email address is required and it must have a length of: ${emailInput.minimumLength} - ${emailInput.maximumLength} characters. It must also follow this pattern: Your email-username@domain-name.top-domain-name. For example: example@gmail.com, example@test.org, e.t.c.` });
        }
        ;
        // Wrapping crypto.randomBytes in a Promise
        const buffer = await new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, buff) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(buff);
                }
            });
        });
        const token = buffer.toString("hex");
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User with this E-mail address not found." });
        }
        const requestDate = new Date().toISOString();
        const currentDateTime = new Date(Date.now() + 3600000); // 1 hr from now
        user.resetToken = token;
        user.resetTokenExpiration = currentDateTime;
        user.save();
        await sendMail({
            to: email,
            subject: "Password Reset",
            html: `
            <p>You requested for password reset on: ${requestDate}</p>
            <p>Click this <a href="${process.env.RESET_PASSWORD}${token}">link</a> to set a new password.</p>
            `
        });
        return res.status(200).json({ message: "Password reset token generated. Please check your email address", token: token });
    }
    catch (err) {
        next(err);
    }
};
export const updatePassword = async (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetToken = req.params.resetToken;
    try {
        if (confirmPassword !== password) {
            return res.status(400).json({ message: "Input error. Password have to match." });
        }
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
            return res.status(400).json({ passwordInputErr: `Invalid password. Password is required and it must have a length of: ${passwordInput.minimumLength} - ${passwordInput.maximumLength} characters. It must also contain at least ${passwordInput.passwordMinDigitNumbers} digit numbers, at least ${passwordInput.passwordMinSpecialCharacters} special characters, and at least ${passwordInput.passwordMinUppercase} uppercase letters.` });
        }
        ;
        const getUserDetails = await User.findOne({
            where: {
                resetToken: resetToken
            }
        });
        if (!getUserDetails) {
            return res.status(404).json({ message: "Invalid password reset token. Please ensure you have the correct token." });
        }
        ;
        if (getUserDetails.id !== req.userId) {
            return res.status(401).json({ message: "Unauthorized request. You can only reset your own password." });
        }
        ;
        if (!getUserDetails.resetTokenExpiration || getUserDetails.resetTokenExpiration.getTime() < Date.now()) {
            return res.status(400).json({ message: "Password reset token has expired. Please request for a new password reset token." });
        }
        ;
        const hashedPassword = await bcrypt.hash(password, 12);
        getUserDetails.password = hashedPassword;
        getUserDetails.resetToken = undefined;
        getUserDetails.resetTokenExpiration = undefined;
        getUserDetails.save();
        return res.status(200).json({ message: "Your password has been reset successfully. You can now log in with your new password." });
    }
    catch (err) {
        next(err);
    }
};
