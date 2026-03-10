import jwt, {} from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
;
export const withAuth = (handler) => {
    return async (event) => {
        try {
            const token = event.headers.Authorization || event.headers.authorization;
            if (!token) {
                return { statusCode: 401, body: JSON.stringify({ message: "Not Authorized." }) };
            }
            const decode = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
            if (!decode) {
                return { statusCode: 401, body: JSON.stringify({ message: "Invalid Token" }) };
            }
            ;
            event.userId = decode.userId;
            return await handler(event);
        }
        catch (err) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: err.message })
            };
        }
    };
};
