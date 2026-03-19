import bcrypt from "bcryptjs";
import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {corsHeaders} from "../corsHeaders.js";
import {createUserInputValidation} from "../validation/createUserInputs.js";
import { userRole } from "../../models/user.js";
import { initModels, User } from "../../models/index.js";



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
        // check if phone number exist
        const checkPhone = await User.findOne({
            where: {
                phone: phone
            }
        });
        if (checkPhone) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `A user with this phone number: ${phone} already exist. Please use another phone number.`
                })
            };
        }
        // check if email already exist.
        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (checkEmail) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    existingEmailErr: `A user with this email address: ${email} already exists. Please use a different email address.`
                })
            };
        };
        const hashedPassword = await bcrypt.hash(password, 10);
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
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: err.message
            })
        }
    }
};