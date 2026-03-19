import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {UAParser} from "ua-parser-js";
import geoIp from "geoip-lite";
import type {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import { sendMail } from "../../utils/send-mail.js";
import {loginInputValidation} from "../validation/loginInputs.js";
import {corsHeaders} from "../corsHeaders.js";
import { initModels, User, UserDevices } from "../../models/index.js";




interface UserAttributes {
    email: string;
    password: string;
};

export const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
        const body: UserAttributes = JSON.parse(event.body || "{}");
        const {email, password} = body;

        const validationResult =  loginInputValidation(email, password);
        if (validationResult !== undefined) {
            return {
                statusCode: validationResult.statusCode,
                body: validationResult.body,
                headers: validationResult.headers
            };
        };
        
        // Detecting login user device
        const uaString    = event.headers["user-agent"] || event.headers["User-Agent"] || "";
        const parser      = new UAParser(uaString);
        const result      = parser.getResult();

        const deviceType       = result.device.type || "desktop";
        const os      : string = `${result.os.name ?? "unknown os"} ${result.os.version ?? ""}`.trim();  // "??" => nullish coercion. meaning if the left side is null, then use the right.
        const browser : string = `${result.browser.name ?? "unknown browser"} ${result.browser.version ?? ""}`.trim();
        const ip = event.requestContext?.identity?.sourceIp ?? "0.0.0.0";
        const deviceLabel = `${browser} on ${os} (${deviceType})`;
        const geo      = geoIp.lookup(ip);
        const location = geo ? `${geo.city ?? "Unknown city"}, ${geo.country ?? "Unknown country"}` : "Unknown";
        
        const getUserByEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (!getUserByEmail) {
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "User with this email address not found!."
                })
            };
        };
        const doMatch = await bcrypt.compare(password, getUserByEmail.password);
        if (!doMatch) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({message: "Wrong password!."})
            };
        };
        const token = jwt.sign({email: getUserByEmail.email, userId: getUserByEmail.id}, process.env.SECRET_KEY as string, {expiresIn: "1h"});
        
        const existingDevice = await UserDevices.findOne({
            where: {
                deviceLabel: deviceLabel,
                userId: getUserByEmail.id,
                ip: ip
            }
        });
        if (!existingDevice) {
            await UserDevices.create({
                deviceLabel : deviceLabel,
                userAgent   : uaString,
                location    : location,
                ip          : ip,
                userId      : getUserByEmail.id
            });
        };
        await sendMail({
            subject: !existingDevice ? "New Device Login Detected!" : "Login Detected!",
            to: email,
            html: `
            <p></p>
            <ul>
                <h3>Login Details:</h3>
                <li>Device: ${deviceLabel}</li>
                <li>:IP ${ip}</li>
                <li>Location: ${location}</li>
                <li>UserAgent: ${uaString}</li>
                <li>UserID: ${getUserByEmail.id}</li>
            </ul>
            `
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "You have successfully logged in.", token: token
            })
        }
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
};
