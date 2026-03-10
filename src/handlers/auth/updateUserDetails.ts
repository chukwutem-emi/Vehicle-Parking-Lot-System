// Models
import {User, connectDB} from "../model/index.js"
// Utils
import {sendMail} from "../../utils/send-mail.js";
// LambdaAuth import
import { withAuth } from "../lambdaAuth.js";
// update userDetails input validation import
import {updateUserInputValidation} from "../validation/updateUserDetailsInput.js";
// Utils-CORS import 
import {corsHeaders} from "../corsHeaders.js";




interface UpdateUserDetailsAttributes {
    username        : string;
    password        : string;
    userAddress     : string;
    phone           : string;
    email           : string;
    confirmPassword : string;
};


export const updateUserDetailsHandler = withAuth( async (event) => {
    await connectDB();
    try {
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: UpdateUserDetailsAttributes = JSON.parse(event.body || "{}");
        const userId = Number(event.pathParameters?.userId);

        const {username, password, userAddress, phone, email, confirmPassword} = body;
        if (confirmPassword !== password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    confirmPasswordErr: "Password and confirm password do not match. Please ensure both passwords are the same."
                })
            };
        };
        const validationResult = updateUserInputValidation(username, password, userAddress, phone, email);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
        if (isNaN(userId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Invalid userId. UserId must be a number."
                })
            };
        };
        const getUserInfo = await User.findByPk(userId);
        if (!getUserInfo) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User with the specified userId not found. Please ensure you have the correct userId."
                })
            };
        }
        const currentUser = event.requestContext.authorizer?.userId;
        if (!currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized: User ID missing. Please login."
                })
            };
        };
        if (getUserInfo.id !== currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Unauthorized request. You can only update your own user details."
                })
            };
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
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "User details updated successfully."
            })
        }
    } catch (err: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        };
    };
});