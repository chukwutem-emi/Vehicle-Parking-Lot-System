import type {APIGatewayProxyResult, APIGatewayProxyEvent} from "aws-lambda";
import {corsHeaders} from "../corsHeaders.js";
import {resetPasswordInputValidation} from "../validation/resetPasswordInput.js";
import crypto from "crypto";
import {sendMail} from "../../utils/send-mail.js";
import { initModels, User } from "../../models/index.js";




interface UserAttribute {
    email: string;
};

const sequelize = initModels();
export const resetPasswordHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body:""
            };
        };
        const body: UserAttribute = JSON.parse(event.body || "{}");

        const {email} = body;

        const validationResult = resetPasswordInputValidation(email);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,   
                body: validationResult.body,
                headers: validationResult.headers
            };
        }

        // Wrapping crypto.randomBytes in a Promise
        const buffer = await new Promise<Buffer>((resolve, reject) => {
            crypto.randomBytes(32, (err, buff) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buff)
                }
            })
        });
        const token = buffer.toString("hex");
        
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User with this E-mail address not found."
                })
            };
        }
        const requestDate: string = new Date().toISOString();
        const currentDateTime = new Date(Date.now() + 3600000) // 1 hr from now
        user.resetToken = token;
        user.resetTokenExpiration = currentDateTime
        await user.save();

        await sendMail({
            to: email,
            subject: "Password Reset",
            html: `
            <p>You requested for password reset on: ${requestDate}</p>
            <p>Click this <a href="${process.env.RESET_PASSWORD}${token}">link</a> to set a new password.</p>
            `
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Password reset token generated. Please check your email address", token: token
            })
        };
    } catch (err: any) {
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        };
    };
}