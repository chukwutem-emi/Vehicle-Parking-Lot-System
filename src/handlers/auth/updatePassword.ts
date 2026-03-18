import type {APIGatewayProxyResult} from "aws-lambda";
import {corsHeaders} from "../corsHeaders.js";
import {updatePasswordInputValidation} from "../validation/resetPasswordInput.js";
import bcrypt from "bcryptjs";
import {type AuthenticatedEvent} from "../lambdaAuth.js";
import { initModels, User } from "../../models/index.js";




interface UserAttribute {
    password: string;
    confirmPassword: string
};

export const updatePasswordHandler = async (event: AuthenticatedEvent): Promise<APIGatewayProxyResult> => {
    const sequelize = initModels();
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database......");
        await sequelize.authenticate();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: UserAttribute = JSON.parse(event.body || "{}");
        const {password, confirmPassword} = body;

        const resetToken = event.pathParameters?.userId;

        if (confirmPassword !== password) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Input error. Password have to match."
                })
            };
        }

        const validationResult = updatePasswordInputValidation(password);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };

        if (!resetToken) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Password reset token is missing."
                })
            };
        };

        const getUserDetails = await User.findOne({
            where: {
                resetToken: resetToken
            }
        });
        if (!getUserDetails) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid password reset token. Please ensure you have the correct token."
                })
            };
        };
        if (!getUserDetails.resetTokenExpiration || getUserDetails.resetTokenExpiration.getTime() < Date.now()) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Password reset token has expired. Please request for a new password reset token."
                })
            };
        };
        const hashedPassword = await bcrypt.hash(password, 10);
    
        getUserDetails.password             = hashedPassword;
        getUserDetails.resetToken           = undefined;
        getUserDetails.resetTokenExpiration = undefined;
    
        await getUserDetails.save();

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Your password has been reset successfully. You can now log in with your new password."
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
};