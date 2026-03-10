// Models
import {User, connectDB} from "../model/index.js";
//Third-party module
import type {APIGatewayProxyResult, APIGatewayProxyEvent} from "aws-lambda";
// Utils import 
import {corsHeaders} from "../corsHeaders.js";
import {resetPasswordInputValidation} from "../validation/resetPasswordInput.js";
// Node / Third-party modules
import crypto from "crypto";
// Utils
import {sendMail} from "../../src/utils/send-mail.js";




interface UserAttribute {
    email: string;
};

export const resetPasswordHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    await connectDB();
    try {
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
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        };
    };
}