import {sendMail} from "../../utils/send-mail.js";
import { withAuth } from "../lambdaAuth.js";
import {updateUserInputValidation} from "../validation/updateUserDetailsInput.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User } from "../../models/index.js";
import bcrypt from "bcryptjs"



interface UpdateUserDetailsAttributes {
    username        : string;
    password        : string;
    userAddress     : string;
    phone           : string;
    email           : string;
    confirmPassword : string;
};


const sequelize = initModels();
export const updateUserDetailsHandler = withAuth( async (event, _context) => {
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
        const body: UpdateUserDetailsAttributes = JSON.parse(event.body || "{}");
        const userId = Number(event.pathParameters?.userId);

        const {username, password, userAddress, phone, email, confirmPassword} = body;
        if (confirmPassword !== password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Password and confirm password do not match. Please ensure both passwords are the same."
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
        if (!userId || isNaN(userId)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
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
                    success: false,
                    message: "User with the specified userId not found. Please ensure you have the correct userId."
                })
            };
        }
        const currentUser = event.userId;
        if (currentUser === undefined || currentUser === null) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized: User ID missing. Please login."
                })
            };
        };
        if (getUserInfo.id !== currentUser) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "Unauthorized request. You can only update your own user details."
                })
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const verifyEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (verifyEmail) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "A user with this e-mail address already exist. Please use another email"
                })
            };
        };
        const verifyPhone = await User.findOne({
            where: {
                phone: phone
            }
        });
        if (verifyPhone) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: "A user with this phone number already exist. Please use another phone number"
                })
            };
        };
        getUserInfo.email       = email;
        getUserInfo.username    = username;
        getUserInfo.password    = hashedPassword;
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
                success: true,
                message: "User details updated successfully."
            })
        }
    } catch (err: unknown) {
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: err instanceof Error ? err.message : "Something went wrong!"
            })
        };
    };
});