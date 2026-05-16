// Third-party modules
import jwt, {} from "jsonwebtoken";
import { corsHeaders } from "./corsHeaders.js";
const SECRET_KEY = process.env.SECRET_KEY;
;
;
/**
 * Higher-order function to add authentication to Lambda handlers.
 * @param handler - The original Lambda handler function to be wrapped with authentication logic.
 * @returns - A new Lambda handler function that includes authentication checks before invoking the original handler.
 *
 * The function checks for the presence of an Authorization header, verifies the JWT token, and extracts the user ID from the token payload. If the token is valid, it adds the user ID to the event object and calls the original handler. If the token is missing or invalid, it returns a 401 Unauthorized response.
 */
export const withAuth = (handler) => {
    return async (event, context) => {
        context.callbackWaitsForEmptyEventLoop = false;
        try {
            const authToken = event.headers.Authorization || event.headers.authorization;
            if (!authToken || !authToken.startsWith("Bearer ")) {
                return {
                    statusCode: 401,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        message: "Authorization header missing or malformed."
                    })
                };
            }
            const token = authToken.split(" ")[1];
            const decode = jwt.verify(token, SECRET_KEY);
            if (!decode?.userId) {
                return {
                    statusCode: 401,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        message: "Invalid Token"
                    })
                };
            }
            ;
            const authEvent = event;
            authEvent.userId = decode.userId;
            return await handler(authEvent, context);
        }
        catch (err) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ message: err.message })
            };
        }
    };
};
