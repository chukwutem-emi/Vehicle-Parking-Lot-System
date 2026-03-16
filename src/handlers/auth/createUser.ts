// Model
import {connectDB, User} from "../model/index.js";
// Third-party module
import bcrypt from "bcryptjs";
import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
// Utils
import {corsHeaders} from "../corsHeaders.js";
// CreateUser input validation import
import {createUserInputValidation} from "../validation/createUserInputs.js";
import { userRole } from "../../models/user.js";



interface CreateUserBody {
  username: string;
  password: string;
  confirmPassword: string;
  userAddress: string;
  email: string;
  phone: string;
};


export const createUserHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        console.log("Connecting database......");
        await connectDB();
        console.log("Database connected!.");
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: corsHeaders,
                body: ""
            };
        };
        const body: CreateUserBody = JSON.parse(event.body || "{}");
        const {username, password, confirmPassword, userAddress, email, phone} = body;

        // validation
        const validationResult = createUserInputValidation(username, password, userAddress, email, phone);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
        // password confirmation
        if (confirmPassword !== password) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    confirmPasswordErr: "Password and confirm password do not match. Please ensure both passwords are the same."
                })
            };
        };

        // check if email already exist.
        console.log("Checking E-mail....")
        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });
        console.log("Email Checked.")
        if (checkEmail) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    existingEmailErr: "A user with this email address already exists. Please use a different email address."
                })
            };
        };
        console.log("Hashing Password....");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password Hashed");
        console.log("Creating User....");
        await User.create({
            username: username,
            password: hashedPassword,
            userAddress: userAddress,
            phone: phone,
            email: email,
            userRole: userRole.REGULAR
        });
        console.log("User Created.");
        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "User created successfully!"
            })       
        };
    } catch (err: any) {
        console.error(err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Internal Server Error. Please try again later."
            })
        }
    }
};