// Node / Third-party modules
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js";
import geoIp from "geoip-lite";
// Models
import { User } from "../../models/user.js";
import { UserDevices } from "../../models/user-devices.js";
// Utils
import * as validation from "../../utils/validation.js";
import { sendMail } from "../../utils/send-mail.js";
export const login = async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    const email = req.body.email;
    const password = req.body.password;
    try {
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
        const emailInput = {
            value: email,
            required: true,
            maximumLength: 100,
            minimumLength: 15,
            isEmail: true
        };
        if (!validation.validate(emailInput)) {
            return res.status(400).json({ emailInputErr: `Invalid email address. Email is required and it must be a valid email address with a length of ${emailInput.minimumLength} - ${emailInput.maximumLength} characters.` });
        }
        ;
        // Detecting login user device
        const uaString = (_a = req.headers["user-agent"]) !== null && _a !== void 0 ? _a : "";
        const parser = new UAParser(uaString);
        const result = parser.getResult();
        const deviceType = result.device.type || "desktop";
        const os = `${(_b = result.os.name) !== null && _b !== void 0 ? _b : ""} ${(_c = result.os.version) !== null && _c !== void 0 ? _c : ""}`.trim(); // "??" => nullish coercion. meaning if the left side is null, then use the right.
        const browser = `${(_d = result.browser.name) !== null && _d !== void 0 ? _d : ""} ${(_e = result.browser.version) !== null && _e !== void 0 ? _e : ""}`.trim();
        const ip = (_f = req.ip) !== null && _f !== void 0 ? _f : "0.0.0.0";
        const deviceLabel = `${browser} on ${os} (${deviceType})`;
        const geo = geoIp.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";
        const getUserByEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (!getUserByEmail) {
            return res.status(404).json({ message: "User with this email address not found!." });
        }
        ;
        const doMatch = await bcrypt.compare(password, getUserByEmail.password);
        if (!doMatch) {
            return res.status(400).json({ message: "Wrong password!." });
        }
        ;
        const token = jwt.sign({ email: getUserByEmail.email, userId: getUserByEmail.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        const existingDevice = await UserDevices.findOne({
            where: {
                deviceLabel: deviceLabel,
                userId: getUserByEmail.id,
                ip: ip
            }
        });
        if (!existingDevice) {
            await UserDevices.create({
                deviceLabel: deviceLabel,
                userAgent: uaString,
                location: location,
                ip: ip,
                userId: getUserByEmail.id
            });
        }
        ;
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
        return res.status(200).json({ message: "You have successfully logged in.", token: token });
    }
    catch (err) {
        next(err);
    }
    ;
};
